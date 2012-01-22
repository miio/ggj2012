class Vector
  constructor : (x=0, y=0) ->
    @set(x, y)
  set : (x, y) ->
    x ?= 0
    y ?= 0
    @x = x
    @y = y
    @
  add : (v) ->
    @x += v.x
    @y += v.y
    @
  sub : (v) ->
    @x -= v.x
    @y -= v.y
    @
  scale : (n) ->
    @x *= n
    @y *= n
    @
  div : (n) ->
    @x /= n
    @y /= n
    @
  product : (v) ->
    @x * v.x + @y * v.y
  length : -> 
    Math.sqrt(@x * @x + @y * @y)
  resize : (n) ->
    if @length()
      @scale(n/@length())
    @
  normalize : ->
    @resize(1)
  angle : ->
    (180 * Math.atan2(@y, @x))/Math.PI
  rotate : (deg) ->
    rad = (deg * Math.PI) / 180
    size = @length()
    x = @x
    y = @y
    @x = Math.sin(rad) * y + Math.cos(rad) * x
    @y = Math.cos(rad) * y - Math.sin(rad) * x
    @resize(size)
  clone : ->
    new Vector(@x, @y)
  reverse : ->
    @x *= -1
    @y *= -1
    @
  max : (m) ->
    return @ if @length() <= m
    return @resize m
  min : (m) ->
    return @ if @length() >= m
    return @resize m
  isZero : ->
    return @x is 0 and @y is 0
