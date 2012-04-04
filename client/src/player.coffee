class Player extends KawazSprite
    ###
    # 自身のプレーヤ管理クラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (x=0, y=0) ->
        super 32, 32, x, y
        @server= null
        @setImage 'player.png'

class GuestPlayer extends KawazSprite
    ###
    # ゲストユーザ(自分以外のプレーヤ)クラス #
    # TODO : miio 名前が紛らわしい説があるので、OtherPlayerのほうがいいかも？
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (x=0, y=0) ->
        super 32, 32, x, y
        @server= null
        @setImage 'player.png'

class GuestPlayerManager extends Group
    ###
    # ゲストユーザ(自分以外のプレーヤ)管理クラス #
    # TODO : miio 名前が紛らわしい説があるので、OtherPlayerManagerのほうがいいかも？
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
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

class ItemManager extends Group
    ###
    # ゲーム内オブジェクト管理クラス #
    # 主にお寿司のネタを管理する
    # TODO : miio このあたりを汎用化してパッケージを切り分ける
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor:(server)->
        super
        @server = server
        @item_obj = []
        @sushi_list = new SushiList(@server)
        @addChild @sushi_list.view
    update : (e) ->
        if !@socketFlg
            @server.room_socket.on 'get_object',((elem)=>console.log 'get_object', elem)# ((elem)=>@object_list = elem)
            if @server.object_list?
                @server.room_socket.on 'object_stream', ((elem)=>@createSushi elem)
                @socketFlg=true
        for item_elem in @item_obj
            for item in item_elem
                item.update()
        return true
    removeChild : (i) ->
        ###
        # 対象オブジェクトを削除する
        # TODO : miio 今は座標ずらしてるだけで、処理がどんどん重くなるので何とかする。Kwing側で実装されてたような
        # Param : i 対象オブジェクト
        ###
        super i
        i.x = -10000
        i.y = -10000
    checkHit : (obj) ->
        ###
        # 当たり判定メソッド
        # enchant.js側の当たり判定がうまくいかなかったのでHitItemObjectで一部代用。
        # TODO : enchant側の当たり判定でうまくいかないか再度調べる
        # Param : ItemObject obj 判定対象オブジェクト
        ###
        t = new HitItemObject(obj.x,obj.y)
        console.log @server
        user_area = new HitItemObject(Jubiol.config.PLAYER_POSITION[@server.player_id-1].START_X, 400, Jubiol.config.PLAYER_POSITION[@server.player_id-1].AREA_X, 10)
        for item_elem in @item_obj
            for item in item_elem
                console.log t
                if t.intersect(item) and user_area.intersect(item)
                    console.log 'deleted'
                    @deleteSushi item_elem
                    @server.room_socket.emit 'get_sushi' , { sushi_order_id : item_elem[1].object_id}
                    @sushi_list.add(item_elem[1].object_id)
    createSushi : (elem) ->
        ###
        # 寿司生成メソッド
        # サーバからのAPI情報を元に寿司を生成する
        # TODO : パラメータを専用クラス化したほうがいいかも(やりすぎか？
        # Param : SocketApiResponse(object_stream) elem
        ###
        @item_obj.push [new PlateObject(@server.object_list[elem.object_id].price,700,340), new SushiObject(elem.object_id,700,330)]
        console.log 'item', @item_obj[@item_obj.length-1]
        for item in @item_obj[@item_obj.length-1]
            @addChild item
            item.addEventListener "touchend",((obj) => @checkHit obj )
        #Jukebox.play('show_sushi.wav')
    deleteSushi : (elem) ->
        @removeChild elem[0]
        @removeChild elem[1]

class HitItemObject extends KawazSprite
    ###
    # 当たり判定画像クラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (x=0,y=0,w=10,h=10) ->
        super w,h,x,y
        @setImage "#{name}.gif"

class ItemObject extends KawazSprite
    ###
    # ゲーム内アイテムオブジェクトクラス #
    # TODO : 将来的なオブジェクトの基底クラスとして使いたい
    # TODO : 継承ではなくコンポーネントを持つ構造にしたい
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (name,x=0, y=0) ->
        super 200, 150, x, y
        @server= null
        @setImage "#{name}.png"
        @invincibleTimer = new Timer(45)
        @invincibleTimer.setComplete ->
            @stop()
    update : (e) ->
        @x -= 8

class PlateObject extends ItemObject
    ###
    # 寿司のお皿オブジェクトクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (price,x=0,y=0) ->
        super "plate_#{price}", x, y

class SushiObject extends ItemObject
    ###
    # 寿司オブジェクトクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (object_id,x=0,y=0) ->
        @object_id = object_id
        super "sushi_#{object_id}", x, y

class SushiList extends Group
    ###
    # 取得した寿司一覧クラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor: (server) ->
        @server = server
        @title = "Sushi List<br />"
        @list = []
        @view = new Label(@title)
        @view.x = 600
        @view.y = 20
        @view.font = "32px #{Jubiol.config.FONT}"
    add: (object_id) ->
        if @list.length < 3
            @list.push @server.object_list[object_id].name
        view_text =""
        for list in @list
            view_text += "#{list}<br />"
        @view.text = @title + view_text
