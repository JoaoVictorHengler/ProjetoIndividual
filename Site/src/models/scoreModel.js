var database = require('../database/config');

// Lista os USERs da farmaceutica
function listarScores(idMapa, idDificuldade) {
  console.log("ACESSEI O USER MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarScores():", idMapa, idDificuldade);

  var instrucao = `
    select pontuacao, round((pontuacao / maxScore) * 100, 2) as precisao, pais, nome, comboMaximo, corteRuim, notasErradas, dataScore, maxScore from Score 
                      join Jogador on fkJogador = idJogador
                      join Dificuldade on fkDificuldade = idDificuldade order by pontuacao;
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}


module.exports = {
  listarScores
}