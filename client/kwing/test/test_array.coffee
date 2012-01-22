require('../lib/array')

exports.testArray = {
  setUp : (callback) ->
    @array = [0...100]
    callback()
  tearDown : (callback) ->
    callback()
  testAt : (test) ->
    test.equal(@array.at(-2), 98)
    test.done()
  testSize : (test) ->
    test.equal @array.size(), 100
    test.done();
  testDeleteIf : (test) ->
    a = [0...10]
    a.deleteIf (v) ->
      v % 2 == 0
    test.deepEqual(a, [1, 3, 5, 7, 9])
    b = [0...10]
    b.deleteIf (v) ->
      v % 3 != 0
    test.deepEqual(b, [0, 3, 6, 9])
    test.done()
  testFirst : (test) ->
    test.equal(@array.first(), 0)
    test.done()
  testLast : (test) ->
    test.equal(@array.last(), 99)
    test.done()
  testFill : (test) ->
    array = [1, 2, 3]
    array.fill(50)
    test.deepEqual(array, [50, 50, 50])
    array2 = [1, 2, 3, 4, 5]
    array2.fill(99, 2, 3)
    test.deepEqual(array2, [1, 2, 99, 99, 5])
    test.done()
  testUniq : (test) ->
    array = [0...10]
    array.uniq()
    test.deepEqual(array, [0...10])
    array2 = [7, 1, 1, 3, 5, 3, 7, 9, 1]
    array2.uniq()
    test.deepEqual(array2, [7, 1, 3, 5, 9])
    test.done()
  testFlatten : (test) ->
    array = [490, [50, 600], [40, 30]]
    array.flatten()
    test.deepEqual(array, [490, 50, 600, 40, 30])
    array2 = [420, [30, [30, 20, 50, [100, 100]], 10], [30]]
    array2.flatten()
    test.deepEqual(array2, [420, 30, 30, 20, 50, 100, 100, 10, 30])
    test.done()
  testTranspose : (test) ->
    array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    array.transpose()
    test.deepEqual(array, [[1, 4, 7], [2, 5, 8], [3, 6, 9]])
    array2 = [[1, 3, 5, 7], [9, 11, 13, 15], [17, 19, 21, 22]]
    array2.transpose()
    test.deepEqual(array2, [[1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 22]])
    test.done()
  testInsert : (test) ->
    array = [0...5]
    array.insert(3, 99)
    test.deepEqual(array, [0, 1, 2, 99, 3, 4])
    array = [0...5]
    array.insert(1, 20, 30, 40, 50)
    test.deepEqual(array, [0, 20, 30, 40, 50, 1, 2, 3, 4])
    array = [0...5]
    array.insert(-4, 20, 30, 40, 50)
    test.deepEqual(array, [0, 20, 30, 40, 50, 1, 2, 3, 4])
    test.done()
  testMap : (test) ->
    array = [5, 7, 9, 11]
    array.map (v, i) ->
      v * v
    test.deepEqual(array, [25, 49, 81, 121])
    test.done()
  testIndexes : (test) ->
    array = @array.indexes(10, 20, 30)
    test.deepEqual(array, [10, 20, 30])
    test.done()
  testClear : (test) ->
    @array.clear()
    test.deepEqual(@array, [])
    test.done()
  testReplace : (test) ->
    @array.replace([10, 20, 3])
    test.deepEqual(@array, [10, 20, 3])
    test.done()
  testMax : (test) ->
    test.equal(@array.max(), 99)
    array = ({number : i * 2 } for i in [0...100])
    result = array.max (a, b) ->
      return 0 if a.number is b.number
      if a.number < b.number then -1 else 1
    test.equal(result, array.last())
    array2 = [10, 5109, 59, -100, 30, 460]
    test.equal(array2.max(), 5109)
    test.done()
  testMin : (test) ->
    test.equal(@array.min(), 0)
    array = ({number : i * 2 } for i in [0...100])
    result = array.min (a, b) ->
      return 0 if a.number is b.number
      return if a.number < b.number then -1 else 1
    test.equal(result, array.first())
    array2 = [10, 5109, 59, -100, 30, 460]
    test.equal(array2.min(), -100)
    test.done()
  testSwap : (test) ->
    array = [0...5]
    array.swap(0, 1)
    test.deepEqual(array, [1, 0, 2, 3, 4])
    array = [0...5]
    array.swap(-1, 1)
    test.deepEqual(array, [0, 4, 2, 3, 1])
    test.done()
  testCount : (test) ->
    array = [0, 0, 1, 2, 3, 4, 5, 6, 1]
    test.equal(array.count(0), 2)
    array2 = ({hoge : i} for i in [0...100])
    for i in [0...10]
      array2.push({ hoge : 10 })
    test.equal(array2.count(10, (a, val) ->
      a.hoge is val
    ), 11)
    test.done()
  testShuffle : (test) ->
    array = []
    array.shuffle()
    test.deepEqual(array, [])
    test.done()
}
