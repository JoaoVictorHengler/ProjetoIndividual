var database = require('../database/config');

function listarRankingGlobal(minValue) {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarRankingGlobal(): ", minValue);

    var instrucao = `select idJogador, nome, pais,
    ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc) as 'rank',
    (select round(avg(round(pontuacao / maxPontuacao * 100, 2)),2 ) as 'precisao' from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'precisaoMedia',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'mapasJogados',
    (select sum(pontosDePerformace) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'ppTotal',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 90 group by fkJogador) as 'SS',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 80 and round((pontuacao / maxPontuacao) * 100, 2) < 90 group by fkJogador) as 'S',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 65 and round((pontuacao / maxPontuacao) * 100, 2) < 80 group by fkJogador) as 'A'
    from Jogador join score on idJogador = fkJogador group by idJogador order by ppTotal desc limit ${minValue}, 8;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarRankingNacional(pais, minValue) {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarRankingNacional(): ", pais, minValue);


    var instrucao = `select idJogador, nome, pais,
    ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc) as 'rank',
    (select round(avg(round(pontuacao / maxPontuacao * 100, 2)),2 ) as 'precisao' from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'precisaoMedia',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'mapasJogados',
    (select sum(pontosDePerformace) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'ppTotal',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 90 group by fkJogador) as 'SS',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 80 and round((pontuacao / maxPontuacao) * 100, 2) < 90 group by fkJogador) as 'S',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 65 and round((pontuacao / maxPontuacao) * 100, 2) < 80 group by fkJogador) as 'A'
    from Jogador join score on idJogador = fkJogador and pais = '${pais}' group by idJogador order by ppTotal desc limit ${minValue}, 8;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarPaisesCadastrados() {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarPaisesCadastrados()");


    var instrucao = `select pais from jogador group by pais;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function verificarNumPaginas() {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarNumPaginas(): ");
  
    var instrucao = `
    select count(*) as 'qtdJogadores' from Jogador;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
  } 

module.exports = {
    listarRankingGlobal,
    listarRankingNacional,
    listarPaisesCadastrados,
    verificarNumPaginas
};