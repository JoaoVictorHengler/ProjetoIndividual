var jwt = require('jsonwebtoken');


function main() {
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    console.log(token)
    var token2 = jwt.sign({'email': 'joao.hengler@sptech.school', 'senha': 'teste@123'}, 'shhhhh');
    console.log(token2)
}
main();
