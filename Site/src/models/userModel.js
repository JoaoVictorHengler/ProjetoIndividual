var database = require('../database/config');

// Lista os USERs da farmaceutica
function cadastrar(nome, email, senha, pais) {

  var instrucao = `
    insert into Jogador(nome, email, senha, pais, replaysAssistidos) values ('${nome}', '${email}', SHA2('${senha}', 512), '${pais}', 0);
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function verificarEmail(email) {

  var instrucao = `
    select email from Jogador where email = '${email}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function autenticar(nomeEmail, senha) {

  var instrucao = `
    select * from Jogador where (email = '${nomeEmail}')and senha = SHA2('${senha}', 512);
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function editarPerfil(idJogador, nome, email, senha, vrUtilizado, youtubeLink, twitchLink, twitterLink) {

  var instrucao = `
    update Jogador set nome = '${nome}', email = '${email}', senha = '${senha}', vrUtilizado = '${vrUtilizado}', youtubeLink = '${youtubeLink}', twitchLink = '${twitchLink}', twitterLink = '${twitterLink}' where idJogador = '${idJogador}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function verificarToken(email) {

  var instrucao = `select idJogador from Jogador where email = '${email}';`;

  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

module.exports = {
  cadastrar,
  verificarEmail,
  autenticar,
  editarPerfil,
  verificarToken
}