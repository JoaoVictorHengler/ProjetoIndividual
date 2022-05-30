const { request } = require('http');
const https = require('https');
var sql = require('mssql');
var mysql = require("mysql2");
const { resolve } = require('path');

var requestNum = 0;
var allPromises = [];

const limitePlayers = 30;
const limiteScoresPlayer = 40;
const tipoScore = 'recent';
const country = 'br'

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
    var players = (await search(`https://scoresaber.com/api/players?countries=${country}&withMetadata=true`)).players;
    for (let i = 0; i < limitePlayers; i++) {
        console.log(`Carregando id: ${players[i].id}`)
        let playerInfoPromise = search(`https://scoresaber.com/api/player/${players[i].id}/full`);
        let playerScoresPromise = search(`https://scoresaber.com/api/player/${players[i].id}/scores?limit=${limiteScoresPlayer}&sort=${tipoScore}&withMetadata=true`);
        allPromises.push(Promise.all([playerInfoPromise, playerScoresPromise]));
    }
    setInterval(() => {
        requestNum = 0;
    }, 60000)
    await getPlayerInfo();
    return;
}
async function getPlayerInfo() {
    if (requestNum >= 400) {
        while (requestNum >= 400) {
        }
    }

    Promise.all(allPromises).then(async (player) => {
        for (let i = 0; i< player.length; i++) {
            let playerInfo = player[i][0];
            let playerScores = player[i][1].playerScores;

            for (let i = 0; i < playerScores.length; i++) {
                let level = await search(`https://api.beatsaver.com/maps/hash/${playerScores[i].leaderboard.songHash}`);

                let idMapa = await inserirMapa(level);

                for (let i = 0; i < level.versions[0].diffs.length; i++) {
                    await inserirDificuldade(idMapa, level.versions[0].diffs[i], i);
                }
            }
            
            let [userId, find] = await inserirPlayer(playerInfo)
            if (!find) {
                await inserirHistorico(userId, playerInfo.histories.split(","));
            }
            console.log("Inserir Historico finalizado")
            await inserirScores(userId, playerScores);
            resolve('');
        }
        
    });
    return
}
console.log('Limite Players: ', limitePlayers);
console.log('Limite Scores: ', limiteScoresPlayer);
console.log('Tipo Scores: ', tipoScore);
main();

