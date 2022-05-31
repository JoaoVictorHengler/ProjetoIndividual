var userModel = require('../models/userModel');
var sha512 = require('js-sha512');
/* Fazendo... */
function cadastrar(request, response) {
  var nome = request.body.nomeServer;
  var email = request.body.emailServer;
  var senha = request.body.senhaServer;

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
  var nomeEmail = request.body.nomeEmailJogadorServer;
  var senha = request.body.senhaServer;

  if (nomeEmail == undefined) {
    response.status(400).send("Seu Nome/Email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Sua senha está indefinida!");
  } else {
    userModel.autenticar(nomeEmail, senha).then(function (resp) {
      console.log(`\nResultados encontrados: ${resp.length}`);
      console.log(`Resultados: ${JSON.stringify(resp)}`); // transforma JSON em String

      if (resp.length == 1) {
        console.log(resp[0]);
        response.json(resp[0]);
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

function listarUsuariosGlobal(request, response) {
  userModel.listarUsuariosGlobal().then(function (resp) {
    console.log(`\nResultados encontrados: ${resp.length}`);
    console.log(`Resultados: ${JSON.stringify(resp)}`); // transforma JSON em String

    response.json(resp);
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os usuarios global! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })

}

function listarUsuariosNacional(request, response) {
  userModel.listarUsuariosNacional().then(function (resp) {
    console.log(`\nResultados encontrados: ${resp.length}`);
    console.log(`Resultados: ${JSON.stringify(resp)}`); // transforma JSON em String

    response.json(resp);
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os usuarios global! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function editarPerfil(request, response) {
  let idJogador = request.body.idJogadorServer;
  let nome = request.body.nomeServer;
  let email = request.body.emailServer;
  let senha = request.body.senhaServer;

  if (idJogador == undefined) {
    response.status(400).send("Seu id está undefined!");
  } else if (nome == undefined) {
    response.status(400).send("Seu nome está undefined!");
  } else if (email == undefined) {
    response.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    response.status(400).send("Seu senha está undefined!");
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
  listarUsuariosGlobal,
  listarUsuariosNacional,
  editarPerfil
}