# expose-node

Expose a node process as a dnode RPC interface.

This project is comprised of two halves:

1. Server side code to create a dnode socket and expose a subset of the node API
2. A browserify compatible client side library to connect to the socket, marshall calls and pack/unpack objects not usually JSON serializeable

## Exposing a node process

Create a script in your project - a node process that exposes the node API using the `expose-node` server 

**expose.js**

```js
var server = require('expose-node/server')()

server.listen(3232, function () {
  console.log('Exposed Node.js at :' + 3232)
})
```

## Interacting with exposed node

Require exposed node api modules instead of regular node:

**main.js**

```js
var fs = require('expose-node/client/api/fs')

// Calls dnode remote.fs.readFile
fs.readFile('/etc/passwd', {encoding: 'utf8'}, function (er, contents) {
  console.log(contents)
})
```

Thats it!

You could use the [swapify](https://www.npmjs.org/package/swapify) transform to make the `expose-node` API completely transparent:

Add to your `package.json`:

```json
{
  "browserify": {
    "transform": ["swapify"]
  },
  "swapify": {
    "swaps": {
      "^fs$": "expose-node/client/api/fs"
    }
  }
}
```

Then in **main.js**:

```js
// 'fs' replaced with 'expose-node/client/api/fs' at bundle time
var fs = require('fs')
/* ... */
```

## Exposed API

### File System

rename, truncate, chown, lchown, chmod, lchmod, stat, lstat, link, symlink, readlink, realpath, unlink, rmdir, mkdir, readdir, utimes, readFile, writeFile, appendFile, exists, access

## Extend with your own API

When creating the dnode server, pass your api as an option:

**expose.js**

```js
var server = require('expose-node/server')({
  api: {
    myRpcMethod: function (str, cb) {
      cb(str)
    }
  }
})
```

### Getting the dnode object on the client

**main.js**

```js
var d = require('expose-node/client/lib/connection')

d.on('remote', function (remote) {
  remote.myRpcMethod('HELLO WORLD', function (str) {
    console.log(str)
  })
})
```


