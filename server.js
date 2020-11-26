let express = require('express')
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectId
// let path = require('path')
let cookieParser = require('cookie-parser')
let file = require('./models/file')
let db = require('./models/db')
let app = express()
let url = "mongodb://localhost:27017";

// app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
// 注册中间件
// true: querystring内置模块
// false:qs 第三方模块
// querystring qs 是用来解析键值对字符串为对象格式的包
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// const proxy = require('http-proxy-middleware');
// app.set('port', '9527');           // 你NodeJs代理端口

// var options = {
//   target: 'http://localhost:8080',    //  你服务器端口
//   changeOrigin: true,
// };
// var exampleProxy = proxy(options)
// app.use('/', exampleProxy)             //  ‘/’ 表示对所有请求代理
// app.listen(app.get('port'), () => {
//  console.log(`server running @${app.get('port')}`);
// })
// //设置跨域访问
app.all("*",function(req,res,next){
  console.log(req.path)
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

app.get('/find', function(req, res){
  db.find('students', {}, function(err, result) {
    if(err) {
      res.json(err)
      console.log(err)
      return
    }
    res.json(new Result({data: result}))
  })
})

app.post('/insert', function(req, res){
  db.insertOne('students', {
    name: req.body.name,
    age: req.body.age,
    date: new Date().getTime()
  },function(err, result){
    if(err) {
      res.json(err)
      console.log(err)
      return
    }
    res.json(new Result())
  })
})

app.post('/delete', function(req, res){
  db.deleteOne('students', {
    _id: ObjectId(req.body.id)
  }, function(err, result){
    if(err) {
      res.json(err)
      console.log(err)
      return
    }
    res.json(new Result())
  })
})

app.get(/students\S*/, function(req, res){
  let name = req.query.name || ''
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db("xt")
    var whereStr = name && {'name': name}  // 查询条件
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
    dbo.collection("testData").find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.json(new Result({data: result}))
      db.close()
    })
  })
})

// app.get(/api\S*/, function(req, res){
// app.get(/api\S*/, function(req, res){
//   let originalUrl = req.originalUrl
//   let method = req.method.toLowerCase()
//   let protocol = req.protocol
//   let query = req.query
//   let params = req.params
//   let isXhr = req.xhr
//   let r = {
//     method,
//     protocol,
//     originalUrl,
//     query,
//     params,
//     isXhr
//   }
//   res.json(new Result({data: {name: '小米', en: 'mi', ...r, ...req['headers']}}))
// })

app.get('/api/folder', file.getAllFolder)

app.listen('9527')

function Result({code=200, msg='', data = {}} = {}) {
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