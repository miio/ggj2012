Vector = require('../lib/vector').Vector
exports.testAddVector = (test) ->
  a = new Vector(1, 3)
  b = new Vector(2, 3)
  a.add(b)
  test.equal 3, a.x
  test.equal 6, a.y
  test.done();
