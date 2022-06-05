var userModel = require('../models/userModel');
var sha512 = require('js-sha512');
var jwt = require('jsonwebtoken');

/* Fazendo... */
function cadastrar(request, response) {
  var nome = request.body.nomeServer;
  var email = request.body.emailServer;
  var senha = request.body.senhaServer;
  console.log(request.body)
  if (nome == undefined) {
    response.status(400).send("Seu nome está undefined!");
  } else if (email == undefined) {
    response.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Sua senha está undefined!");
  } else {
    userModel.verificarEmail(email).then((resultado) => {
      if (resultado.length == 0) {

        userModel.cadastrar(nome, email, senha).then(
          function (resp) {
            response.json(resp);
          }
        ).catch(function (erro) {
          console.log(erro);
          console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
          response.status(500).json(erro.sqlMessage);
        })
      } else {
        response.status(403).send("Já existe um usuário com este email!");
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

function autenticar(request, response) {
  var email = request.body.emailServer;
  var senha = request.body.senhaServer;
  console.log(request.body)
  if (email == undefined) {
    response.status(400).send("Seu Nome/Email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Sua senha está indefinida!");
  } else {
    userModel.autenticar(email, senha).then(async function (resp) {
      console.log(`\nResultados encontrados: ${resp.length}`);
      console.log(`Resultados: ${JSON.stringify(resp)}`); // transforma JSON em String

      if (resp.length == 1) {
        var token = await jwt.sign({ 'email': email, 'senha': senha }, 'shhhhh', { 'expiresIn': '1d' });
        response.json({
          'token': token,
          'id': resp[0].idJogador
        });
      } else if (resp.length == 0) {
        response.status(403).send("Email e/ou senha inválidos(s)");
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }
}

function editarPerfil(request, response) {
  let idJogador = request.body.idJogadorServer;
  let email = request.body.emailServer;

  if (idJogador == undefined) {
    response.status(400).send("Seu id está undefined!");
  } else if (email == undefined) {
    response.status(400).send("Seu email está undefined!");
  } else if (vrUtilizado == undefined) {
    response.status(400).send("O seu vrUtilizado está undefined!");
  } else {
    userModel.editarPerfil(idJogador, nome, email, senha, vrUtilizado, youtubeLink, twitchLink, twitterLink).then(function (resp) {
      console.log(`\nResultados encontrados: ${resp.length}`);
      console.log(`Resultados: ${JSON.stringify(resp)}`); // transforma JSON em String

      response.json(resp);
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao editar o perfil! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }
}

module.exports = {
  cadastrar,
  autenticar,
  editarPerfil,
}