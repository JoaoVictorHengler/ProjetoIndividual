var mapaModel = require('../models/mapaModel');
var sha512 = require('js-sha512');
var path = require('Path');
/* Fazendo... */
function obterInformacoes(request, response) {
  var idMapa = request.params.idMapaServer;
  
  if (idMapa == undefined) {
    response.status(400).send("Id do mapa está undefined!");
  } else {
    mapaModel.obterInformacoes(idMapa).then((resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível encontrar um mapa com esse id.");
      } else {
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao obter as informações do mapa! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

function listarMapas(request, response) {
    mapaModel.listarMapas().then((resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível listar os mapas.");
      } else {
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
}

function obterImagem(request, response) {
  let fileHash = request.params.imgHashServer;
  console.log('Obtendo Imagem da Hash: ', fileHash);
    let fileLocation = path.join(__dirname, `../../public/assets/img/mapImg/${fileHash}.jpg`);
    console.log(fileLocation)
    response.sendFile(fileLocation);
}

module.exports = {
  obterInformacoes,
  listarMapas,
  obterImagem
}