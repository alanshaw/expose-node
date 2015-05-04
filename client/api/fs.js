var xtend = require('xtend/mutable')
var conn = require('../lib/connection')
var callBuffer = require('../lib/call-buffer')
var returnTrue = require('../lib/return-true')
var returnFalse = require('../lib/return-false')

var bufferedApi = [
  'rename',
  'truncate',
  'chown',
  'lchown',
  'chmod',
  'lchmod',
  'stat',
  'lstat',
  'link',
  'symlink',
  'readlink',
  'realpath',
  'unlink',
  'rmdir',
  'mkdir',
  'readdir',
  'utimes',
  'readFile',
  'writeFile',
  'appendFile',
  'exists',
  'access'
].reduce(function (api, method) {
  api[method] = callBuffer(exports, method)
  return api
}, {})

xtend(exports, bufferedApi)

conn.on('remote', function (remote) {
  xtend(exports, remote.fs)

  exports.stat = makeStat(remote.fs, 'stat')
  exports.lstat = makeStat(remote.fs, 'lstat')

  Object.keys(bufferedApi).forEach(function (method) {
    bufferedApi[method].unbuffer()
  })
})

function makeStat (fs, type) {
  return function (path, cb) {
    fs[type](path, function (er, stats) {
      if (er) return cb(er)

      ;[
        'isFile',
        'isDirectory',
        'isBlockDevice',
        'isCharacterDevice',
        'isSymbolicLink',
        'isFIFO',
        'isSocket'
      ].forEach(function (method) {
        stats[method] = stats[method] ? returnTrue : returnFalse
      })

      cb(null, stats)
    })
  }
}
