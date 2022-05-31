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

function listarMapas() {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarMapas():");

  var instrucao = `
  select m1.*, d.nomeDificuldade, (select count(*) from Score where Score.fkMapa = m1.idMapa and Score.fkDificuldade = d.idDificuldade and Score.scoreFavorito = 1 group by fkMapa) as 'qtdMapaFavorito', (select count(*) from Score where Score.fkMapa = m1.idMapa and Score.fkDificuldade = d.idDificuldade group by fkMapa) as 'qtdScores' from Mapa m1 join Dificuldade d on m1.idMapa = d.fkMapa;
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

module.exports = {
  obterInformacoes,
  listarMapas
}