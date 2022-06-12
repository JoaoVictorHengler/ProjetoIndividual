var database = require('../database/config');

function listarRankingGlobal(minValue) {
    
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
    from Jogador join score on idJogador = fkJogador group by idJogador order by ppTotal desc limit ${minValue}, 20;`;

    
    return database.executar(instrucao);
}

function listarRankingNacional(pais, minValue) {


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
    from Jogador join score on idJogador = fkJogador and pais = '${pais}' group by idJogador order by ppTotal desc limit ${minValue}, 20;`;

    
    return database.executar(instrucao);
}

function listarPaisesCadastrados() {


    var instrucao = `select pais from jogador group by pais;`;

    
    return database.executar(instrucao);
}

function verificarNumPaginas() {
  
    var instrucao = `
    select count(*) as 'qtdJogadores' from Jogador;
    `;
    
    return database.executar(instrucao);
}

function listarRankingGlobalSemLimite() {

    var instrucao = `select idJogador, pais, ROW_NUMBER() OVER (order by sum(pontosDePerformace) desc) as 'rankJogador'
    from Jogador join score on idJogador = fkJogador group by idJogador order by rankJogador desc;`;

    
    return database.executar(instrucao);
}

function listarRankingNacionalSemLimite(pais) {


    var instrucao = `select idJogador, nome, pais,
    ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc) as 'rankJogador'
    from Jogador join score on idJogador = fkJogador and Jogador.pais = '${pais}' group by idJogador order by rankJogador desc;`;

    
    return database.executar(instrucao);
}

function obterInfo(idJogador) {
  
    var instrucao = `select nome, pais, idScoresaber, vrUtilizado,
      (select round(avg(round(pontuacao / maxPontuacao * 100, 2)),2 ) as 'precisao' from Dificuldade 
        join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
        and Jogador.idJogador = fkJogador group by fkJogador) as 'precisaoMedia',
        (select sum(pontosDePerformace) from Dificuldade 
        join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
        and Jogador.idJogador = fkJogador group by fkJogador) as 'ppTotal',
        (select sum(pontuacao)  from Dificuldade 
        join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
	    where Jogador.idJogador = fkJogador group by fkJogador) as 'pontuacaoTotal',
        replaysAssistidos
      from Jogador where idJogador = ${idJogador} group by idJogador;`;
  
    return database.executar(instrucao);
}

function procurar(nomeJogador, minValue) {
  
    var instrucao = `select idJogador, nome, pais,
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'mapasJogados'
    from Jogador where nome like '%${nomeJogador.replaceAll(/'/g, "\\'")}%' group by idJogador limit ${minValue}, 20;`;
  
    return database.executar(instrucao);
}

function favoritarMapa(idJogador, idMapa, tipo) {
    let instrucao;
    if (tipo == 'love') {
        instrucao = `
            update score set scoreFavorito = true where fkJogador = ${idJogador} and fkMapa = ${idMapa};
        `;
    } else {
        instrucao = `
            update score set scoreFavorito = false where fkJogador = ${idJogador} and fkMapa = ${idMapa};
        `;
    }

    return database.executar(instrucao);
}

module.exports = {
    listarRankingGlobal,
    listarRankingNacional,
    listarPaisesCadastrados,
    verificarNumPaginas,
    listarRankingGlobalSemLimite,
    listarRankingNacionalSemLimite,
    obterInfo,
    procurar,
    favoritarMapa
};