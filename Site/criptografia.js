const { readFileSync, writeFileSync } = require('fs');
    const path = require('Path');


async function main() {
    
    let fileLocation = path.join(__dirname, `./public/assets/userDescription.json`);
    let users = (readFileSync(fileLocation, {encoding:'utf8', flag:'r'}));
    console.log(users)
    /* writeFileSync(fileLocation, 'a'); */
}
main();
