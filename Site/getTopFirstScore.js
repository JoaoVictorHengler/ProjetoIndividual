const { request } = require('http');
const https = require('https');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
var sql = require('mssql');
var mysql = require("mysql2");

var requestNum = 0;
var allPromises = [];

const limitePlayers = 30;
const tipoScore = 'top';
const country = 'br';

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

var numId = 0;

var mySqlConfig = {
    host: "localhost",
    port: "3306",
    user: "pateta",
    database: "guraSaber",
    password: "pateta@123",
};

async function main() {
    let mapas = await executar(`select * from mapa`);
    for (let i = 0; i < mapas.length; i++) {
        let scoresPromise = await getScores(mapas[i].hashMapa);
        console.log(scoresPromise + ' Um')
    }
    console.log('Terminei')

}

console.log('Limite Players: ', limitePlayers);
console.log('Tipo Scores: ', tipoScore);
console.log('País: ', country);
main();


/* Feito */
var numId = 0;

function getScores(hash) {
    return new Promise(async (resolve, reject) => {
        /* try { */
        let hashDiffs = await search(`https://scoresaber.com/api/leaderboard/get-difficulties/${hash}`);
        for (let i = 0; i < hashDiffs.length; i++) {
            let diffName = convertDiffs(hashDiffs[i].difficulty);
            let scoresJson = await search(`https://scoresaber.com/api/leaderboard/by-id/${hashDiffs[i].leaderboardId}/scores?countries=${country}&page=1&withMetadata=true`)
            if (scoresJson.errorMessage != 'Scores not found') {
                let scores = scoresJson.scores;
                for (let j = 0; j < scores.length; j++) {
                    let player = scores[j].leaderboardPlayerInfo;
                    let [userId, find] = await inserirPlayer({
                        'id': player.id,
                        'name': player.name,
                        'country': player.country,
                        'profilePicture': player.profilePicture
                    });
                    if (!find) {
                        let playerInfo = await search(`https://scoresaber.com/api/player/${player.id}/full`);
                        await inserirHistorico(userId, playerInfo.histories.split(","));
                    }
                    await inserirScores(userId, scores[j], hash, diffName);

                }
                resolve('Terminei');
            } else {
                console.log(`Sem score no mapa hash: ${hash} na Dificuldade: ${diffName}`)
                resolve('Sem score');
            }
        }
        /* } catch (e) {
            console.log(e)
            reject('Erro')
        } */

    })
}


async function inserirPlayer(player) {
    let checkPlayer = await executar(
        `select * from Jogador where idScoresaber = '${player.id}';`
    );
    let getNumId = await executar(
        `select idJogador from Jogador order by idJogador desc limit 0, 1`
    )

    numId = getNumId[0].idJogador + 1;

    if (checkPlayer.length == 0) {
        downloadImage(player.profilePicture, path.resolve(__dirname, 'public', 'assets', 'img', 'playerImg', `${numId}.jpg`));
        let resp = await executar(
            `INSERT INTO Jogador values (null, '${player.name.replaceAll(/'/g, "\\'")}', 'Teste@${numId}.com', SHA2('teste', 512), '${player.country}', 0, 0, '${player.id}', null);`
        );
        console.log('Player ' + player.name + 'adicionado')
        return [resp.insertId, false]
    } else {
        return [checkPlayer[0].idJogador, true];
    }
}
/* Feito, Mas subtrair datas*/
async function inserirHistorico(fkPlayer, historico) {
    for (let i = 0; i < historico.length; i++) {
        if (historico[i] != '') {
            let diaHistorico = subDate(new Date().toISOString().slice(0, 10), i + 1)
            await executar(
                `INSERT INTO Historico values (${fkPlayer}, ${i + 1}, ${historico[i]}, '${diaHistorico}');`
            )
        }
    }
    console.log('Historico adicionado')
}


async function inserirScores(fkJogador, scores, hash, nomeDificuldade) {
    /* console.log('nomeMapa: ', scores[i].leaderboard.songName);
    console.log('hashMapa: ', scores[i].leaderboard.songHash.toLowerCase());
    console.log('nome Dificuldade: ', nomeDificuldade);
    console.log('número Dificuldade: ', scores[i].leaderboard.difficulty.difficulty); */

    let checkScore = await executar(
        `select * from score join mapa on idMapa = fkMapa and hashMapa = '${hash}' join dificuldade on Dificuldade.fkMapa = score.fkMapa and nomeDificuldade = '${nomeDificuldade}' and score.fkJogador = ${fkJogador} and score.fkDificuldade = idDificuldade;`
    );

    /* console.log(checkScore) */

    if (checkScore.length == 0) {
        await executar(
            `INSERT INTO Score SELECT ${fkJogador}, idDificuldade, idMapa, ${scores.baseScore}, ${scores.badCuts}, ${scores.missedNotes}, ${scores.maxCombo},'${scores.timeSet.substring(0, 10) + ' ' + scores.timeSet.substring(11, 19)}', false FROM Dificuldade JOIN Mapa ON hashMapa = '${hash}' and nomeDificuldade = '${nomeDificuldade}' and idMapa = Dificuldade.fkMapa;`
        )
        console.log('Score Adicionado')
    } else {
        console.log('Score já existe')
    }

}

function executar(instrucao) {
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

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

function convertDiffs(diff) {
    switch (diff) {
        case 'Easy':
            return 1;
        case 'Normal':
            return 3;
        case 'Hard':
            return 5;
        case 'Expert':
            return 7;
        case 'ExpertPlus':
            return 9;
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

function subDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result.toISOString().substring(0, 10);
}