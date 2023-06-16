const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient
        .connect(process.env.MONGODB_URL)
        .then(client => {
            console.log("connected");
            _db = client.db('shop');
            callback();
        })
        .catch(err => console.log(err))
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'no database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;