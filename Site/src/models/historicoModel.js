var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterHistorico(idJogador) {

  var instrucao = `select rankGlobal, diaRank from historico where fkJogador = ${idJogador};`;

  return database.executar(instrucao);
}


module.exports = {
    obterHistorico
}