module.exports = function (obj, method) {
  var calls = []

  function buffer () {
    calls.push({self: this, args: arguments})
  }

  buffer.unbuffer = function () {
    calls.forEach(function (item) {
      obj[method].apply(item.self, item.args)
    })
    calls = []
  }

  return buffer
}
