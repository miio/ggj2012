class Player extends KawazSprite
  constructor: (x=0, y=0) ->
    super 32, 32, x, y
    @server= null
    @setImage 'player.png'
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()


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
        #for item in @item
        #    @pos = Math.floor(Math.random()*400)+1
        #    @item_obj.push new ItemObject(item,@pos,@pos)
        #    @addChild @item_obj[@item_obj.length-1]
        #console.log 'ar', @item_obj
        @sushi_list = new SushiList()
        @addChild @sushi_list.view
    update : (e) ->
        rand = Math.floor(Math.random()*100)+1
        if rand < 3
            @item_obj.push [new PlateObject('plate_1',700,340), new ItemObject('sushi_2',700,330)]
            for item in @item_obj[@item_obj.length-1]

                @addChild item
                item.addEventListener "touchend",((obj) => @checkHit obj )
        for item_elem in @item_obj
            for item in item_elem
                item.update()
        return true
    removeChild : (i) ->
        super i
        i.x = -10000
        i.y = -10000
    checkHit : (obj) ->
        t = new HitItemObject(obj.x,obj.y)
        console.log @server
        user_area = new HitItemObject(Jubiol.config.PLAYER_POSITION[@server.player_id-1].START_X, 400, Jubiol.config.PLAYER_POSITION[@server.player_id-1].AREA_X, 10)
        for item_elem in @item_obj
            for item in item_elem
                console.log t
                if t.intersect(item) and user_area.intersect(item)
                    console.log 'deleted'
                    @removeChild item_elem[0]
                    @removeChild item_elem[1]
                    @sushi_list.add(1)
    #update : (e) ->
    #  for user, val of @server.guest_list
    #    if !@guest[user]?
    #        @guest[user] = new GuestPlayer
    #        @addChild @guest[user]
    #        console.log 'user', user
        #else
        #    @guest[user].update()

class HitItemObject extends KawazSprite
    constructor: (x=0,y=0,w=10,h=10) ->
        super w,h,x,y
        @setImage "#{name}.gif"

class ItemObject extends KawazSprite
  constructor: (name,x=0, y=0) ->
    super 200, 150, x, y
    @server= null
    @setImage "#{name}.png"
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()

  update : (e) ->
      @x -= 8

class PlateObject extends KawazSprite
  constructor: (name,x=0,y=0) ->
    super 200, 150, x, y
    @server= null
    @setImage "#{name}.png"
    @invincibleTimer = new Timer(45)
    @invincibleTimer.setComplete ->
      @stop()
  update : (e) ->
      @x -= 8

class SushiList extends Group
    constructor: ->
        @title = "Sushi List<br />"
        @list = []
        @view = new Label(@title)
        @view.x = 600
        @view.y = 20
        @view.font = "32px #{Jubiol.config.FONT}"
    add: (item) ->
        if @list.length < 3
            @list.push Jubiol.config.SUSHI_NAME[item]
        view_text =""
        for list in @list
            view_text += "#{list}<br />"
        @view.text = @title + view_text


