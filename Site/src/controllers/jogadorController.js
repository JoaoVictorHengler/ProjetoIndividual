var mapaModel = require('../models/mapaModel');
var dificuldadeModel = require('../models/dificuldadeModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterPaises(request, response) {
    let fileLocation = path.join(__dirname, `../../public/assets/country_flags.json`);
    response.sendFile(fileLocation);
}

module.exports = {
    obterPaises
}