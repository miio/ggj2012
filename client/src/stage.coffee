class Scal
    ###
    # SocketConnectionAbstractLayerクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    @socket
    constructor : ->
        console.log('socket','con')
        @address = ServerConfig.config.ADDRESS
    onConnection : ->
        ###
        実際にソケットサーバに接続を行う
        ###
        console.log @address
        @socket = io.connect @address
        Scal.socket = @socket

class AppModel
    ###
    # AppModelクラス#
    # 実装は落ち着いてから。とりあえずRailsのパクリ予定? 無くなる可能性高い
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    find : ->
        ###
        # データ取得メソッド
        ####
    all : ->
        ###
        # 保持されているデータを全て取得する
        ###
    save : ->
        ###
        # 保存メソッド
        # emitでいい気もするがどこまで抽象化しようか
        ###
    update : ->
        ###
        # 更新メソッド
        ###
    onAction : ->
        ###
        # アクションの定義
        # 具体的にはソケット通信はイベントドリブンのため、
        # トリガーをセットする必要がある。
        ####
    condition : ->
        ###
        # 取得のコンディション
        # @TODO miio こいつは別クラスでいくね？
        ####

class SocketModel extends AppModel
    ###
    # SocketModelクラス#
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    @datastore
    @server
    constructor : ->
        if Scal.socket?
            console.log Scal.socket
            @server = Scal.socket
        else
            console.log 'create instance'
            @server = new Scal
            @server.onConnection()
            @server = @server.socket
            Scal.socket = @server
            console.log @server

class RoomModel extends SocketModel
    ###
    # Room Model クラス#
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor : ->
        super
        console.log @server
        @connect = 0
        @uid = 0
        @inited = false
        @guest_list = []
        @player_id = 1
        @item
        @object_list
        @onLobby = false
        @onReady = false
        @server.on 'init', (data) => @init(data)
        @server.on 'user_list', ((data) => @guest_list = data)
    init : (data) ->
        ###
        接続後の初期化メソッド
        TODO : privateメソッド扱いにしたほうがいいかも
        TODO : ゲーム関連のものが混在しているのでちゃんと分ける
        ###
        @uid = data.id
        @inited = true
        @server.emit 'add_user', {name:'player'}
        @server.on 'room',((data)=>
            @room_address = "#{ServerConfig.config.ADDRESS}/#{data.id}"
            console.log @room_address
            @room_socket = io.connect @room_address
            @guest_list = []
            @room_socket.on 'user_list', ((data) => @setPlayerList(data))
            @room_socket.on 'error', ((data) => console.log 'room_model_socket_error', data)
            @onLobby = true
            console.log 'connect_room'
#            @room_socket.emit 'game_start'
#            @room_socket.emit 'get_object', ((elem)=>@object_list = elem)
        )
    setPlayerList : (data) ->
        @guest_list = data
        @setMyUserPosition data
        console.log 'all_user', @guest_list
#        console.log 'size', @guest_list.length
#if data.length >= 2 #暫定2
        unless @onReady
            @room_socket.emit 'game_start'
            @room_socket.on 'get_object', ((elem)=>@object_list = elem)
            @onReady = true
    setMyUserPosition : (data) ->
        for user,val of data
            console.log val.player
            if @uid == user
                @player_id = val.player
#class GuestList extends SocketModel
#class ObjectStream extends SocketModel
#class ModelAutoload
class ServerConnectionManager
    ###
    # ソケットサーバ接続マネージャクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Kwing.net
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    # Notice : This class Deprecated
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
        console.log 'init_data', data
        @uid = data.id
        @player_id = 2
        @inited = true
        @socket.emit 'add_user', {name:'player'}
        @socket.on 'room',((data)=>
            @room_address = "#{@address}/#{data.id}"
            cnsole.log @room_address
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
    ###
    # ステージクラス #
    # Author : miio mitani <info@miio.info>
    # Package : Osushi
    # Licence : GNU Lesser General Public License v3 (http://www.gnu.org/licenses/)
    ###
    constructor : ->
        super
        bg = new BackgroundImage()
        @addChild bg
        @server = new RoomModel
        @inited = false
    update : (e) ->
        if @server.onLobby and @server.onReady and !@inited
            @player = new Player @server.player_id
            @player_marker = new Player @server.player_id, true
            @addChild @player
            @player.server = @server
            @addChild @player_marker
            @guest = new GuestPlayerManager()
            @guest.server = @server
            @addChild @guest
            @field_item = new ItemManager(@server)
            @addChild @field_item
            @inited = true
            console.log 'inited stage'
        else if @inited
#            @guest.update()
            @field_item.update()
            console.log 'update'
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

