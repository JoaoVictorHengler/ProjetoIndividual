var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterInformacoes(idMapa) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterInformacoes():", idMapa);

  var instrucao = `
      select Mapa.*, idDificuldade, nomeDificuldade, njs, offsetDificuldade, notas, bombas, obstaculos, notasPSegundo, maxPontuacao from Mapa join Dificuldade on idMapa = fkMapa and idMapa = ${idMapa}; 
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function listarMapas(idMapa) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarMapas():", idMapa);

  var instrucao = `
    select Mapa.*, nomeDificuldade from Mapa join Dificuldade on idMapa = fkMapa order by idMapa;
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

module.exports = {
  obterInformacoes,
  listarMapas
}