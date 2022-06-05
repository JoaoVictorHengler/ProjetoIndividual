var jwt = require('jsonwebtoken');


async function main() {
    console.log(new Date().toLocaleTimeString());
    /* var token = await jwt.sign({ foo: 'bar' }, 'shhhhh', {'expiresIn': '60s'});
    console.log(token) */
    /* var token2 = jwt.sign({'email': 'joao.hengler@sptech.school', 'senha': 'teste@123'}, 'shhhhh');
    console.log(token2) */
    let token3 = await jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp2aGVuZ2xlckBlbWFpbC5jb20iLCJzZW5oYSI6InRlc3RlQDEyMyIsImlhdCI6MTY1NDQ1ODc3NiwiZXhwIjoxNjU0NTQ1MTc2fQ.B2WUzBv2LFQqjxc6_G2AUpHF0_FSWX1y50ns25HTssY", 'shhhhh');
    console.log(token3);
    /* 04:31:09 
       04:33:09*/
}
main();
