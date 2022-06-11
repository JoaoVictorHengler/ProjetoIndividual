const { request } = require('http');
const https = require('https');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
var sql = require('mssql');
var mysql = require("mysql2");
var { readFileSync, writeFileSync } = require('fs');
var fileLocation = path.join(__dirname, `./Inserts.txt`);


var requestNum = 0;
var allPromises = [];

const limitePlayers = 30;
const limiteScoresPlayer = 30;
const tipoScore = 'top';
const country = ['br', 'us', 'jp'];
const onlyGetPosition = false;


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

var mySqlConfig = {
    host: "localhost",
    port: "3306",
    user: "pateta",
    database: "guraSaber",
    password: "pateta@123",
};

async function main() {
    for (let j = 0; j < country.length; j++) {
        var players = (await search(`https://scoresaber.com/api/players?countries=${country[j]}&withMetadata=true`)).players;
        for (let i = 0; i < limitePlayers; i++) {
            console.log(`Carregando id: ${players[i].id}`)
            let playerInfoPromise = search(`https://scoresaber.com/api/player/${players[i].id}/full`);
            let playerScoresPromise = search(`https://scoresaber.com/api/player/${players[i].id}/scores?limit=${limiteScoresPlayer}&sort=${tipoScore}&withMetadata=true`);
            allPromises.push(Promise.all([playerInfoPromise, playerScoresPromise]));
        }
    }
    setInterval(() => {
        requestNum = 0;
    }, 60000)
    await getPlayerInfo();
    Promise.all(allPromises).then(() => {
        getPlayers();
    })
    return;
}

async function getPlayerInfo() {
    if (requestNum >= 400) {
        while (requestNum >= 400) {
        }
    }

    Promise.all(allPromises).then(async (player) => {
        for (let i = 0; i < player.length; i++) {
            let playerInfo = player[i][0];
            let playerScores = player[i][1].playerScores;

            for (let i = 0; i < playerScores.length; i++) {
                let level = await search(`https://api.beatsaver.com/maps/hash/${playerScores[i].leaderboard.songHash}`);

                let idMapa = await inserirMapa(level);
                if (idMapa != -1) {
                    for (let i = 0; i < level.versions[0].diffs.length; i++) {
                        await inserirDificuldade(idMapa, level.versions[0].diffs[i], i);
                    }
                }
            }

            let [userId, find] = await inserirPlayer(playerInfo)
            await inserirScores(userId, playerScores);
            resolve('');
        }

    });
    return
}

console.log('Limite Players: ', limitePlayers);
console.log('Limite Scores: ', limiteScoresPlayer);
console.log('Tipo Scores: ', tipoScore);

if (!onlyGetPosition) {
    main();
} else {
    getPlayers();
}

async function getPlayers() {
    let players = await executar(`select idJogador, sum(pontosDePerformace), ROW_NUMBER() OVER (order by sum(pontosDePerformace) desc) as 'rankGlobal' from jogador join score on idJogador = fkJogador group by idJogador;`);
    for (let i = 0; i < players.length; i++) {
        inserirHistorico(players[i].idJogador, players[i].rankGlobal);
    }
}


