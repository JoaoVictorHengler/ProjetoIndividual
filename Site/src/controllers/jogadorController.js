var historicoModel = require('../models/historicoModel');
var jogadorModel = require('../models/jogadorModel');
var userModel = require('../models/userModel');
const path = require('Path');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const { readFileSync, writeFileSync } = require('fs');
const fileLocation = path.join(__dirname, `../../public/assets/userDescription.json`);

function obterPaises(request, response) {
  let fileLocation = path.join(__dirname, `../../public/assets/country_flags.json`);
  response.sendFile(fileLocation);
}

function listarRankingGlobal(request, response) {
  let pagina = request.params.paginaServer;

  jogadorModel.listarRankingGlobal((pagina * 20) - 20).then(async (result) => {

    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os jogadores.");
    } else {
      let qtdPaginas = await obterQtdPaginas(response, result);
      response.json({
        'qtdPaginas': qtdPaginas,
        'jogadores': result
      });
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function listarRankingNacional(request, response) {
  let paisEscolhido = request.params.paisServer;
  let pagina = request.params.paginaServer;

  if (paisEscolhido == undefined) {
    response.status(403).send("Pais não foi passado.");
  } else {
    jogadorModel.listarRankingNacional(paisEscolhido, (pagina * 20) - 20).then(async (result) => {
      if (result.length == 0) {
        response.status(403).send("Não foi possível listar os jogadores.");
      } else {
        let qtdPaginas = await obterQtdPaginas(response, result);
        response.json({
          'qtdPaginas': qtdPaginas,
          'jogadores': result
        });
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }

}

async function obterQtdPaginas(response) {
  try {
    let result = await jogadorModel.verificarNumPaginas();
    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      let qtdJogadores = result[0].qtdJogadores


      let qtdPaginas = 0;
      while (true) {
        if (qtdJogadores <= 0) {
          break;
        }

        qtdPaginas++;
        qtdJogadores -= 20;

      }
      return qtdPaginas;
    }
  } catch (err) {
    console.log(err);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }
}

function listarPaisesCadastrados(request, response) {

  jogadorModel.listarPaisesCadastrados().then(async (result) => {
    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os paises.");
    } else {
      response.json(result)
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os paises! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })

}

function obterImagem(request, response) {
  let idJogador = request.params.idJogadorServer;
  if (idJogador == undefined) {
    response.status(403).send("Não foi possível obter a imagem.");
  } else {
    let fileLocation = path.join(__dirname, `../../public/assets/img/playerImg/${idJogador}.jpg`);
    response.sendFile(fileLocation);
  }
}

function obterInfo(request, response) {
  let idJogador = request.params.idJogadorServer;

  if (idJogador == undefined) {
    response.status(400).send("Seu id está undefined!");
  } else {
    jogadorModel.obterInfo(idJogador).then(async function (result) {

      if (result.length == 0) {
        response.status(400).send("Usuário não cadastrado!");
      }
      let rankGlobal = (await listarRankingGlobalJogador(idJogador, response))[0];
      if (rankGlobal == undefined) {
        response.json({
          'infoJogador': result[0],
          'rankGlobal': 0,
          'rankNacional': 0
        });
        return;
      }
      let rankNacional = (await listarRankingNacionalJogador(idJogador, rankGlobal.pais, response))[0];
      let historico = await obterHistorico(idJogador, response);
      response.json({
        'infoJogador': result[0],
        'rankGlobal': rankGlobal.rankJogador,
        'rankNacional': rankNacional.rankJogador,
        'historico': historico
      });

    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao obter a informação do jogador! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }
}

async function listarRankingGlobalJogador(idJogador, response) {
  try {
    let result = await jogadorModel.listarRankingGlobalSemLimite();

    let rankGlobal = (result.filter(jogador => {
      return jogador.idJogador == idJogador;
    }));
    return rankGlobal;

  } catch (e) {
    console.log(e);
    console.log("\nHouve um erro ao editar o perfil! Erro: ", e.sqlMessage);
    response.status(500).json(e.sqlMessage);
  }

}

async function listarRankingNacionalJogador(idJogador, pais, response) {
  try {
    let result = await jogadorModel.listarRankingNacionalSemLimite(pais);

    let rankNacional = (result.filter(jogador => {
      return jogador.idJogador == idJogador;
    }));

    return rankNacional;

  } catch (e) {
    console.log(e);
    console.log("\nHouve um erro ao editar o perfil! Erro: ", e.sqlMessage);
    response.status(500).json(e.sqlMessage);
  }
}

async function obterHistorico(idJogador, response) {
  try {
    let result = await historicoModel.obterHistorico(idJogador);

    return result;

  } catch (e) {
    console.log(e);
    console.log("\nHouve um erro ao editar o perfil! Erro: ", e.sqlMessage);
    response.status(500).json(e.sqlMessage);
  }

}

function verificarEdicao(request, response) {
  let idJogador = request.params.idJogadorServer;
  let tokenJogador = request.params.tokenJogadorServer;

  if (tokenJogador == undefined) {
    response.status(403).send("Token indefinido.");
  } else {
    try {
      jwt.verify(tokenJogador, config.secretKey, async (err, decoded) => {
        console.log(err)
        if (err != null) {
          if (err.name == 'TokenExpiredError') {
            response.status(403).send("Token Expirado");
          }

        } else {
          let result = (await userModel.verificarToken(decoded.email))[0];
          if (result.idJogador == idJogador) {
            response.json({
              'permission': true
            });
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

function obterDescricao(request, response) {
  let idJogador = request.params.idJogadorServer;

  if (idJogador == undefined) {
    response.status(403).send("Id do Jogador está inválido.");
  } else {
    let [users, user] = encontrarArquivoEUsuario(idJogador);

    if (user.length == 0) {
      response.json({
        'descricao': ''
      });
      return;
    } else {
      response.json({
        'descricao': user[0].descricao
      });
    }
  }
}

function setarDescricao(request, response) {
  let idJogador = request.body.idJogadorServer;
  let dadosDescricao = request.body.dadosDescricaoServer

  console.log('IdJogador: ', idJogador)
  if (idJogador == undefined) {
    response.status(403).send("Id do Jogador está inválido.");
  } else if (dadosDescricao == undefined) {
    response.status(403).send("Dados da descrição inválidos.");
  } else {

    try {
      let [users, user] = encontrarArquivoEUsuario(idJogador);

      if (user.length == 0) {
        users.push({
          "idJogador": idJogador,
          "descricao": dadosDescricao
        });
      } else {
        user[0].descricao = dadosDescricao;
      }

      writeFileSync(fileLocation, JSON.stringify({ "usuarios": users }));
      console.log('Edição de perfil Concluída.')
      response.json({
        'status': true,
        'descricao': user[0].descricao
      });
      return;
    } catch (err) {
      console.log(err);
      response.status(500).json('Erro ao editar o perfil');
    }



  }
}

function encontrarArquivoEUsuario(idJogador) {
  let users = JSON.parse(readFileSync(fileLocation, { encoding: 'utf8', flag: 'r' })).usuarios;

  let user = users.filter(user => {
    return user.idJogador == idJogador;
  });
  return [users, user];
}

module.exports = {
  obterPaises,
  listarRankingGlobal,
  listarRankingNacional,
  listarPaisesCadastrados,
  obterImagem,
  obterInfo,
  verificarEdicao,
  obterDescricao,
  setarDescricao
}