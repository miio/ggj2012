class LogoScene extends Scene
    ###
    # ロゴシーンクラス #
    # Author : giginet
    # Package : Jubiol
    ###
    setup : ->
        @kawaz = new KawazSprite(253, 81)
        @kawaz.setImage 'kawaz.png'
        @kawaz.x = 193.5
        @kawaz.y = 220
        @kawaz.opacity = 0
        @addChild @kawaz
        @addEventListener 'enterframe', @update
        @timer = new Timer(180)
        @timer.setComplete ->
            Jubiol.game.replaceScene(new TitleScene())
        @timer.play()
    update : ->
        if Jubiol.game.input.a
            Jubiol.game.replaceScene(new TitleScene())
        @timer.tick()
        if @timer.now() < 60
            @kawaz.opacity += 1.0/60
        else if @timer.now() > 120
            @kawaz.opacity -= 1.0/60

class TitleScene extends Scene
    ###
    # タイトルシーンクラス #
    # Author : giginet
    # Package : Jubiol
    ###
    constructor : ->
        super
        @kawaz = new KawazSprite(Jubiol.config.WIDTH, Jubiol.config.HEIGHT)
        @kawaz.setImage 'title_background.png'
        @kawaz.x = 0
        @kawaz.y = 0
        @addChild @kawaz
        play = new Label "Play"
        howto = new Label "Howto"
        kawaz = new Label "Kawaz"
        cursor = new Label ">"
        play.x = (Jubiol.config.WIDTH / 2) - 55
        play.y = (Jubiol.config.HEIGHT / 2) + 60
        howto.x = (Jubiol.config.WIDTH / 2) - 65
        howto.y = (Jubiol.config.HEIGHT / 2) + 120
        kawaz.x = (Jubiol.config.WIDTH / 2) - 70
        kawaz.y = (Jubiol.config.HEIGHT / 2) + 180
        cursor.x = (Jubiol.config.WIDTH / 2) - 100
        cursor.y = (Jubiol.config.HEIGHT / 2) + 60
        cursor.addEventListener 'enterframe', ->
            @menu ?= 0
            @press ?= false
            if Jubiol.game.input.down
                unless @press
                    @press = true
                    ++@menu
            else if Jubiol.game.input.up
                unless @press
                    @press = true
                    --@menu
            else if Jubiol.game.input.a
                return if @press
                @press = true
                if @menu is 0
                    Jubiol.game.replaceScene(new MainScene())
                else if @menu is 1
                    window.open "http://www.kawaz.org/projects/osushi/"
                else if @menu is 2
                    window.open "http://www.kawaz.org/"
            else
                @press = false
            @menu = (@menu + 3) % 3
            @y = ((Jubiol.config.HEIGHT / 2) + 60) + 60 * @menu
        [play, howto, kawaz, cursor].each (v, i) ->
            v.font = "36px #{Jubiol.config.FONT}"
        @addChild play
        @addChild howto
        @addChild kawaz
        @addChild cursor


class MainScene extends Scene
    ###
    # メインシーンクラス #
    # 基本的に内部のステートクラスのインスタンスに処理を委譲
    # Author : giginet
    # Package : Jubiol
    ###
    constructor : ->
        super
        @stateManager = new StateManager(new ReadyState(@))
        @stage = new Stage()
        Jubiol.game.stage = @stage
        @addChild @stage
        @addEventListener 'enterframe', @update
        @addEventListener 'exit', ->
            @removeEventListener 'enterframe'
    update : (e) ->
        state = @stateManager.currentState().update()
        if state is false
            @stateManager.popState()
        else if state isnt true
            @stateManager.pushState state