var mySqlConfig = {
    host: "localhost",
    port: "3306",
    user: "pateta",
    database: "guraSaber",
    password: "pateta@123",
};
/* Feito */
var numId = 0;
async function inserirPlayer(player) {
    let checkPlayer = await executar(
        `select * from Jogador where idScoresaber = '${player.id}'`
    );
    if (checkPlayer.length == 0) {
        let resp = await executar(
            `INSERT INTO Jogador values (null, '${player.name.replaceAll(/'/g,"\\'")}', 'Teste@${numId}.com', SHA2('teste', 512), '${player.country}', 0, 0, '${player.id}', null);`
        );
        numId++;
        console.log('Player adicionado')
        return [resp.insertId, false]
    } else {
        return [checkPlayer[0].idJogador, true];
    }
}
/* Feito, Mas subtrair datas*/
async function inserirHistorico(fkPlayer, historico) {
    for (let i = 0; i < historico.length; i++) {
        let diaHistorico = subDate(new Date().toISOString().slice(0, 10), i + 1)
        await executar(
            `INSERT INTO Historico values (${fkPlayer}, ${i + 1}, ${historico[i]}, '${diaHistorico}');`
        )
    }
    console.log('Historico adicionado')
}
/* Feito */
async function inserirMapa(mapa) {
    let mapas = await executar(
        `select idMapa from Mapa where hashMapa = '${mapa.versions[0].hash.toLowerCase()};'`
    );
    if (mapas.length == 0) {
        let resp = await executar(
            `INSERT INTO Mapa (nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, bpmMapa, duracaoMapa, dataUploadMapa) VALUES ('${mapa.metadata.songName.replaceAll(/'/g,"\\'")}', '${mapa.metadata.songSubName.replaceAll(/'/g,"\\'")}', '${mapa.metadata.levelAuthorName.replaceAll(/'/g,"\\'")}','${mapa.metadata.songAuthorName.replaceAll(/'/g,"\\'")}', '${mapa.versions[0].hash.toLowerCase()}', '${mapa.metadata.bpm}', '${mapa.metadata.duration}', '${mapa.createdAt.substring(0, 10) + ' ' + mapa.createdAt.substring(11, 19)}')`
        );
        console.log('Mapa ' + mapa.metadata.songName.replaceAll(/'/g,"\\'") + ' Adicionado Com Sucesso.')
        return resp.insertId;
    } else {
        console.log('Mapa ' + mapa.metadata.songName.replaceAll(/'/g,"\\'") +' Já existe.')
        return mapas[0].idMapa;
    }
    
    
    
}
/* Feito */
async function inserirDificuldade(fkMapa, diff, i) {
    let dificuldades = await executar(
        `select nomeDificuldade from Dificuldade join Mapa on idMapa = ${parseInt(fkMapa)} and idMapa = fkMapa;`
    );
    if (dificuldades.length == 0) {
        await executar(
            `INSERT INTO Dificuldade values (${i + 1}, '${diff.difficulty}', ${diff.njs.toFixed(2)}, ${diff.offset.toFixed(2)}, ${diff.notes}, ${diff.bombs}, ${diff.obstacles}, ${diff.nps.toFixed(2)}, ${diff.maxScore}, ${parseInt(fkMapa)});`
        );
        console.log('Diff ' + diff.difficulty + 'Adicionada Com Sucesso.')
    } else {
        let diffsExiste = dificuldades.filter((diffBd) => {
            return diffBd.nomeDificuldade == diff.difficulty
        })
        if (diffsExiste.length == 0) {
            await executar(
                `INSERT INTO Dificuldade values (${i + 1}, '${diff.difficulty}', ${diff.njs.toFixed(2)}, ${diff.offset.toFixed(2)}, ${diff.notes}, ${diff.bombs}, ${diff.obstacles}, ${diff.nps.toFixed(2)}, ${diff.maxScore}, ${parseInt(fkMapa)});`
            );
            console.log('Diff ' + diff.difficulty + ' Adicionada Com Sucesso.')
        }
    }
    
    
}

async function inserirScores(fkJogador, scores) {
    let diff = (diffNumber) => {
        switch (diffNumber) {
            case 1:
                return "Easy";
            case 3:
                return "Normal";
            case 5:
                return "Hard";
            case 7:
                return "Expert";
            case 9:
                return "ExpertPlus";
        }
    }
    for (let i = 0; i < scores.length; i++) {
        let nomeDificuldade = diff(scores[i].leaderboard.difficulty.difficulty);
        // console.log(`INSERT INTO Score SELECT ${fkJogador}, idDificuldade, idMapa, ${scores[i].score.baseScore}, '${scores[i].score.timeSet.substring(0, 10) + ' ' + scores[i].score.timeSet.substring(11, 19)}', false FROM Dificuldade JOIN Mapa ON hashMapa = '${scores[i].leaderboard.songHash.toLowerCase()}' and nomeDificuldade = '${nomeDificuldade}';`)
        let checkScore = await executar(
            `select * from score join mapa on idMapa = fkMapa and hashMapa = '${scores[i].leaderboard.songHash.toLowerCase()}' 
                                 join dificuldade on Dificuldade.fkMapa = score.fkMapa and nomeDificuldade = '${nomeDificuldade}';`
        );
        if (checkScore.length == 0) {
            await executar (
                `INSERT INTO Score SELECT ${fkJogador}, idDificuldade, idMapa, ${scores[i].score.baseScore}, ${scores[i].score.badCuts}, ${scores[i].score.missedNotes}, ${scores[i].score.maxCombo},'${scores[i].score.timeSet.substring(0, 10) + ' ' + scores[i].score.timeSet.substring(11, 19)}', false FROM Dificuldade JOIN Mapa ON hashMapa = '${scores[i].leaderboard.songHash.toLowerCase()}' and nomeDificuldade = '${nomeDificuldade}' and idMapa = Dificuldade.fkMapa;` 
            )
            console.log('Score Adicionado')
        } else {
            console.log('Score já existe')
        }
    }
}

function executar(instrucao) {
    // VERIFICA A VARIÁVEL DE AMBIENTE SETADA EM app.js
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucao.replaceAll('\n', ''), function (erro, resultados) {
            conexao.end();
            if (erro) {
                reject(erro);
            }
            /* console.log(resultados); */
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
