Array::_index = (index) ->
  if index < 0
    length = @length
    return length + index
  index

Array::at = (index) ->
  @[@_index index]

Array::map = (func) ->
  @[0...@length] = (func value for value in @)

Array::clone = () ->
  @dup()

Array::dup = () ->
  @[0...@length]

Array::each = (func) ->
  (func @[index], index for index in [0...@length])
  @

Array::deleteAt = (index) ->
  index = @_index(index)
  if index >= @length
    return undefined
  @splice index, 1

Array::deleteIf = (func) ->
  @replace (@[i] for i in [0...@length] when not func(@[i], i))

Array::reject = (func) ->
  before = @length
  @deleteIf func
  if before is @length
    return undefined
  @

Array::isEmpty = ->
  @length is 0

Array::isEql = (other, eql = (a, b) ->
  a is b  
) ->
  return false if @length isnt other.length
  for index in [0...@length]
    if not eql(@[index], other[index])
      return false
  true

Array::fill = (val, start=0, end=@length-1) ->
  start = @_index(start)
  end = @_index(end)
  @[start..end] = (val for i in [start..end])
  @

Array::first = ->
  @[0]

Array::last = ->
  last = @_index -1
  @[last]

Array::uniq = (eql = (a, b) ->
  a is b
) ->
  array = []
  for val in @
    if not array.isInclude(val, eql)
      array.push(val)
  @replace(array)

Array::index = (value, eql = (a, b) ->
  a is b
) ->
  for index in [0...@length]
    if eql(@[index], value)
      return index
  undefined

Array::indexes = ->
  (@at(index) for index in arguments)
  
Array::rindex = (value, eql = (a, b) ->
  a is b
) ->
  for index in [@length...0]
    if eql(@[index], value)
      return index
  undefined

Array::flatten = ->
  @replace(@reduce (a, b) ->
    return a.concat if b instanceof Array then b.flatten() else b
  ,[])

Array::transpose = ->
  w = if @isEmpty() then 0 else @length
  h = if @first() instanceof Array then @first().length else 0
  if not w or not h
    return @
  t = ([] for i in [0...h])
  for x in [0...w]
    for y in [0...h]
      t[y][x] = @[x][y]
  @replace t

Array::compact = ->
  @deleteIf (value) ->
    value is undefined

Array::isInclude = (val, eql = (a, b) ->
  a is b
) ->
  for elem in @
    if eql(elem, val)
      return true
  false

Array::size = ->
  @length

Array::swap = (a, b) ->
  a = @_index a
  b = @_index b
  tmp = @[a]
  @[a] = @[b]
  @[b] = tmp
  @

Array::shuffle = ->
  for i in [0...@length]
    @swap(i, Math.floor(Math.random() * @length))
  @

Array::choice = ->
  @[Math.floor(Math.random() * @length)]

Array::count = (val, eql = (a, b) ->
  a is b
) ->
  sum = 0
  for index in [0...@length]
    if eql(@[index], val)
      ++sum
  sum

Array::replace = (other) ->
  @clear()
  for elem in other
    @push(elem)
  @

Array::nitems = ->
  @clone().compact().size()

Array::insert = () ->
  args = Array::slice.call(arguments, 0, arguments.length)
  if args.size() <= 1
    return @
  index = @_index args[0]
  values = args[1...@length]
  (@splice(index + i, 0, values[i]) for i in [0...values.length])
  @

Array::clear = ->
  while not @isEmpty()
      @deleteAt 0

Array::max = (cmp = (a, b) ->
  return 0 if a is b
  if a < b then -1 else 1
) ->
  result = @first()
  @reduce (a, b) ->
    result = b if cmp(result, b) < 0
  result

Array::min = (cmp = (a,b ) ->
  return 0 if a is b
  if a < b then -1 else 1
) ->
  result = @first()
  @reduce (a, b) ->
    result = b if cmp(result, b) >= 0
  result
