class Level
  level : 0
  constructor : (@stage) ->
    @popRate = @level * 0.08
    @redRate = 0.10 + @level * 0.01
  isPop : ->
    return Math.random() < @popRate
  setup : ->
    @
  teardown : ->
    @
  getBullet : (red) ->
    bullet = new Bullet(Math.random() * Jubiol.config.WIDTH - 32, 0, red)
  popEnemy : (bullets) ->
    return if not @isPop()
    red = Math.random() < @redRate
    bullet = @getBullet(red)
    bullets.addChild bullet
  isClear : ->
    false
  update : ->
    @

class Level1 extends Level
  level : 1
  getBullet : (red) ->
    bullet = new Bullet(100 + Math.random() * (Jubiol.config.WIDTH - 132), 0, red)
    angle = -15 + Math.random() * 30
    bullet.v.rotate(angle)
    return bullet

class Level2 extends Level
  level : 2
  getBullet : (red) ->
    bullet = super
    bullet.v = @stage.player.center().sub(bullet.center()).resize(bullet.speed)
    return bullet

class Level3 extends Level
  level : 3
  getBullet : (red) ->
    bullet = super
    player = @stage.player
    bullet.addEventListener 'enterframe', ->
      @v = player.center().sub(@center()).resize(@speed)
      @v.x *= 0.2
      @v.y = 3
      @update
    return bullet

class Level4 extends Level
  level : 4
  constructor : (@stage) ->
    super
    @max = 30
    @popCount = 0
    @count = 0
    @radius = 50
    @bullets = []
  isPop : ->
    ++@popCount
    @popCount %= 4
    return @popCount is 0
  getBullet : (red) ->
    if @count is 0
      x = Math.random() * (Jubiol.config.WIDTH - 200) + 100
      y = Math.random() * (Jubiol.config.HEIGHT - 200) + 100
      @centerPoint = new Vector(x, y)
      max = @max
      @bullets.each (bullet, i) ->
        bullet.v = new Vector(1, 0)
        bullet.v = bullet.v.rotate(i * 360 / max).resize(bullet.speed / 2)
      @bullets.clear()
    bullet = super
    @bullets.push bullet
    vector = new Vector(1, 0)
    vector.resize(@radius).rotate(360 / @max * @count).add(@centerPoint)
    bullet.x = vector.x
    bullet.y = vector.y
    bullet.v = new Vector()
    ++@count
    @count %= @max
    return bullet

class Level5 extends Level
  level : 5
  constructor : (@stage) ->
    super
    @popCount = 0
    @stars = []
  isPop : ->
    ++@popCount
    @popCount %= 2
    return @popCount is 0
  popEnemy : (bullets) ->
    return if not @isPop()
    if @stars.isEmpty() or @stars.last().isComplete?()
      x = Math.random() * (Jubiol.config.WIDTH - 400) + 200
      y = Math.random() * (Jubiol.config.HEIGHT - 400) + 200
      max = Math.floor(Math.random() * 8 + 4)
      distance = Math.random() * 10 + 15
      star = new Star(x, y, max, distance)
      @stars.push star
    for star in @stars
      red = Math.random() < @redRate
      bullet = star.pop(red)
      if bullet
        bullets.addChild bullet
  update : () ->
    for star in @stars
      star.update()

class Level6 extends Level
  level : 6
  constructor : (@stage) ->
    super
    @centerPoint = new Vector(Jubiol.config.WIDTH / 2, Jubiol.config.HEIGHT / 2)
    @bullets = []
    @v = new Vector(0, 10)
  getBullet : (red) ->
    bullet = super
    vector = @centerPoint.clone().add(@v.rotate(15))
    bullet.x = vector.x
    bullet.y = vector.y
    bullet.v = @v.clone().resize(bullet.speed / 5)
    @bullets.push bullet
    return bullet
  update : () ->
    vector = Jubiol.game.stage.player.center().sub(@centerPoint).normalize()
    @centerPoint.add(vector)

class Level7 extends Level
  level : 7
  constructor : (@stage) ->
    super
    @bullets = []
  getBullet : (red) ->
    bullet = super
    center = new Vector(Jubiol.config.WIDTH / 2, Jubiol.config.HEIGHT / 2)
    vector = Jubiol.game.stage.player.center().sub(center).resize(30)
    bullet.x = center.x
    bullet.y = center.y
    bullet.v = vector
    bullet.addEventListener 'enterframe', ->
      if not @?.flag
        @v.scale(0.9)
        if @v.length() < 1
          @v = new Vector(0.5, 0)
          @v.rotate(Math.random() * 360)
          @flag = true

    @bullets.push bullet
    return bullet
  update : ->
    if Math.floor(Math.random() * 60) is 0
      @redRate += 0.01
