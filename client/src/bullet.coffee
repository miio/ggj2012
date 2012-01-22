class Bullet extends KawazSprite
  constructor : (x=0, y=0, @red=false) ->
    super 12, 12, x, y
    if @red
      @setImage "bullet1.png"
      ++Jubiol.game.currentScene.counter.total
    else
      @setImage "bullet.png"
    @v.y = 10
  update : (e) ->
    super
    if @x < -100 or @x > Jubiol.config.WIDTH + 100 or @y < -100 or @y > Jubiol.config.HEIGHT + 100
      Jubiol.game.stage.bullets.removeChild @

class Star
  constructor : (x, y, @max=10, @distance=20) ->
    rootPoint = new Vector(x, y)
    @direction = new Vector(1, 0)
    @direction.resize(@distance)
    @rotateCount = 0
    radius = @max * @distance / 2
    @centerPoint = rootPoint.clone().add(new Vector(radius, - radius * Math.tan(Math.PI / 10)))
    @currentPoint = rootPoint.clone()
    @bullets = []
  pop : (red) ->
    unless @isComplete()
      vector = @currentPoint.add(@direction).clone()
      bullet = new Bullet(vector.x, vector.y, red)
      bullet.v = new Vector()
      @bullets.push bullet
      count = @bullets.length
      if count % @max is 0
        @direction.rotate(144)
        ++@rotateCount
      return bullet
    return false
  update : ->
    if @isComplete()
      if not @v?
        @v = Jubiol.game.stage.player.position().sub(@centerPoint).resize(7)
      @centerPoint.add(@v)
      for bullet in @bullets
        sub = bullet.center().sub(@centerPoint)
        rotated = sub.clone().rotate(5)
        bullet.v = @v.clone().add(rotated.sub(sub))
  isComplete : () ->
    return @rotateCount >= 5
