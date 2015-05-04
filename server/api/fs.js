var fs = require('fs')

var api = [
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
  api[method] = function () { fs[method].apply(fs, arguments) }
  return api
}, {})

// Make fs.Stats serializeable
function makeStat (type) {
  return function () {
    var args = [].slice.call(arguments)
    var cb = args[args.length - 1]

    args[args.length - 1] = function (er, stats) {
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
        stats[method] = stats[method]() ? true : false
      })

      cb(null, stats)
    }

    fs[type].apply(fs, args)
  }
}

api.stat = makeStat('stat')
api.lstat = makeStat('lstat')

module.exports = api
