var database = require('../database/config');

function listarRankingGlobal() {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarRankingGlobal(): ");

    var instrucao = `select idJogador, nome, pais,  
	    sum(pontuacao) as 'pontuacaoTotal',
	    ROW_NUMBER() OVER (order by	sum(pontuacao) desc) as 'rankGlobal'
        from jogador j1 join score on idJogador = fkJogador group by idJogador;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarRankingNacional(pais) {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarRankingNacional(): ", pais);


    var instrucao = `select idJogador, nome, pais,  
	    sum(pontuacao) as 'pontuacaoTotal',
	    ROW_NUMBER() OVER (order by	sum(pontuacao) desc) as 'rankNacional'
        from jogador j1 join score on idJogador = fkJogador and pais = '${pais}' group by idJogador;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarPaisesCadastrados() {
    console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarPaisesCadastrados()");


    var instrucao = `select pais from jogador group by pais;`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarRankingGlobal,
    listarRankingNacional,
    listarPaisesCadastrados
};