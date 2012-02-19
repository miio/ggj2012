class StateManager
  constructor : (rootState) ->
    @stack = []
    @pushState rootState
  pushState : (state) ->
    state?.setup()
    @stack.push state
  popState : ->
    state = @stack.pop()
    state.teardown()
    return state
  replaceState : (state) ->
    @popState()
    @pushState state
  currentState : () ->
    return @stack.last()

class State
  constructor : (@scene=Jubiol.game.currentScene) ->
    ""
  setup : ->
    @
  teardown : ->
    @
  update : ->
    true

class ReadyState extends State
  setup : ->
    @timer = new Timer 600
    @label = new Label ''
    @timer.play()
  update : ->
    @timer.tick()
    if @timer.now() is 30
      @label.text = 'Ready'
      @label.x = 220
      @label.y = 200
      @label.font = "64px #{Jubiol.config.FONT}"
      @scene.addChild @label
    else if @timer.now() is 60
      @scene.removeChild @label
      return new MainState(@scene)
    return true

class MainState extends State
  constructor : ->
    super
    @stage = @scene.stage
    Jukebox.play("start.wav")
  setup : ->
    label = new Label ''
    label.text = 'Go'
    label.font = "64px #{Jubiol.config.FONT}"
    label.x = 270
    label.y = 200
    label.addEventListener 'enterframe', ->
      @y -= 30
      if @y < 0
        @parentNode.removeChild @
    @scene.addChild label

  update : ->
      #@scene.counter.update()
    state = @scene.stage.update()
    if state
      return state
    return true

class CheckState extends State
  setup : ->
    @checkTimer = new Timer(45)
    @checkTimer.play()
  update : ->
    @scene.counter.update()
    @checkTimer.tick()
    if @checkTimer.isOver()
      return @checkDeath()
    return true
  checkDeath : ->
    rate = @scene.counter.calcRate()
    if rate < 0.05
      @scene.stage.player.invincibleTimer.play()
      return false
    else
      Jukebox.play('beep.wav')
      return new GameOverState()

class GameEndState extends State
  setup : ->
    @timer = new Timer(60)
    @timer.play()
    replay = new Label("Replay(z)")
    title = new Label("Title(x)")
    replay.x = 180
    replay.y = 400
    title.x = 350
    title.y = 400
    counter = @scene.counter
    score = new Label("#{counter.calcScore()} Point")
    score.x = 220
    score.y = 300
    scene = @scene
    result = new Label("#{counter.count}/#{counter.total} #{Math.round(counter.calcRate() * 1000) / 10}%")
    result.x = 220
    result.y = 350
    @timer.setComplete ->
      scene.addChild title
      scene.addChild replay
    for label in [replay, title, score, result]
      label.font = "32px #{Jubiol.config.FONT}"
    @scene.addChild score
    @scene.addChild result
  update : ->
    @timer.tick()
    return true unless @timer.isOver()
    if Jubiol.game.input.a
      Jukebox.play('decide.wav')
      Jubiol.game.replaceScene(new MainScene())
    else if Jubiol.game.input.b
      Jukebox.play('decide.wav')
      Jubiol.game.replaceScene(new TitleScene())
    return true

class GameOverState extends GameEndState
  setup : ->
    super
    gameover = new Label("Game Over")
    gameover.x = 150
    gameover.y = 200
    gameover.width = 500
    gameover.scaleX = 5
    gameover.scaleY = 5
    gameover.font = "64px #{Jubiol.config.FONT}"
    @scene.addChild gameover

class ClearState extends GameEndState
  setup : ->
    super
    clear = new Label("Clear!")
    clear.x = 230
    clear.y = 200
    clear.width = 300
    clear.scaleX = 5
    clear.scaleY = 5
    clear.font = "64px #{Jubiol.config.FONT}"
    @scene.addChild clear

