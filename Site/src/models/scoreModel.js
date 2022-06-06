var database = require('../database/config');

// Lista os USERs da farmaceutica
function listarScoresMapa(idMapa, nomeDificuldade) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarScores():", idMapa, nomeDificuldade);

  var instrucao = `
    select pontuacao, round((pontuacao / maxPontuacao) * 100, 2) as precisao, pais, nome, comboMaximo, corteRuim, notasErradas, dataScore, maxPontuacao from Score 
                      join Jogador on fkJogador = idJogador
                      join Dificuldade on fkDificuldade = idDificuldade and nomeDificuldade = '${nomeDificuldade}' 
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa and idMapa = ${idMapa} order by pontuacao desc;
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function verificarNumPaginas(idMapa, nomeDificuldade) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarNumPaginas(): ", idMapa, nomeDificuldade);

  var instrucao = `
  select count(*) as 'qtdscores' from score
  join Dificuldade on fkDificuldade = idDificuldade and nomeDificuldade = '${nomeDificuldade}' 
  join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa and idMapa = ${idMapa};
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
} 

function listarScoresJogador(idJogador) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarScoresJogador():", idJogador);

  var instrucao = `
    select pontuacao, round((pontuacao / maxPontuacao) * 100, 2) as precisao, comboMaximo, corteRuim, notasErradas, dataScore, maxPontuacao, notas, nomeDificuldade,
    nomeMusica, subNomeMusica, criadorMapa, artistaMusica from Score 
                      join Jogador on fkJogador = idJogador and idJogador = ${idJogador}
                      join Dificuldade on fkDificuldade = idDificuldade
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa order by dataScore desc;
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);

}
module.exports = {
  listarScoresMapa,
  verificarNumPaginas,
  listarScoresJogador
}