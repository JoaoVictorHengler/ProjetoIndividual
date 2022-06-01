var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterTodasDiffs(idMapa) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterTodasDiffs():", idMapa);

  var instrucao = `
      select nomeDificuldade, njs, offsetDificuldade, notas, bombas, obstaculos, notasPSegundo, maxPontuacao from Mapa join Dificuldade on idMapa = fkMapa and idMapa = ${idMapa}; 
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

module.exports = {
  obterTodasDiffs
}