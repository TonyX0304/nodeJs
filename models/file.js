let fs = require('fs')
module.exports.getAllFolder = function(req, res) {
  fs.readdir('./public', function(err, _res) {
    if (err) {
      res.send(err)
      return
    }
    let len = _res.length
    var arr = []
    let iterator = function(i) {
      if (i === len) {
        res.send(arr)
        return
      }
      fs.stat('./public/' + _res[i], function(err, stats) {
        arr.push({
          ...stats,
          name: _res[i],
          type: stats.isDirectory() ? 'directory' : 'file'
        })
        console.log(arr)
        iterator(i+1)
      })
    }
    iterator(0)
  })
}