/* Feito */
var numId = 1;
async function inserirPlayer(player) {
    let checkPlayer = await executar(
        `select * from Jogador where idScoresaber = '${player.id}'`
    );
    
    let getNumId = await executar(
        `select idJogador from Jogador order by idJogador desc limit 0, 1`
    );

    if (getNumId.length == 0) {
        numId = 1;
    } else {
        numId = getNumId[0].idJogador + 1;
    }

    if (checkPlayer.length == 0) {
        downloadImage(player.profilePicture, path.resolve(__dirname, 'public', 'assets', 'img', 'playerImg', `${numId}.jpg`));
        if(player.scoreStats.replaysWatched == null) player.scoreStats.replaysWatched = 0;
        let resp = await executar(
            `INSERT INTO Jogador values (null, '${player.name.replaceAll(/'/g, "\\'")}', 'Teste@${numId}.com', SHA2('teste', 512), '${player.country}', '${player.id}', null, ${player.scoreStats.replaysWatched});`
        );
        console.log('Player ' + player.name + ' adicionado');
        return [resp.insertId, false];
    } else {
        return [checkPlayer[0].idJogador, true];
    }
}
/* Feito, Mas subtrair datas*/
async function inserirHistorico(fkPlayer, rankGlobal = null) {
    let date = new Date().getDate()
    let month = ("0" + (new Date().getMonth() + 1)).slice(-2);
    let year = new Date().getFullYear();

    let today = `${year}-${month}-${date}`;
    let diaHistorico = await executar(`SELECT * from Historico where diaRank = '${today}' and fkJogador = ${fkPlayer};`);

    if (rankGlobal == null) {
        let playerInfo = (await executar(`select idJogador, sum(pontosDePerformace), ROW_NUMBER() OVER (order by sum(pontosDePerformace) desc) as 'rankGlobal' from jogador join score on idJogador = fkJogador and idJogador = ${fkPlayer} group by idJogador;`))[0];
        rankGlobal = playerInfo.rankGlobal;
    }
    if (diaHistorico.length == 0) {
        let ultimoHistorico = await executar(`select idHistorico from historico where fkJogador = ${fkPlayer} order by idHistorico desc limit 0, 1`);

        if (ultimoHistorico.length == 0) {
            let i = 1;
            await executar(`INSERT INTO Historico values (${fkPlayer}, ${i}, ${rankGlobal}, '${today}');`);
        } else {
            await executar(`insert into Historico values (${fkPlayer}, ${ultimoHistorico[0].idHistorico + 1}, ${rankGlobal}, '${today}')`);
        }
        
        console.log('Historico adicionado');
    }
        
}
/* Feito */
async function inserirMapa(mapa) {
    if (mapa.versions == undefined) return -1;
    let mapas = await executar(
        `select idMapa from Mapa where hashMapa like '${mapa.versions[0].hash.toLowerCase()}';`
    );
    if (mapas.length == 0) {
        downloadImage(mapa.versions[0].coverURL, path.resolve(__dirname, 'public', 'assets', 'img', 'mapImg', `${mapa.versions[0].hash.toLowerCase()}.jpg`));
        let resp = await executar(
            `INSERT INTO Mapa (nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, bpmMapa, duracaoMapa, dataUploadMapa) VALUES ('${mapa.metadata.songName.replaceAll(/'/g, "\\'")}', '${mapa.metadata.songSubName.replaceAll(/'/g, "\\'")}', '${mapa.metadata.levelAuthorName.replaceAll(/'/g, "\\'")}','${mapa.metadata.songAuthorName.replaceAll(/'/g, "\\'")}', '${mapa.versions[0].hash.toLowerCase()}', '${mapa.metadata.bpm}', '${mapa.metadata.duration}', '${mapa.createdAt.substring(0, 10) + ' ' + mapa.createdAt.substring(11, 19)}')`
        );
        console.log('Mapa ' + mapa.metadata.songName.replaceAll(/'/g, "\\'") + ' Adicionado Com Sucesso.')
        return resp.insertId;
    } else {
        console.log('Mapa ' + mapa.metadata.songName.replaceAll(/'/g, "\\'") + ' Já existe.')
        return -1;
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
        console.log('Diff ' + diff.difficulty + ' Adicionada Com Sucesso.');
    } else {
        let diffsExiste = dificuldades.filter((diffBd) => {
            return diffBd.nomeDificuldade == diff.difficulty
        })
        if (diffsExiste.length == 0) {
            await executar(
                `INSERT INTO Dificuldade values (${i + 1}, '${diff.difficulty}', ${diff.njs.toFixed(2)}, ${diff.offset.toFixed(2)}, ${diff.notes}, ${diff.bombs}, ${diff.obstacles}, ${diff.nps.toFixed(2)}, ${diff.maxScore}, ${parseInt(fkMapa)});`
            );
            console.log('Diff ' + diff.difficulty + ' Adicionada Com Sucesso.');
        } else {
            console.log('Diff já existe');
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
    };
    for (let i = 0; i < scores.length; i++) {
        let nomeDificuldade = diff(scores[i].leaderboard.difficulty.difficulty);
        /* console.log('nomeMapa: ', scores[i].leaderboard.songName);
        console.log('hashMapa: ', scores[i].leaderboard.songHash.toLowerCase());
        console.log('nome Dificuldade: ', nomeDificuldade);
        console.log('número Dificuldade: ', scores[i].leaderboard.difficulty.difficulty); */

        let checkScore = await executar(
            `select * from score join mapa on idMapa = fkMapa and hashMapa = '${scores[i].leaderboard.songHash.toLowerCase()}' join dificuldade on Dificuldade.fkMapa = score.fkMapa and nomeDificuldade = '${nomeDificuldade}' and score.fkJogador = ${fkJogador} and score.fkDificuldade = idDificuldade;`
        );
        console.log(checkScore);
        if (checkScore.length == 0) {
            if (scores[i].score.pp == undefined) scores[i].score.pp = 0;
            await executar(
                `INSERT INTO Score SELECT ${fkJogador}, idDificuldade, idMapa, ${scores[i].score.baseScore}, ${scores[i].score.badCuts}, ${scores[i].score.missedNotes}, ${scores[i].score.maxCombo},'${scores[i].score.timeSet.substring(0, 10) + ' ' + scores[i].score.timeSet.substring(11, 19)}', false, ${scores[i].score.pp * scores[i].score.weight} FROM Dificuldade JOIN Mapa ON hashMapa = '${scores[i].leaderboard.songHash.toLowerCase()}' and nomeDificuldade = '${nomeDificuldade}' and idMapa = Dificuldade.fkMapa;`
            )
            console.log('Score Adicionado');
        } else {
            console.log('Score já existe');
        }
    }
}

function executar(instrucao) {
    // VERIFICA A VARIÁVEL DE AMBIENTE SETADA EM app.js
    /* console.log(instrucao); */
    return new Promise(function (resolve, reject) {
        let dados = readFileSync(fileLocation, { encoding: 'utf8', flag: 'r' })
        dados += `\n${instrucao}`;
        writeFileSync(fileLocation, dados);
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