class ServerConnectionManager
    #@uid : 0
    constructor : ->
        console.log('socket','con')
        @address = 'http://ggj.devap1.miio.info:64550'
        @connect = 0
        @uid = 0
        @inited = false
        @guest_list = []
        @player_id = 2
        @item
    onConnection : ->
        @socket = io.connect @address
        @socket.on 'count', ((count) -> console.log 'count', count.count)
        #@socket.on 'init', @_init(data)
        @socket.on 'init', (data) => @init(data)
        @socket.on 'user_list', ((data) => @guest_list = data)

        #@socket.on 'init', (data) => @uid = data.id
    init : (data) ->
        @uid = data.id
        @player_id = 2
        @inited = true

class Stage extends Group
  constructor : ->
    super
    bg = new BackgroundImage()
    @addChild bg
    #@map = new Map()
    console.log 'hoge','1'
    @server = new ServerConnectionManager()
    @server.onConnection()
    console.log('connect', @server.connect)
    @player = new Player Jubiol.config.PLAYER_POSITION[@server.player_id-1].X, Jubiol.config.PLAYER_POSITION[@server.player_id-1].Y
    @addChild @player
    @bullets = new Group()
    @addChild @bullets
    @player.server = @server
    @guest = new GuestPlayerManager()
    @guest.server = @server
    @addChild @guest
    @field_item = new ItemManager(@server)
    @addChild @field_item
    
  update : (e) ->
      #console.log('list', @server.guest_list)
    @player.update()
    @guest.update()
    @field_item.update()
    #@levelTimer?.tick()
    #if @levelTimer?.isOver()
    #  if @level.level is Jubiol.config.LAST_LEVEL
    #    return new ClearState()
    #  @changeLevel @level.level + 1
    #  Jukebox.play('levelup.wav')
    #for item ,val of @field_item.item_obj
    #for item in @field_item.item_obj
    #    if @player.intersect(item)
    #        @field_item.removeChild item
    #        console.log 'col', item

    #for bullet in @bullets.childNodes.clone()
    #  bullet.update()
    #  if @player.within(bullet, 10)
    #    if @player.invincibleTimer.isActive() 
    #      Jukebox.play('metal.wav')
    #    else
    #      Jukebox.play('bomb.wav')
    #      return new CheckState()
    return false
  changeLevel : (lv) ->

#   return if lv > Jubiol.config.LAST_LEVEL
#   levelClass = eval("Level#{lv}")
#   @level = new levelClass(@)
#   label = new Label "Level #{lv}"
#   label.font = "32px #{Jubiol.config.FONT}"
#   label.x = -50
#   label.y = 440
#   label.addEventListener 'enterframe', ->
#     @x += 20
#      if @x > Jubiol.config.WIDTH
#        @parentNode.removeChild @
    #@addChild label
    #@levelTimer = new Timer(Jubiol.config.FPS * Jubiol.config.LEVEL_TIME)
    #@levelTimer.play()
    #for bullet in @bullets.childNodes
    #  if bullet.v.isZero()
    #    bullet.v = Jubiol.game.stage.player.center().sub(bullet.position()).resize(bullet.speed)

class BackgroundImage extends KawazSprite
    constructor: (x=0,y=0,w=800,h=600) ->
        super w,h,x,y
        @setImage "main_background.png"


class Counter
  constructor : ->
    @count = 0
    @total = 0
    @pressA = false
    @countTimer = new Timer(30)
    @soundCount = 0
    @soundReverse = false
  update : ->
    @countTimer.tick()
    if @countTimer.isOver()
      @countTimer.stop()
      @soundCount = 0
    if Jubiol.game.input.a
      if not @pressA
        Jukebox.play("count#{@soundCount}.wav")
        ++@count
        if @soundCount is 6
          @soundReverse = true
        else if @soundReverse and @soundCount is 0
          @soundReverse = false
        if @soundCount < 6 and not @soundReverse
          ++@soundCount
        else if @soundReverse and @soundCount > 0
          --@soundCount
        @countTimer.reset()
        @countTimer.play()
        @pressA = true
    else
      @pressA = false
  calcRate : ->
    if @total
      return Math.abs(@total-@count)/@total
    return 1
  calcScore : ->
    base = Jubiol.game.stage.level.level * 1000
    score = Math.round(base + @total * 100 - 200 * @calcRate())
    score = 0 if score < 0
    score *= 2 if @total isnt 0 and @total is @count
    return score
