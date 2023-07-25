const mongoose = require('mongoose');
let db;

mongoose.set("strictQuery", false);
db = mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
}).catch(error=> {
    return console.log(`Unable to connect \n\n ${error}`);
});

module.exports = db;