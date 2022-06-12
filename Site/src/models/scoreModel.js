var database = require('../database/config');

// Lista os USERs da farmaceutica
function listarScoresMapa(idMapa, nomeDificuldade, minValue) {

  var instrucao = `
    select pontuacao, round((pontuacao / maxPontuacao) * 100, 2) as precisao, pais, idJogador, nome, comboMaximo, corteRuim, notasErradas, dataScore, maxPontuacao from Score 
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
    select idMapa, nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, nomeDificuldade, round((pontuacao / maxPontuacao) * 100, 2) as precisao,
    comboMaximo, corteRuim, notasErradas, dataScore, pontosDePerformace
                      from Score 
                      join Jogador on fkJogador = idJogador and idJogador = ${idJogador}
                      join Dificuldade on fkDificuldade = idDificuldade
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa order by
  `;
  
  if (type == 'top') instrucao += ' pontosDePerformace desc ';
  else instrucao += ' dataScore desc '
  instrucao += `limit ${minValue}, 6;`;


  
  return database.executar(instrucao);

}

function listarScoresFavoritosJogador(idJogador, minValue) {

  var instrucao = `
    select idMapa, nomeMusica, subNomeMusica, criadorMapa, artistaMusica, hashMapa, nomeDificuldade, round((pontuacao / maxPontuacao) * 100, 2) as precisao,
    comboMaximo, corteRuim, notasErradas, dataScore, pontosDePerformace
                      from Score 
                      join Jogador on fkJogador = idJogador and idJogador = ${idJogador}
                      join Dificuldade on fkDificuldade = idDificuldade
                      join Mapa on idMapa = Dificuldade.fkMapa and idMapa = Score.fkMapa 
                      where Score.scoreFavorito = 1
  `;

  instrucao += `limit ${minValue}, 6;`;


  
  return database.executar(instrucao);

}

function verificarNumPaginasJogador(idJogador) {

  var instrucao = `
  select count(*) as 'qtdscores' from score where fkJogador = ${idJogador};
  `;
  
  return database.executar(instrucao);
} 

function verificarNumPaginasFavoritoJogador(idJogador) {

  var instrucao = `
  select count(*) as 'qtdscores' from score where fkJogador = ${idJogador} and score.scoreFavorito = 1;
  `;
  
  return database.executar(instrucao);
} 

module.exports = {
  listarScoresMapa,
  verificarNumPaginas,
  listarScoresJogador,
  verificarNumPaginasJogador,
  listarScoresFavoritosJogador,
  verificarNumPaginasFavoritoJogador
}