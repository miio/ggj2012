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
      'bullet.png',
      'bullet1.png',
      'kawaz.png',
      'a.gif',
      'b.gif',
      'c.gif',
      'd.gif',
      'e.gif',
      'f.gif',
      'g.gif',
      'h.gif',
      'i.gif',
      'j.gif',
      'k.gif',
      'l.gif',
      'm.gif',
      'n.gif',
      'o.gif',
      'p.gif',
      'q.gif',
      'r.gif',
      's.gif',
      't.gif',
      'u.gif',
      'v.gif',
      'w.gif',
      'x.gif',
      'y.gif',
      'z.gif',


    ],
    SOUND_PATH : './client/resources/sounds/',
    SOUNDS : [
      'count0.wav',
      'count1.wav',
      'count2.wav',
      'count3.wav',
      'count4.wav',
      'count5.wav',
      'count6.wav',
      'bomb.wav',
      'beep.wav',
      'cursor.wav',
      'decide.wav',
      'levelup.wav',
      'metal.wav',
      'start.wav'
    ],
    INITIAL_LEVEL : 1,
    LAST_LEVEL : 7,
    LEVEL_TIME : 30
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
