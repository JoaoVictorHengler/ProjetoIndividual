var mapaModel = require('../models/mapaModel');
var dificuldadeModel = require('../models/dificuldadeModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterInformacoes(request, response) {
  var idMapa = request.params.idMapaServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do mapa está undefined!");
  } else {
    mapaModel.obterInformacoes(idMapa).then(async (result) => {
      if (result.length == 0) {
        response.status(403).send("Não foi possível encontrar um mapa com esse id.");
      } else {
        for (let i = 0; i < result.length; i++) {
          let diffsMapa = await dificuldadeModel.obterTodasDiffs(result[i].idMapa);
          result[i].dificuldades = diffsMapa;
        }
        response.json(result);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao obter as informações do mapa! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

function listarMapas(request, response) {
  let pagina = request.params.paginaServer;
  mapaModel.listarMapas((pagina * 20) - 20).then(async (result) => {
    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      for (let i = 0; i < result.length; i++) {
        let diffsMapa = await dificuldadeModel.obterTodasDiffs(result[i].idMapa)
        result[i].dificuldades = diffsMapa;
      }
      let qtdPaginas = await obterQtdPaginas(response);
      response.json({
        'qtdPaginas': qtdPaginas,
        'mapas': result
      });
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

async function obterQtdPaginas(response, qtdMapasAchados) {
  try {
    let qtdMapas;
    if (qtdMapasAchados == undefined) qtdMapas = (await mapaModel.verificarNumPaginas())[0].qtdmapas;
    else qtdMapas = qtdMapasAchados;
    if (qtdMapas.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {

      let qtdPagina = 0;
      while (true) {
        if (qtdMapas <= 0) {
          break;
        }

        qtdPagina++;
        qtdMapas -= 20;
      }
      return qtdPagina;
      

    }
  } catch (err) {
    console.log(err);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }

}

function obterImagem(request, response) {
  let fileHash = request.params.imgHashServer;
  if (fileHash == undefined) {
    response.status(403).send("Não foi possível obter a imagem.");
  } else {
    let fileLocation = path.join(__dirname, `../../public/assets/img/mapImg/${fileHash}.png`);
    response.sendFile(fileLocation);
  }
}

async function procurar(request, response) {
  let nomeMapa = request.params.nomeMapaServer;
  let pagina = request.params.paginaServer

  if (pagina == undefined) pagina = 1;

  if (nomeMapa == undefined) {
    response.status(403).send("Nome do Mapa está Undefined.");
  } else {
    mapaModel.procurar(nomeMapa, (pagina * 20) - 20).then(async (result) => {
      
      if (result.length == 0) {
        response.json({
          'qtdPaginas': 0,
          'mapas': []
        });
      } else {
        for (let i = 0; i < result.length; i++) {
          let diffsMapa = await dificuldadeModel.obterTodasDiffs(result[i].idMapa)
          result[i].dificuldades = diffsMapa;
        }
        let qtdPaginas = await obterQtdPaginas(response, result.length);
        response.json({
          'qtdPaginas': qtdPaginas,
          'mapas': result
        });
      }
    });
  }
}

module.exports = {
  obterInformacoes,
  listarMapas,
  obterImagem,
  procurar
}