const { request } = require('http');
const https = require('https');
var sql = require('mssql');
var mysql = require("mysql2");

var requestNum = 0;
var allPromises = [];

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
    for (let i = 0; i < 1; i++) {
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
    let playerScorePromise = search(`https://scoresaber.com/api/player/${playerID}/scores?limit=20&sort=top&withMetadata=true`);
    allPromises.push(Promise.all([playerInfoPromise, playerScorePromise]));

    Promise.all(allPromises).then(async (player) => {
        let playerInfo = player[0][0];
        let playerScores = player[0][1].playerScores;
        console.log('a')
        for (let i = 0; i < playerScores.length; i++) {
            let level = await search(`https://api.beatsaver.com/maps/hash/${playerScores[i].leaderboard.songHash}`);

            let idMapa = await inserirMapa(level);

            for (let i = 0; i < level.versions[0].diffs.length; i++) {
                inserirDificuldade(idMapa, level.versions[0].diffs[i]);
            }
        }
        /* inserirPlayer(playerInfo.id, playerInfo.name, playerInfo.country) */
        /* inserirHistorico(playerInfo.histories)
        inserirScores(); */
    });
}

main();

var mySqlConfig = {
    host: "localhost",
    port: "3306",
    user: "root",
    database: "bssc",
    password: "Ruaadele210",
};

var numId = 0;
async function inserirPlayer(name) {
    await executar(
        `INSERT INTO Jogador (nome, email, senha) SELECT ('${name}', 'Teste${numId}', SHA2('teste', 512)) from Scores join Jogador on fkJogador = idJogador;`
    );
    numId++;
}

async function inserirHistorico(historico) {
    for (let i = 0; i < historico; i++) {
        await poolBancoDados.execute(
            'INSERT INTO Historico (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave) VALUES (?, ?, ?, ?, ?)',
            [dht11Umidade, dht11Temperatura, luminosidade, lm35Temperatura, chave]
        );
    }
}

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

async function inserirDificuldade(fkMapa, diff) {
    await await executar(
        `INSERT INTO Dificuldade values (null, '${diff.difficulty}', '${diff.difficulty}', ${diff.njs.toFixed(2)}, ${diff.offset.toFixed(2)}, ${diff.notes}, ${diff.bombs}, ${diff.obstacles}, ${diff.nps.toFixed(2)}, ${diff.maxScore}, ${parseInt(fkMapa)});`
    );
    console.log('Diff Adicionada Com Sucesso.')
}

async function inserirScores(historico) {
    for (let i = 0; i < historico; i++) {
        await poolBancoDados.execute(
            'INSERT INTO Historico (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave) VALUES (?, ?, ?, ?, ?)',
            [dht11Umidade, dht11Temperatura, luminosidade, lm35Temperatura, chave]
        );
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

/* await poolBancoDados.execute(
    'INSERT INTO sensores (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave) VALUES (?, ?, ?, ?, ?)',
    [dht11Umidade, dht11Temperatura, luminosidade, lm35Temperatura, chave]
); */
