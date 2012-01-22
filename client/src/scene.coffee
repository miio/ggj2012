class LogoScene extends Scene
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
  constructor : ->
    super
    @label = new Label "Jubiol"
    @label.font = "96px #{Jubiol.config.FONT}"
    @label.color = "#222"
    @label.x = 195
    @label.y = -50
    @addEventListener 'enterframe', @update
    @timer = new Timer(50)
    @timer.play()
    scene = @
    @timer.setComplete ->
      play = new Label "Play"
      howto = new Label "Howto"
      kawaz = new Label "Kawaz"
      cursor = new Label ">"
      play.x = 295
      play.y = 240
      howto.x = 285
      howto.y = 300
      kawaz.x = 280
      kawaz.y = 360
      cursor.x = 240
      cursor.y = 240
      cursor.addEventListener 'enterframe', ->
        @menu ?= 0
        @press ?= false
        if Jubiol.game.input.down
          unless @press
            Jukebox.play('cursor.wav')
            @press = true
            ++@menu
        else if Jubiol.game.input.up
          unless @press
            Jukebox.play('cursor.wav')
            @press = true
            --@menu
        else if Jubiol.game.input.a
          return if @press
          @press = true
          Jukebox.play('decide.wav')
          if @menu is 0
            Jubiol.game.replaceScene(new MainScene())
          else if @menu is 1
            window.open "http://www.kawaz.org/projects/jubiol/"
          else if @menu is 2
            window.open "http://www.kawaz.org/"
        else
          @press = false
        @menu = (@menu + 3) % 3
        @y = 240 + 60 * @menu
      [play, howto, kawaz, cursor].each (v, i) ->
        v.font = "36px #{Jubiol.config.FONT}"
      scene.addChild play
      scene.addChild howto
      scene.addChild kawaz
      scene.addChild cursor
    @addChild @label
  update : ->
    @timer.tick()
    unless @timer.isOver()
      @label.y = -50 + 3 * @timer.now()

class MainScene extends Scene
  constructor : ->
    super
    @stateManager = new StateManager(new ReadyState(@))
    @stage = new Stage()
    Jubiol.game.stage = @stage
    @addChild @stage
    @counter = new Counter()
    @addEventListener 'enterframe', @update
    @addEventListener 'exit', ->
      @removeEventListener 'enterframe'
  update : (e) ->
    state = @stateManager.currentState().update()
    if state is false
      @stateManager.popState()
    else if state isnt true
      @stateManager.pushState state
