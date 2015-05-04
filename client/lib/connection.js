var shoe = require('shoe')
var dnode = require('dnode')

var stream = shoe('http://localhost:3232/dnode')
var d = dnode()

d.pipe(stream).pipe(d)

module.exports = d
