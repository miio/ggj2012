enchant()
###
# メインクラス #
Author : giginet
Package : Jubiol
###
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
      'get_true.png',
      'get_false.png',
      'main_background.png',
      'plate_200.png',
      'plate_300.png',
      'plate_500.png',
      'plate_-500.png',
      'plate_100000.png',
      'sushi_0.png',
      'sushi_1.png',
      'sushi_2.png',
      'sushi_3.png',
      'sushi_4.png',
      'sushi_5.png',
      'sushi_6.png',
      'sushi_7.png',
      'player1.png',
      'player2.png',
      'player3.png',
      'player4.png',
      'player1on.png',
      'player2on.png',
      'player3on.png',
      'player4on.png'
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
        { X : 0, Y : 490, START_X : 0,   AREA_X : 199},
        { X : 200, Y : 490, START_X : 200, AREA_X : 199},
        { X : 400, Y : 490, START_X : 400, AREA_X : 199},
        { X : 600, Y : 490, START_X : 600, AREA_X : 199}
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
