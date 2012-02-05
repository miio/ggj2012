enchant()
class Jubiol extends Game
  config : {
    WIDTH : 800,
    HEIGHT : 600,
    FPS : 30,
    FONT : 'Helvetica',
    IMAGE_PATH : './client/resources/images/',
    IMAGES : [
      'player.png',
      'kawaz.png',
      'main_background.png',
      'plate_1.png',
      'sushi_1.png',
      'sushi_2.png',

    ],
    SOUND_PATH : './client/resources/sounds/',
    SOUNDS : [
      'metal.wav',
      'start.wav'
    ],
    INITIAL_LEVEL : 1,
    LAST_LEVEL : 7,
    LEVEL_TIME : 30,
    PLAYER_POSITION : [
        { X : 100, Y : 550, START_X : 0,   AREA_X : 199},
        { X : 300, Y : 550, START_X : 200, AREA_X : 199},
        { X : 500, Y : 550, START_X : 400, AREA_X : 199},
        { X : 700, Y : 550, START_X : 600, AREA_X : 199}
    ]
  }
  constructor : ->
    super @config.WIDTH, @config.HEIGHT
    @fps = @config.FPS
    @keybind(90, 'a')
    @keybind(88, 'b')
    Jubiol.game = @
    Jubiol.config = @config
    for image in @config.IMAGES
      @preload("#{@config.IMAGE_PATH}#{image}")
    Jukebox.root = @config.SOUND_PATH
    for sound in @config.SOUNDS
      Jukebox.load sound
    root = new LogoScene()
    @onload = ->
      root.setup()
      @pushScene root
    @start()

window.onload = ->
  new Jubiol()
