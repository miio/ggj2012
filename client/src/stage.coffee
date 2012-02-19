class ServerConnectionManager
    ###
    # ソケットサーバ接続マネージャクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor : ->
        console.log('socket','con')
        @address = ServerConfig.config.ADDRESS
        @connect = 0
        @uid = 0
        @inited = false
        @guest_list = []
        @player_id = 2
        @item
        @object_list
    onConnection : ->
        ###
        実際にソケットサーバに接続を行う
        ###
        console.log @address
        @socket = io.connect @address
        @socket.on 'count', ((count) -> console.log 'count', count.count)
        @socket.on 'init', (data) => @init(data)
        @socket.on 'user_list', ((data) => @guest_list = data)
    init : (data) ->
        ###
        接続後の初期化メソッド
        TODO : privateメソッド扱いにしたほうがいいかも
        TODO : ゲーム関連のものが混在しているのでちゃんと分ける
        ###
        @uid = data.id
        @player_id = 2
        @inited = true
        @socket.emit 'add_user', {name:'player'}
        @socket.on 'room',((data)=>
            @room_address = "#{@address}/#{data.id}"
            @room_socket = io.connect @room_address
            @guest_list = []
            @room_socket.on 'user_list', ((data) => @guest_list = data)
            @room_socket.on 'error', ((data) -> @console.log 'error', data)
            @room_socket.emit 'game_start'
            @onLobby = true
            console.log 'user',@guest_list
            console.log 'connect_room'
            @room_socket.on 'get_object', ((elem)=>@object_list = elem)
        )

class Stage extends Group
    constructor : ->
        ###
        # ステージクラス #
        # Author : giginet
        # Package : Jubiol
        ###
        super
        bg = new BackgroundImage()
        @addChild bg
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
        @player.update()
        @guest.update()
        @field_item.update()
        return false


    class BackgroundImage extends KawazSprite
        ###
        # 背景画像クラス #
        # TODO : 他の背景画面と被るので何とかする。
        # Author : miio mitani <info@miio.info>
        # Package : Osushi
        # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
        ###
        constructor: (x=0,y=0,w=800,h=600) ->
            super w,h,x,y
            @setImage "main_background.png"

