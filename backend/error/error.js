const fs = require('fs');

fs.readFile(__dirname + '/errorcode.json', 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    global.errorcode = JSON.parse(data)
})