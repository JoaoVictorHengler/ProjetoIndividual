var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterHistorico(idJogador) {

  var instrucao = `select rankGlobal, diaRank from historico where fkJogador = ${idJogador};`;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}


module.exports = {
    obterHistorico
}