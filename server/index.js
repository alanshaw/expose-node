var http = require('http')
var shoe = require('shoe')
var dnode = require('dnode')
var xtend = require('xtend')

var api = {
  fs: require('./api/fs')
}

module.exports = function (opts) {
  opts = opts || {}

  var server = http.createServer()

  var sock = shoe(function (s) {
    var d = dnode(xtend(api, opts.api))
    d.pipe(s).pipe(d)
  })

  sock.install(server, '/dnode')

  return server
}
