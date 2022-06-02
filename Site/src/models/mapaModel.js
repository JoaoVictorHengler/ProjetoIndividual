var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterInformacoes(idMapa) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterInformacoes():", idMapa);

  var instrucao = `
      select * from Mapa where idMapa = ${idMapa}; 
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function listarMapas(minValue) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarMapas(): ", minValue);

  var instrucao = `
  select m1.*, (select count(*) from Score where Score.fkMapa = m1.idMapa and scoreFavorito = 1 group by fkMapa) as 'qtdMapaFavorito', (select count(*) from Score where Score.fkMapa = m1.idMapa group by fkMapa) as 'qtdScores' from Mapa m1 order by qtdScores desc limit ${minValue}, 8;
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function verificarNumPaginas() {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarNumPaginas(): ");

  var instrucao = `
  select count(*) as 'qtdmapas' from Mapa;
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
} 

module.exports = {
  obterInformacoes,
  listarMapas,
  verificarNumPaginas
}