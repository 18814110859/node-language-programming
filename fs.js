var fs = require('fs');
fs.readFile('./resource.json', function (er, data) {
    console.log(data);
});


var stream = fs.createReadStream('./resource.json');
stream.on("data", function(chunk) {
    console.log(chunk);
});


stream.on("end", function () {
    console.log("End");
})


