var database = require('../database/config');

// Lista os USERs da farmaceutica
function obterInformacoes(idMapa) {

  var instrucao = `
      select * from Mapa where idMapa = ${idMapa}; 
  `;

  
  return database.executar(instrucao);
}

function listarMapas(minValue) {

  var instrucao = `
  select m1.*, (select count(*) from Score where Score.fkMapa = m1.idMapa and scoreFavorito = 1 group by fkMapa) as 'qtdMapaFavorito', (select count(*) from Score where Score.fkMapa = m1.idMapa group by fkMapa) as 'qtdScores' from Mapa m1 order by qtdScores desc limit ${minValue}, 20;
  `;
  
  return database.executar(instrucao);
}

function verificarNumPaginas() {

  var instrucao = `
  select count(*) as 'qtdmapas' from Mapa;
  `;
  
  return database.executar(instrucao);
} 

function procurar(nomeMapa, minValue) {
  
  var instrucao = `
  select m1.*, (select count(*) from Score where Score.fkMapa = m1.idMapa and scoreFavorito = 1 group by fkMapa) as 'qtdMapaFavorito', 
  (select count(*) from Score where Score.fkMapa = m1.idMapa group by fkMapa) as 'qtdScores' 
  from Mapa m1 where nomeMusica like '%${nomeMapa.replaceAll(/'/g, "\\'")}%' order by qtdScores desc limit ${minValue}, 20;
  `;
  
  return database.executar(instrucao);
} 

module.exports = {
  obterInformacoes,
  listarMapas,
  verificarNumPaginas,
  procurar
}