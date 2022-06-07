var database = require('../database/config');

// Lista os USERs da farmaceutica
function listarScoresMapa(idMapa, nomeDificuldade, minValue) {

  var instrucao = `
    select pontuacao, round((pontuacao / maxPontuacao) * 100, 2) as precisao, pais, nome, comboMaximo, corteRuim, notasErradas, dataScore, maxPontuacao from Score 
                      join Jogador on fkJogador = idJogador
                      join Dificuldade on fkDificuldade = idDificuldade and nomeDificuldade = '${nomeDificuldade}' 
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa and idMapa = ${idMapa} order by pontuacao desc limit ${minValue}, 20;
  `;

  
  return database.executar(instrucao);
}

function verificarNumPaginas(idMapa, nomeDificuldade) {

  var instrucao = `
  select count(*) as 'qtdscores' from score
  join Dificuldade on fkDificuldade = idDificuldade and nomeDificuldade = '${nomeDificuldade}' 
  join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa and idMapa = ${idMapa};
  `;
  
  return database.executar(instrucao);
} 

function listarScoresJogador(idJogador, minValue, type) {

  var instrucao = `
    select idMapa, nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, nomeDificuldade, notas, maxPontuacao, pontuacao, round((pontuacao / maxPontuacao) * 100, 2) as precisao,
    comboMaximo, corteRuim, notasErradas, dataScore
                      from Score 
                      join Jogador on fkJogador = idJogador and idJogador = ${idJogador}
                      join Dificuldade on fkDificuldade = idDificuldade
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa order by
  `;
  
  if (type == 'top') instrucao += ' pontosDePerformace desc';
  else instrucao += ' dataScore desc '
  instrucao += `limit ${minValue}, 20;`;


  
  return database.executar(instrucao);

}

function verificarNumPaginasJogador(idJogador) {

  var instrucao = `
  select count(*) as 'qtdscores' from score where fkJogador = ${idJogador};
  `;
  
  return database.executar(instrucao);
} 


module.exports = {
  listarScoresMapa,
  verificarNumPaginas,
  listarScoresJogador,
  verificarNumPaginasJogador
}