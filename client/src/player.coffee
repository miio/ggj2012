class Player extends KawazSprite
  constructor: (x=0, y=0) ->
    super 32, 32, x, y
    @server= null
    @setImage 'player.png'
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()
  update : (e) ->
    @invincibleTimer.tick()
    @opacity = 0.5 + 0.5 * Math.cos(@invincibleTimer.now() * 30 * Math.PI / 180)
    @v.set 0, 0
    if Jubiol.game.input.left
      @v.x = -1
    else if Jubiol.game.input.right
      @v.x = 1
    if Jubiol.game.input.up
      @v.y = -1
    else if Jubiol.game.input.down
      @v.y = 1
    @v.resize @speed
    super
    if @x > Jubiol.config.WIDTH - @width
      @x = Jubiol.config.WIDTH - @width
    else if @x < 0
      @x = 0
    if @y > Jubiol.config.HEIGHT - @height
      @y = Jubiol.config.HEIGHT - @height
    else if @y < 0
      @y = 0


class GuestPlayer extends KawazSprite
  constructor: (x=0, y=0) ->
    super 32, 32, x, y
    @server= null
    @setImage 'player.png'
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()

class GuestPlayerManager extends Group
    constructor: ->
        super
        @server = null
        @guest = []
    update : (e) ->
        if @server?
          for user, val of @server.guest_list
            if !@guest[user]?
                @guest[user] = new GuestPlayer
                @addChild @guest[user]
                console.log 'user', user
            #else
            #    @guest[user].update()


class ItemManager extends Group
    constructor:(server)->
        super
        @server = server
        #console.log 'item', @server
        @item = ['a','p','p','l','e']
        @item_obj = []
        for item in @item
            @pos = Math.floor(Math.random()*400)+1
            @item_obj.push new ItemObject(item,@pos,@pos)
            @addChild @item_obj[@item_obj.length-1]
        console.log 'ar', @item_obj
    update : (e) ->
        return true
    removeChild : (i) ->
        super i
        i.x = -10000
        i.y = -10000
    #update : (e) ->
    #  for user, val of @server.guest_list
    #    if !@guest[user]?
    #        @guest[user] = new GuestPlayer
    #        @addChild @guest[user]
    #        console.log 'user', user
        #else
        #    @guest[user].update()

class ItemObject extends KawazSprite
  constructor: (name,x=0, y=0) ->
    super 50, 50, x, y
    @server= null
    @setImage "#{name}.gif"
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()

