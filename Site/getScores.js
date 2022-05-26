const { request } = require('http');
const https = require('https');
var sql = require('mssql');
var mysql = require("mysql2");

var requestNum = 0;
var allPromises = [];

const limitePlayers = 1;
const limiteScoresPlayer = 5;

async function search(link) {
    return new Promise((resolve, reject) => {
        https.get(link, (resp) => {
            var data = '';
            resp.on('data', function (chunk) {
                data += chunk;
            });

            resp.on('end', function () {
                requestNum++;
                console.log(`Número de Requests feitos: ${requestNum}`);
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    console.log(err);
                    reject("Erro2");
                }
            });
        });
    });
}


async function main() {

    var players = (await search('https://scoresaber.com/api/players?countries=br&withMetadata=true')).players;
    for (let i = 0; i < limitePlayers; i++) {
        getPlayerInfo(players[i].id)
    }
    setInterval(() => {
        requestNum = 0;
    }, 60000)
}
async function getPlayerInfo(playerID) {
    if (requestNum >= 400) {
        while (requestNum >= 400) {
        }
    }


    let playerInfoPromise = search(`https://scoresaber.com/api/player/${playerID}/full`);
    let playerScorePromise = search(`https://scoresaber.com/api/player/${playerID}/scores?limit=${limiteScoresPlayer}&sort=top&withMetadata=true`);
    allPromises.push(Promise.all([playerInfoPromise, playerScorePromise]));

    Promise.all(allPromises).then(async (player) => {
        let playerInfo = player[0][0];
        let playerScores = player[0][1].playerScores;

        for (let i = 0; i < playerScores.length; i++) {
            let level = await search(`https://api.beatsaver.com/maps/hash/${playerScores[i].leaderboard.songHash}`);

            let idMapa = await inserirMapa(level);

            for (let i = 0; i < level.versions[0].diffs.length; i++) {
                inserirDificuldade(idMapa, level.versions[0].diffs[i]);
            }
        }
        
        let idPlayer = await inserirPlayer(playerInfo)
        inserirHistorico(idPlayer, playerInfo.histories)
        inserirScores(idPlayer, playerScores);
    });
}

main();

var mySqlConfig = {
    host: "localhost",
    port: "3306",
    user: "root",
    database: "bssc",
    password: "XXXXXXXXX",
};
/* Feito */
var numId = 0;
async function inserirPlayer(player) {
    let resp = await executar(
        `INSERT INTO Jogador values (null, '${player.name.replaceAll("'", '')}', 'Teste@${numId}', SHA2('teste', 512), 0, 0, 0, null, null, null, null, '${player.id}', '${player.country}' );`
    );
    numId++;
    console.log('Player adicionado')
    return resp.insertId;
}
/* Feito, Mas subtrair datas*/
async function inserirHistorico(fkPlayer, historico) {
    for (let i = 0; i < historico.length; i++) {
        let diaHistorico = subDate(new Date().toISOString().slice(0, 10), i + 1)
        await executar(
            `INSERT INTO Historico values (${fkPlayer}, null, ${historico[i]}, ${diaHistorico});`
        )
    }
    console.log('Historico adicionado')
}
/* Feito */
async function inserirMapa(mapa) {
    let resp = await executar(
        `INSERT INTO Mapa (nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, bpmMapa, duracaoMapa, dataUploadMapa) VALUES 
        ('${mapa.metadata.songName.replaceAll("'", '')}', '${mapa.metadata.songSubName.replaceAll("'", '')}', '${mapa.metadata.levelAuthorName}','${mapa.metadata.songAuthorName}',
        '${mapa.versions[0].hash}', '${mapa.metadata.bpm}', '${mapa.metadata.duration}', '${mapa.createdAt.substring(0, 10) + ' ' + mapa.createdAt.substring(11, 19)}'
        )`
    );
    console.log('Mapa Adicionado Com Sucesso.')
    return resp.insertId;
}
/* Feito */
async function inserirDificuldade(fkMapa, diff) {
    await executar(
        `INSERT INTO Dificuldade values (null, '${diff.difficulty}', '${diff.difficulty}', ${diff.njs.toFixed(2)}, ${diff.offset.toFixed(2)}, ${diff.notes}, ${diff.bombs}, ${diff.obstacles}, ${diff.nps.toFixed(2)}, ${diff.maxScore}, ${parseInt(fkMapa)});`
    );
    console.log('Diff Adicionada Com Sucesso.')
}

async function inserirScores(fkJogador, scores) {
    let diff = (diffNumber) => {
        switch (diffNumber) {
            case "Easy":
                return 1;
            case "Normal":
                return 3;
            case "Hard":
                return 5;
            case "Expert":
                return 7;
            case "ExpertPlus":
                return 9;
        }
    }
    for (let i = 0; i < scores.length; i++) {
        let nomeDificuldade = diff(scores[i].leaderboard.difficulty.difficulty);
        
        await executar (
            `INSERT INTO Score SELECT ${fkJogador}, idDificuldade, idMapa, ${scores[i].score.baseScore}, '${scores[i].score.timeSet.substring(0, 10) + ' ' + scores[i].score.timeSet.substring(11, 19)}', false FROM Dificuldade JOIN Mapa ON hashMapa = ${scores[i].leaderboard.songHash} and nomeDificuldade = '${nomeDificuldade}';` 
        )
        console.log('Score Adicionado')
    }
}

function executar(instrucao) {
    // VERIFICA A VARIÁVEL DE AMBIENTE SETADA EM app.js
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucao, function (erro, resultados) {
            conexao.end();
            if (erro) {
                reject(erro);
            }
            console.log(resultados);
            resolve(resultados);
        });
        conexao.on('error', function (erro) {
            return ("ERRO NO MySQL WORKBENCH (Local): ", erro.sqlMessage);
        });
    });
}

function subDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result.toISOString().substring(0, 10);
  }

/* await poolBancoDados.execute(
    'INSERT INTO sensores (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave) VALUES (?, ?, ?, ?, ?)',
    [dht11Umidade, dht11Temperatura, luminosidade, lm35Temperatura, chave]
); */
