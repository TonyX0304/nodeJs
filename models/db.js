// module.exports.connectDb = function() {

// }
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/xt'

function _connectDB(callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    console.log('连接成功')
    callback(err, db)
  })
}

// 查询数据
module.exports.find = function(collectionName, json, callback) {
  _connectDB(function(err, db) {
    if(err) {
      callback(err)
      return
    }
    var dbo = db.db("xt")
    dbo.collection(collectionName).find(json).toArray(function(err, result){
      callback(err, result)
      db.close()
    })
  })
}

// 插入数据
module.exports.insertOne = function(collectionName, json, callback) {
  _connectDB(function(err, db) {
    if(err) {
      callback(err)
      return
    }
    var dbo = db.db("xt")
    dbo.collection(collectionName).insertOne(json, function(err, result){
      callback(err, result)
      db.close()
    })
  })
}

// 删除数据
module.exports.deleteOne = function(collectionName, json, callback) {
  _connectDB(function(err, db) {
    if(err) {
      callback(err)
      return
    }
    console.log(json)
    var dbo = db.db("xt")
    dbo.collection(collectionName).deleteOne(json, function(err, result){
      callback(err, result)
      db.close()
    })
  })
}