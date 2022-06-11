var userModel = require('../models/userModel');
var jogadorController = require('../controllers/jogadorController');
var jwt = require('jsonwebtoken');
var config = require('../config.json');

/* Fazendo... */
function cadastrar(request, response) {
  var nome = request.body.nomeServer;
  var email = request.body.emailServer;
  var senha = request.body.senhaServer;
  var pais = request.body.paisServer;

  if (nome == undefined) {
    response.status(400).send("Seu nome está undefined!");
  } else if (email == undefined) {
    response.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Sua senha está undefined!");
  } else if (pais == undefined) {
    response.status(400).send("Seu País está undefined!");
  } else {
    userModel.verificarEmail(email).then((result) => {
      if (result.length == 0) {

        userModel.cadastrar(nome, email, senha, pais).then(
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

  if (email == undefined) {
    response.status(400).send("Seu Nome/Email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Sua senha está indefinida!");
  } else {
    userModel.autenticar(email, senha).then(async function (result) {
      console.log(`\nResultados encontrados: ${result.length}`);
      console.log(`Resultados: ${JSON.stringify(result)}`); // transforma JSON em String

      if (result.length == 1) {
        var token = await jwt.sign({ 'email': email, 'senha': senha }, config.secretKey, { 'expiresIn': '1d' });
        response.json({
          'token': token,
          'id': result[0].idJogador
        });
      } else if (result.length == 0) {
        response.status(403).send("Email e/ou senha inválidos(s)");
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }
}

function verificarToken(request, response) {
  var tokenJogador = request.body.tokenJogadorServer;
  var idJogador = request.body.idJogadorServer;
  request.params.idJogadorServer = idJogador;

  if (tokenJogador == undefined) {
    response.json({
      'permission': false
    });
  } else {
    try {
      jwt.verify(tokenJogador, config.secretKey, async (err, decoded) => {
        console.log(err)
        if (err != null) {
          if (err.name == 'TokenExpiredError') {
            response.json({
              'permission': false
            });
          }

        } else {
          let result = (await userModel.verificarToken(decoded.email))[0];
          if (result.idJogador == idJogador) {
            await jogadorController.obterInfo(request, response);
          } else {
            response.json({
              'permission': false
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      response.status(500).json('Erro ao ler o token.');
    }
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
    userModel.editarPerfil(idJogador, nome, email, senha, vrUtilizado, youtubeLink, twitchLink, twitterLink).then(function (result) {
      console.log(`\nResultados encontrados: ${result.length}`);
      console.log(`Resultados: ${JSON.stringify(result)}`); // transforma JSON em String

      response.json(result);
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
  verificarToken
}