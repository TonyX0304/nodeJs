let express = require('express')
// let path = require('path')
let cookieParser = require('cookie-parser')
let file = require('./models/file')
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017";
let app = express()

app.use(express.static(__dirname + '/public'))
app.use(cookieParser())

//设置跨域访问
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})

app.get(/students\S*/, function(req, res){
  let name = req.query.name || ''
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db("xt")
    var whereStr = {'name': name}  // 查询条件
    console.log(whereStr)
    dbo.collection("students"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.json(new Result({data: result}))
      db.close()
    })
  })
})

app.get(/mongo\S*/, function(req, res){
  let remoteAddressId = req.query.id || ''
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db("xt")
    var whereStr = {'records.remoteAddressId': remoteAddressId}  // 查询条件
    console.log(whereStr)
    dbo.collection("testData"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.json(new Result({data: result}))
      db.close()
    })
  })
})

// app.get(/api\S*/, function(req, res){
app.get(/api\S*/, function(req, res){
  let originalUrl = req.originalUrl
  let method = req.method.toLowerCase()
  let protocol = req.protocol
  let query = req.query
  let params = req.params
  let isXhr = req.xhr
  let r = {
    method,
    protocol,
    originalUrl,
    query,
    params,
    isXhr
  }
  res.json(new Result({data: {name: '小米', en: 'mi', ...r, ...req['headers']}}))
})

app.get('/folder', file.getAllFolder)

app.listen('9527')

function Result({code=200, msg='', data = {}}) {
  this.code = code
  this.msg = msg
  this.data = data
}

// let http = require('http')
// let fs = require('fs')
// http.createServer(function(res, req) {
//   req.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
//   if(res.url === '/favicon.ico') {
//     return
//   }
//   console.log(res.url)
//   fs.readFile('./1.txt','utf8', function(err, data) {
//     if (err) {
//       console.log(err) 
//       return
//     }
//     console.log(data)
//     // console.log(__dirname__)
//     req.end(data)
//   })
//   // req.end(res.url)
// }).listen('9527')