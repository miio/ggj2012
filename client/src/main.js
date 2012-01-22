var Jubiol;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
enchant();
Jubiol = (function() {
  __extends(Jubiol, Game);
  Jubiol.prototype.config = {
    WIDTH: 640,
    HEIGHT: 480,
    FPS: 30,
    FONT: 'Helvetica',
    IMAGE_PATH: './client/resources/images/',
    IMAGES: ['player.png', 'bullet.png', 'bullet1.png', 'kawaz.png', 'a.gif', 'b.gif', 'c.gif', 'd.gif', 'e.gif', 'f.gif', 'g.gif', 'h.gif', 'i.gif', 'j.gif', 'k.gif', 'l.gif', 'm.gif', 'n.gif', 'o.gif', 'p.gif', 'q.gif', 'r.gif', 's.gif', 't.gif', 'u.gif', 'v.gif', 'w.gif', 'x.gif', 'y.gif', 'z.gif'],
    SOUND_PATH: './client/resources/sounds/',
    SOUNDS: ['count0.wav', 'count1.wav', 'count2.wav', 'count3.wav', 'count4.wav', 'count5.wav', 'count6.wav', 'bomb.wav', 'beep.wav', 'cursor.wav', 'decide.wav', 'levelup.wav', 'metal.wav', 'start.wav'],
    INITIAL_LEVEL: 1,
    LAST_LEVEL: 7,
    LEVEL_TIME: 30
  };
  function Jubiol() {
    var image, root, sound, _i, _j, _len, _len2, _ref, _ref2;
    Jubiol.__super__.constructor.call(this, this.config.WIDTH, this.config.HEIGHT);
    this.fps = this.config.FPS;
    this.keybind(90, 'a');
    this.keybind(88, 'b');
    Jubiol.game = this;
    Jubiol.config = this.config;
    _ref = this.config.IMAGES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      image = _ref[_i];
      this.preload("" + this.config.IMAGE_PATH + image);
    }
    Jukebox.root = this.config.SOUND_PATH;
    _ref2 = this.config.SOUNDS;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      sound = _ref2[_j];
      Jukebox.load(sound);
    }
    root = new LogoScene();
    this.onload = function() {
      root.setup();
      return this.pushScene(root);
    };
    this.start();
  }
  return Jubiol;
})();
window.onload = function() {
  return new Jubiol();
};