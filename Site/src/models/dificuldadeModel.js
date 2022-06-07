var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterTodasDiffs(idMapa) {
  var instrucao = `
      select nomeDificuldade, njs, offsetDificuldade, notas, bombas, obstaculos, notasPSegundo, maxPontuacao from Mapa join Dificuldade on idMapa = fkMapa and idMapa = ${idMapa} order by idDificuldade desc; 
  `;

  return database.executar(instrucao);
}

module.exports = {
  obterTodasDiffs
}