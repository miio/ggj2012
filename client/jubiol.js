(function() {
  var Bullet, CheckState, ClearState, Counter, GameEndState, GameOverState, GuestPlayer, GuestPlayerManager, ItemManager, ItemObject, Jubiol, Jukebox, KawazSprite, Level, Level1, Level2, Level3, Level4, Level5, Level6, Level7, LogoScene, MainScene, MainState, Player, ReadyState, ServerConnectionManager, Stage, Star, State, StateManager, Timer, TitleScene, Vector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Vector = (function() {
    function Vector(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.set(x, y);
    }
    Vector.prototype.set = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.x = x;
      this.y = y;
      return this;
    };
    Vector.prototype.add = function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    };
    Vector.prototype.sub = function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    };
    Vector.prototype.scale = function(n) {
      this.x *= n;
      this.y *= n;
      return this;
    };
    Vector.prototype.div = function(n) {
      this.x /= n;
      this.y /= n;
      return this;
    };
    Vector.prototype.product = function(v) {
      return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.length = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector.prototype.resize = function(n) {
      if (this.length()) {
        this.scale(n / this.length());
      }
      return this;
    };
    Vector.prototype.normalize = function() {
      return this.resize(1);
    };
    Vector.prototype.angle = function() {
      return (180 * Math.atan2(this.y, this.x)) / Math.PI;
    };
    Vector.prototype.rotate = function(deg) {
      var rad, size, x, y;
      rad = (deg * Math.PI) / 180;
      size = this.length();
      x = this.x;
      y = this.y;
      this.x = Math.sin(rad) * y + Math.cos(rad) * x;
      this.y = Math.cos(rad) * y - Math.sin(rad) * x;
      return this.resize(size);
    };
    Vector.prototype.clone = function() {
      return new Vector(this.x, this.y);
    };
    Vector.prototype.reverse = function() {
      this.x *= -1;
      this.y *= -1;
      return this;
    };
    Vector.prototype.max = function(m) {
      if (this.length() <= m) {
        return this;
      }
      return this.resize(m);
    };
    Vector.prototype.min = function(m) {
      if (this.length() >= m) {
        return this;
      }
      return this.resize(m);
    };
    Vector.prototype.isZero = function() {
      return this.x === 0 && this.y === 0;
    };
    return Vector;
  })();
  Array.prototype._index = function(index) {
    var length;
    if (index < 0) {
      length = this.length;
      return length + index;
    }
    return index;
  };
  Array.prototype.at = function(index) {
    return this[this._index(index)];
  };
  Array.prototype.map = function(func) {
    var value, _ref;
    return ([].splice.apply(this, [0, this.length - 0].concat(_ref = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        value = this[_i];
        _results.push(func(value));
      }
      return _results;
    }).call(this))), _ref);
  };
  Array.prototype.clone = function() {
    return this.dup();
  };
  Array.prototype.dup = function() {
    return this.slice(0, this.length);
  };
  Array.prototype.each = function(func) {
    var index, _ref;
    for (index = 0, _ref = this.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
      func(this[index], index);
    }
    return this;
  };
  Array.prototype.deleteAt = function(index) {
    index = this._index(index);
    if (index >= this.length) {
      return;
    }
    return this.splice(index, 1);
  };
  Array.prototype.deleteIf = function(func) {
    var i;
    return this.replace((function() {
      var _ref, _results;
      _results = [];
      for (i = 0, _ref = this.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        if (!func(this[i], i)) {
          _results.push(this[i]);
        }
      }
      return _results;
    }).call(this));
  };
  Array.prototype.reject = function(func) {
    var before;
    before = this.length;
    this.deleteIf(func);
    if (before === this.length) {
      return;
    }
    return this;
  };
  Array.prototype.isEmpty = function() {
    return this.length === 0;
  };
  Array.prototype.isEql = function(other, eql) {
    var index, _ref;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    if (this.length !== other.length) {
      return false;
    }
    for (index = 0, _ref = this.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
      if (!eql(this[index], other[index])) {
        return false;
      }
    }
    return true;
  };
  Array.prototype.fill = function(val, start, end) {
    var i, _ref;
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = this.length - 1;
    }
    start = this._index(start);
    end = this._index(end);
    [].splice.apply(this, [start, end - start + 1].concat(_ref = (function() {
      var _results;
      _results = [];
      for (i = start; start <= end ? i <= end : i >= end; start <= end ? i++ : i--) {
        _results.push(val);
      }
      return _results;
    })())), _ref;
    return this;
  };
  Array.prototype.first = function() {
    return this[0];
  };
  Array.prototype.last = function() {
    var last;
    last = this._index(-1);
    return this[last];
  };
  Array.prototype.uniq = function(eql) {
    var array, val, _i, _len;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    array = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      val = this[_i];
      if (!array.isInclude(val, eql)) {
        array.push(val);
      }
    }
    return this.replace(array);
  };
  Array.prototype.index = function(value, eql) {
    var index, _ref;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    for (index = 0, _ref = this.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
      if (eql(this[index], value)) {
        return index;
      }
    }
    return;
  };
  Array.prototype.indexes = function() {
    var index, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      index = arguments[_i];
      _results.push(this.at(index));
    }
    return _results;
  };
  Array.prototype.rindex = function(value, eql) {
    var index, _ref;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    for (index = _ref = this.length; _ref <= 0 ? index < 0 : index > 0; _ref <= 0 ? index++ : index--) {
      if (eql(this[index], value)) {
        return index;
      }
    }
    return;
  };
  Array.prototype.flatten = function() {
    return this.replace(this.reduce(function(a, b) {
      return a.concat(b instanceof Array ? b.flatten() : b);
    }, []));
  };
  Array.prototype.transpose = function() {
    var h, i, t, w, x, y;
    w = this.isEmpty() ? 0 : this.length;
    h = this.first() instanceof Array ? this.first().length : 0;
    if (!w || !h) {
      return this;
    }
    t = (function() {
      var _results;
      _results = [];
      for (i = 0; 0 <= h ? i < h : i > h; 0 <= h ? i++ : i--) {
        _results.push([]);
      }
      return _results;
    })();
    for (x = 0; 0 <= w ? x < w : x > w; 0 <= w ? x++ : x--) {
      for (y = 0; 0 <= h ? y < h : y > h; 0 <= h ? y++ : y--) {
        t[y][x] = this[x][y];
      }
    }
    return this.replace(t);
  };
  Array.prototype.compact = function() {
    return this.deleteIf(function(value) {
      return value === void 0;
    });
  };
  Array.prototype.isInclude = function(val, eql) {
    var elem, _i, _len;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      elem = this[_i];
      if (eql(elem, val)) {
        return true;
      }
    }
    return false;
  };
  Array.prototype.size = function() {
    return this.length;
  };
  Array.prototype.swap = function(a, b) {
    var tmp;
    a = this._index(a);
    b = this._index(b);
    tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
    return this;
  };
  Array.prototype.shuffle = function() {
    var i, _ref;
    for (i = 0, _ref = this.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.swap(i, Math.floor(Math.random() * this.length));
    }
    return this;
  };
  Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
  };
  Array.prototype.count = function(val, eql) {
    var index, sum, _ref;
    if (eql == null) {
      eql = function(a, b) {
        return a === b;
      };
    }
    sum = 0;
    for (index = 0, _ref = this.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
      if (eql(this[index], val)) {
        ++sum;
      }
    }
    return sum;
  };
  Array.prototype.replace = function(other) {
    var elem, _i, _len;
    this.clear();
    for (_i = 0, _len = other.length; _i < _len; _i++) {
      elem = other[_i];
      this.push(elem);
    }
    return this;
  };
  Array.prototype.nitems = function() {
    return this.clone().compact().size();
  };
  Array.prototype.insert = function() {
    var args, i, index, values, _ref;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    if (args.size() <= 1) {
      return this;
    }
    index = this._index(args[0]);
    values = args.slice(1, this.length);
    for (i = 0, _ref = values.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.splice(index + i, 0, values[i]);
    }
    return this;
  };
  Array.prototype.clear = function() {
    var _results;
    _results = [];
    while (!this.isEmpty()) {
      _results.push(this.deleteAt(0));
    }
    return _results;
  };
  Array.prototype.max = function(cmp) {
    var result;
    if (cmp == null) {
      cmp = function(a, b) {
        if (a === b) {
          return 0;
        }
        if (a < b) {
          return -1;
        } else {
          return 1;
        }
      };
    }
    result = this.first();
    this.reduce(function(a, b) {
      if (cmp(result, b) < 0) {
        return result = b;
      }
    });
    return result;
  };
  Array.prototype.min = function(cmp) {
    var result;
    if (cmp == null) {
      cmp = function(a, b) {
        if (a === b) {
          return 0;
        }
        if (a < b) {
          return -1;
        } else {
          return 1;
        }
      };
    }
    result = this.first();
    this.reduce(function(a, b) {
      if (cmp(result, b) >= 0) {
        return result = b;
      }
    });
    return result;
  };
  Timer = (function() {
    function Timer(max, repeat, time, active, complete) {
      if (repeat == null) {
        repeat = false;
      }
      if (time == null) {
        time = 0;
      }
      if (active == null) {
        active = false;
      }
      if (complete == null) {
        complete = void 0;
      }
      this.set(max);
      this._time = time;
      this._active = active;
      this._complete = complete;
      this._repeat = repeat;
    }
    Timer.prototype.set = function(max) {
      if (max == null) {
        max = 0;
      }
      this._max = max;
      return this;
    };
    Timer.prototype.play = function() {
      this._active = true;
      return this;
    };
    Timer.prototype.stop = function() {
      this._active = false;
      this._time = 0;
      return this;
    };
    Timer.prototype.pause = function() {
      this._active = false;
      return this;
    };
    Timer.prototype.reset = function() {
      this._time = 0;
      return this;
    };
    Timer.prototype.tick = function() {
      if (this._time < this._max && this._active) {
        ++this._time;
        if (this._time === this._max) {
          if (this._complete != null) {
            this._complete();
          }
          if (this._repeat) {
            this._time = 0;
          }
        }
      }
      return this;
    };
    Timer.prototype.now = function() {
      return this._time;
    };
    Timer.prototype.max = function() {
      return this._max;
    };
    Timer.prototype.setNow = function(_time) {
      this._time = _time;
      return this;
    };
    Timer.prototype.setComplete = function(func) {
      this._complete = func;
      return this;
    };
    Timer.prototype.setRepeat = function(repeat) {
      this._repeat = repeat;
      return this;
    };
    Timer.prototype.isActive = function() {
      return this._active;
    };
    Timer.prototype.isOver = function() {
      return this._time >= this._max;
    };
    return Timer;
  })();
  Jukebox = (function() {
    function Jukebox() {}
    Jukebox._sounds = [];
    Jukebox.root = '';
    Jukebox.load = function() {
      var sound, sounds, _i, _len, _results;
      sounds = Array.prototype.slice.call(arguments);
      _results = [];
      for (_i = 0, _len = sounds.length; _i < _len; _i++) {
        sound = sounds[_i];
        _results.push(Jukebox._loadSound(sound));
      }
      return _results;
    };
    Jukebox.play = function(sound) {
      if (!(Jukebox._sounds[sound] != null)) {
        Jukebox._loadSound(sound);
      }
      Jukebox.stop(sound);
      return Jukebox._sounds[sound].play();
    };
    Jukebox.pause = function(sound) {
      if (sound != null) {
        return Jukebox._sounds[sound].pause();
      }
    };
    Jukebox.stop = function(sound) {
      if (sound != null) {
        return Jukebox._sounds[sound].stop();
      }
    };
    Jukebox._loadSound = function(sound, mimetype) {
      if (!(Jukebox._sounds[sound] != null)) {
        if (mimetype != null) {
          return Jukebox._sounds[sound] = Sound.load("" + Jukebox.root + sound, mimetype);
        } else {
          return Jukebox._sounds[sound] = Sound.load("" + Jukebox.root + sound);
        }
      }
    };
    return Jukebox;
  })();
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
  KawazSprite = (function() {
    __extends(KawazSprite, Sprite);
    function KawazSprite(w, h, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      KawazSprite.__super__.constructor.call(this, w, h);
      this.removeEventListener('enterframe');
      this.x = x;
      this.y = y;
      this.v = new Vector();
      this.speed = 7;
    }
    KawazSprite.prototype.update = function(e) {
      this.x += this.v.x;
      return this.y += this.v.y;
    };
    KawazSprite.prototype.setImage = function(fileName) {
      return this.image = Jubiol.game.assets["" + Jubiol.config.IMAGE_PATH + fileName];
    };
    KawazSprite.prototype.position = function() {
      return new Vector(this.x, this.y);
    };
    KawazSprite.prototype.center = function() {
      return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    };
    return KawazSprite;
  })();
  Player = (function() {
    __extends(Player, KawazSprite);
    function Player(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      Player.__super__.constructor.call(this, 32, 32, x, y);
      this.server = null;
      this.setImage('player.png');
      this.invincibleTimer = new Timer(45);
      this.invincibleTimer.setComplete(function() {
        return this.stop();
      });
    }
    Player.prototype.update = function(e) {
      this.invincibleTimer.tick();
      this.opacity = 0.5 + 0.5 * Math.cos(this.invincibleTimer.now() * 30 * Math.PI / 180);
      this.v.set(0, 0);
      if (Jubiol.game.input.left) {
        this.v.x = -1;
      } else if (Jubiol.game.input.right) {
        this.v.x = 1;
      }
      if (Jubiol.game.input.up) {
        this.v.y = -1;
      } else if (Jubiol.game.input.down) {
        this.v.y = 1;
      }
      this.v.resize(this.speed);
      Player.__super__.update.apply(this, arguments);
      if (this.x > Jubiol.config.WIDTH - this.width) {
        this.x = Jubiol.config.WIDTH - this.width;
      } else if (this.x < 0) {
        this.x = 0;
      }
      if (this.y > Jubiol.config.HEIGHT - this.height) {
        return this.y = Jubiol.config.HEIGHT - this.height;
      } else if (this.y < 0) {
        return this.y = 0;
      }
    };
    return Player;
  })();
  GuestPlayer = (function() {
    __extends(GuestPlayer, KawazSprite);
    function GuestPlayer(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      GuestPlayer.__super__.constructor.call(this, 32, 32, x, y);
      this.server = null;
      this.setImage('player.png');
      this.invincibleTimer = new Timer(45);
      this.invincibleTimer.setComplete(function() {
        return this.stop();
      });
    }
    return GuestPlayer;
  })();
  GuestPlayerManager = (function() {
    __extends(GuestPlayerManager, Group);
    function GuestPlayerManager() {
      GuestPlayerManager.__super__.constructor.apply(this, arguments);
      this.server = null;
      this.guest = [];
    }
    GuestPlayerManager.prototype.update = function(e) {
      var user, val, _ref, _results;
      if (this.server != null) {
        _ref = this.server.guest_list;
        _results = [];
        for (user in _ref) {
          val = _ref[user];
          _results.push(!(this.guest[user] != null) ? (this.guest[user] = new GuestPlayer, this.addChild(this.guest[user]), console.log('user', user)) : void 0);
        }
        return _results;
      }
    };
    return GuestPlayerManager;
  })();
  ItemManager = (function() {
    __extends(ItemManager, Group);
    function ItemManager(server) {
      var item, _i, _len, _ref;
      ItemManager.__super__.constructor.apply(this, arguments);
      this.server = server;
      this.item = ['a', 'p', 'p', 'l', 'e'];
      this.item_obj = [];
      _ref = this.item;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this.pos = Math.floor(Math.random() * 400) + 1;
        this.item_obj.push(new ItemObject(item, this.pos, this.pos));
        this.addChild(this.item_obj[this.item_obj.length - 1]);
      }
      console.log('ar', this.item_obj);
    }
    ItemManager.prototype.update = function(e) {
      return true;
    };
    ItemManager.prototype.removeChild = function(i) {
      ItemManager.__super__.removeChild.call(this, i);
      i.x = -10000;
      return i.y = -10000;
    };
    return ItemManager;
  })();
  ItemObject = (function() {
    __extends(ItemObject, KawazSprite);
    function ItemObject(name, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      ItemObject.__super__.constructor.call(this, 50, 50, x, y);
      this.server = null;
      this.setImage("" + name + ".gif");
      this.invincibleTimer = new Timer(45);
      this.invincibleTimer.setComplete(function() {
        return this.stop();
      });
    }
    return ItemObject;
  })();
  Bullet = (function() {
    __extends(Bullet, KawazSprite);
    function Bullet(x, y, red) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.red = red != null ? red : false;
      Bullet.__super__.constructor.call(this, 12, 12, x, y);
      if (this.red) {
        this.setImage("bullet1.png");
        ++Jubiol.game.currentScene.counter.total;
      } else {
        this.setImage("bullet.png");
      }
      this.v.y = 10;
    }
    Bullet.prototype.update = function(e) {
      Bullet.__super__.update.apply(this, arguments);
      if (this.x < -100 || this.x > Jubiol.config.WIDTH + 100 || this.y < -100 || this.y > Jubiol.config.HEIGHT + 100) {
        return Jubiol.game.stage.bullets.removeChild(this);
      }
    };
    return Bullet;
  })();
  Star = (function() {
    function Star(x, y, max, distance) {
      var radius, rootPoint;
      this.max = max != null ? max : 10;
      this.distance = distance != null ? distance : 20;
      rootPoint = new Vector(x, y);
      this.direction = new Vector(1, 0);
      this.direction.resize(this.distance);
      this.rotateCount = 0;
      radius = this.max * this.distance / 2;
      this.centerPoint = rootPoint.clone().add(new Vector(radius, -radius * Math.tan(Math.PI / 10)));
      this.currentPoint = rootPoint.clone();
      this.bullets = [];
    }
    Star.prototype.pop = function(red) {
      var bullet, count, vector;
      if (!this.isComplete()) {
        vector = this.currentPoint.add(this.direction).clone();
        bullet = new Bullet(vector.x, vector.y, red);
        bullet.v = new Vector();
        this.bullets.push(bullet);
        count = this.bullets.length;
        if (count % this.max === 0) {
          this.direction.rotate(144);
          ++this.rotateCount;
        }
        return bullet;
      }
      return false;
    };
    Star.prototype.update = function() {
      var bullet, rotated, sub, _i, _len, _ref, _results;
      if (this.isComplete()) {
        if (!(this.v != null)) {
          this.v = Jubiol.game.stage.player.position().sub(this.centerPoint).resize(7);
        }
        this.centerPoint.add(this.v);
        _ref = this.bullets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bullet = _ref[_i];
          sub = bullet.center().sub(this.centerPoint);
          rotated = sub.clone().rotate(5);
          _results.push(bullet.v = this.v.clone().add(rotated.sub(sub)));
        }
        return _results;
      }
    };
    Star.prototype.isComplete = function() {
      return this.rotateCount >= 5;
    };
    return Star;
  })();
  StateManager = (function() {
    function StateManager(rootState) {
      this.stack = [];
      this.pushState(rootState);
    }
    StateManager.prototype.pushState = function(state) {
      if (state != null) {
        state.setup();
      }
      return this.stack.push(state);
    };
    StateManager.prototype.popState = function() {
      var state;
      state = this.stack.pop();
      state.teardown();
      return state;
    };
    StateManager.prototype.replaceState = function(state) {
      this.popState();
      return this.pushState(state);
    };
    StateManager.prototype.currentState = function() {
      return this.stack.last();
    };
    return StateManager;
  })();
  State = (function() {
    function State(scene) {
      this.scene = scene != null ? scene : Jubiol.game.currentScene;
      "";
    }
    State.prototype.setup = function() {
      return this;
    };
    State.prototype.teardown = function() {
      return this;
    };
    State.prototype.update = function() {
      return true;
    };
    return State;
  })();
  ReadyState = (function() {
    __extends(ReadyState, State);
    function ReadyState() {
      ReadyState.__super__.constructor.apply(this, arguments);
    }
    ReadyState.prototype.setup = function() {
      this.timer = new Timer(600);
      this.label = new Label('');
      return this.timer.play();
    };
    ReadyState.prototype.update = function() {
      this.timer.tick();
      if (this.timer.now() === 30) {
        this.label.text = 'Ready';
        this.label.x = 220;
        this.label.y = 200;
        this.label.font = "64px " + Jubiol.config.FONT;
        this.scene.addChild(this.label);
      } else if (this.timer.now() === 60) {
        this.scene.removeChild(this.label);
        return new MainState(this.scene);
      }
      return true;
    };
    return ReadyState;
  })();
  MainState = (function() {
    __extends(MainState, State);
    function MainState() {
      MainState.__super__.constructor.apply(this, arguments);
      this.stage = this.scene.stage;
      this.stage.changeLevel(Jubiol.config.INITIAL_LEVEL);
      Jukebox.play("start.wav");
    }
    MainState.prototype.setup = function() {
      var label;
      label = new Label('');
      label.text = 'Go';
      label.font = "64px " + Jubiol.config.FONT;
      label.x = 270;
      label.y = 200;
      label.addEventListener('enterframe', function() {
        this.y -= 30;
        if (this.y < 0) {
          return this.parentNode.removeChild(this);
        }
      });
      return this.scene.addChild(label);
    };
    MainState.prototype.update = function() {
      var state;
      this.scene.counter.update();
      state = this.scene.stage.update();
      if (state) {
        return state;
      }
      return true;
    };
    return MainState;
  })();
  CheckState = (function() {
    __extends(CheckState, State);
    function CheckState() {
      CheckState.__super__.constructor.apply(this, arguments);
    }
    CheckState.prototype.setup = function() {
      this.checkTimer = new Timer(45);
      return this.checkTimer.play();
    };
    CheckState.prototype.update = function() {
      this.scene.counter.update();
      this.checkTimer.tick();
      if (this.checkTimer.isOver()) {
        return this.checkDeath();
      }
      return true;
    };
    CheckState.prototype.checkDeath = function() {
      var rate;
      rate = this.scene.counter.calcRate();
      if (rate < 0.05) {
        this.scene.stage.player.invincibleTimer.play();
        return false;
      } else {
        Jukebox.play('beep.wav');
        return new GameOverState();
      }
    };
    return CheckState;
  })();
  GameEndState = (function() {
    __extends(GameEndState, State);
    function GameEndState() {
      GameEndState.__super__.constructor.apply(this, arguments);
    }
    GameEndState.prototype.setup = function() {
      var counter, label, replay, result, scene, score, title, _i, _len, _ref;
      this.timer = new Timer(60);
      this.timer.play();
      replay = new Label("Replay(z)");
      title = new Label("Title(x)");
      replay.x = 180;
      replay.y = 400;
      title.x = 350;
      title.y = 400;
      counter = this.scene.counter;
      score = new Label("" + (counter.calcScore()) + " Point");
      score.x = 220;
      score.y = 300;
      scene = this.scene;
      result = new Label("" + counter.count + "/" + counter.total + " " + (Math.round(counter.calcRate() * 1000) / 10) + "%");
      result.x = 220;
      result.y = 350;
      this.timer.setComplete(function() {
        scene.addChild(title);
        return scene.addChild(replay);
      });
      _ref = [replay, title, score, result];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        label = _ref[_i];
        label.font = "32px " + Jubiol.config.FONT;
      }
      this.scene.addChild(score);
      return this.scene.addChild(result);
    };
    GameEndState.prototype.update = function() {
      this.timer.tick();
      if (!this.timer.isOver()) {
        return true;
      }
      if (Jubiol.game.input.a) {
        Jukebox.play('decide.wav');
        Jubiol.game.replaceScene(new MainScene());
      } else if (Jubiol.game.input.b) {
        Jukebox.play('decide.wav');
        Jubiol.game.replaceScene(new TitleScene());
      }
      return true;
    };
    return GameEndState;
  })();
  GameOverState = (function() {
    __extends(GameOverState, GameEndState);
    function GameOverState() {
      GameOverState.__super__.constructor.apply(this, arguments);
    }
    GameOverState.prototype.setup = function() {
      var gameover;
      GameOverState.__super__.setup.apply(this, arguments);
      gameover = new Label("Game Over");
      gameover.x = 150;
      gameover.y = 200;
      gameover.width = 500;
      gameover.scaleX = 5;
      gameover.scaleY = 5;
      gameover.font = "64px " + Jubiol.config.FONT;
      return this.scene.addChild(gameover);
    };
    return GameOverState;
  })();
  ClearState = (function() {
    __extends(ClearState, GameEndState);
    function ClearState() {
      ClearState.__super__.constructor.apply(this, arguments);
    }
    ClearState.prototype.setup = function() {
      var clear;
      ClearState.__super__.setup.apply(this, arguments);
      clear = new Label("Clear!");
      clear.x = 230;
      clear.y = 200;
      clear.width = 300;
      clear.scaleX = 5;
      clear.scaleY = 5;
      clear.font = "64px " + Jubiol.config.FONT;
      return this.scene.addChild(clear);
    };
    return ClearState;
  })();
  Level = (function() {
    Level.prototype.level = 0;
    function Level(stage) {
      this.stage = stage;
      this.popRate = this.level * 0.08;
      this.redRate = 0.10 + this.level * 0.01;
    }
    Level.prototype.isPop = function() {
      return Math.random() < this.popRate;
    };
    Level.prototype.setup = function() {
      return this;
    };
    Level.prototype.teardown = function() {
      return this;
    };
    Level.prototype.getBullet = function(red) {
      var bullet;
      return bullet = new Bullet(Math.random() * Jubiol.config.WIDTH - 32, 0, red);
    };
    Level.prototype.popEnemy = function(bullets) {
      var bullet, red;
      if (!this.isPop()) {
        return;
      }
      red = Math.random() < this.redRate;
      bullet = this.getBullet(red);
      return bullets.addChild(bullet);
    };
    Level.prototype.isClear = function() {
      return false;
    };
    Level.prototype.update = function() {
      return this;
    };
    return Level;
  })();
  Level1 = (function() {
    __extends(Level1, Level);
    function Level1() {
      Level1.__super__.constructor.apply(this, arguments);
    }
    Level1.prototype.level = 1;
    Level1.prototype.getBullet = function(red) {
      var angle, bullet;
      bullet = new Bullet(100 + Math.random() * (Jubiol.config.WIDTH - 132), 0, red);
      angle = -15 + Math.random() * 30;
      bullet.v.rotate(angle);
      return bullet;
    };
    return Level1;
  })();
  Level2 = (function() {
    __extends(Level2, Level);
    function Level2() {
      Level2.__super__.constructor.apply(this, arguments);
    }
    Level2.prototype.level = 2;
    Level2.prototype.getBullet = function(red) {
      var bullet;
      bullet = Level2.__super__.getBullet.apply(this, arguments);
      bullet.v = this.stage.player.center().sub(bullet.center()).resize(bullet.speed);
      return bullet;
    };
    return Level2;
  })();
  Level3 = (function() {
    __extends(Level3, Level);
    function Level3() {
      Level3.__super__.constructor.apply(this, arguments);
    }
    Level3.prototype.level = 3;
    Level3.prototype.getBullet = function(red) {
      var bullet, player;
      bullet = Level3.__super__.getBullet.apply(this, arguments);
      player = this.stage.player;
      bullet.addEventListener('enterframe', function() {
        this.v = player.center().sub(this.center()).resize(this.speed);
        this.v.x *= 0.2;
        this.v.y = 3;
        return this.update;
      });
      return bullet;
    };
    return Level3;
  })();
  Level4 = (function() {
    __extends(Level4, Level);
    Level4.prototype.level = 4;
    function Level4(stage) {
      this.stage = stage;
      Level4.__super__.constructor.apply(this, arguments);
      this.max = 30;
      this.popCount = 0;
      this.count = 0;
      this.radius = 50;
      this.bullets = [];
    }
    Level4.prototype.isPop = function() {
      ++this.popCount;
      this.popCount %= 4;
      return this.popCount === 0;
    };
    Level4.prototype.getBullet = function(red) {
      var bullet, max, vector, x, y;
      if (this.count === 0) {
        x = Math.random() * (Jubiol.config.WIDTH - 200) + 100;
        y = Math.random() * (Jubiol.config.HEIGHT - 200) + 100;
        this.centerPoint = new Vector(x, y);
        max = this.max;
        this.bullets.each(function(bullet, i) {
          bullet.v = new Vector(1, 0);
          return bullet.v = bullet.v.rotate(i * 360 / max).resize(bullet.speed / 2);
        });
        this.bullets.clear();
      }
      bullet = Level4.__super__.getBullet.apply(this, arguments);
      this.bullets.push(bullet);
      vector = new Vector(1, 0);
      vector.resize(this.radius).rotate(360 / this.max * this.count).add(this.centerPoint);
      bullet.x = vector.x;
      bullet.y = vector.y;
      bullet.v = new Vector();
      ++this.count;
      this.count %= this.max;
      return bullet;
    };
    return Level4;
  })();
  Level5 = (function() {
    __extends(Level5, Level);
    Level5.prototype.level = 5;
    function Level5(stage) {
      this.stage = stage;
      Level5.__super__.constructor.apply(this, arguments);
      this.popCount = 0;
      this.stars = [];
    }
    Level5.prototype.isPop = function() {
      ++this.popCount;
      this.popCount %= 2;
      return this.popCount === 0;
    };
    Level5.prototype.popEnemy = function(bullets) {
      var bullet, distance, max, red, star, x, y, _base, _i, _len, _ref, _results;
      if (!this.isPop()) {
        return;
      }
      if (this.stars.isEmpty() || (typeof (_base = this.stars.last()).isComplete === "function" ? _base.isComplete() : void 0)) {
        x = Math.random() * (Jubiol.config.WIDTH - 400) + 200;
        y = Math.random() * (Jubiol.config.HEIGHT - 400) + 200;
        max = Math.floor(Math.random() * 8 + 4);
        distance = Math.random() * 10 + 15;
        star = new Star(x, y, max, distance);
        this.stars.push(star);
      }
      _ref = this.stars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        star = _ref[_i];
        red = Math.random() < this.redRate;
        bullet = star.pop(red);
        _results.push(bullet ? bullets.addChild(bullet) : void 0);
      }
      return _results;
    };
    Level5.prototype.update = function() {
      var star, _i, _len, _ref, _results;
      _ref = this.stars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        star = _ref[_i];
        _results.push(star.update());
      }
      return _results;
    };
    return Level5;
  })();
  Level6 = (function() {
    __extends(Level6, Level);
    Level6.prototype.level = 6;
    function Level6(stage) {
      this.stage = stage;
      Level6.__super__.constructor.apply(this, arguments);
      this.centerPoint = new Vector(Jubiol.config.WIDTH / 2, Jubiol.config.HEIGHT / 2);
      this.bullets = [];
      this.v = new Vector(0, 10);
    }
    Level6.prototype.getBullet = function(red) {
      var bullet, vector;
      bullet = Level6.__super__.getBullet.apply(this, arguments);
      vector = this.centerPoint.clone().add(this.v.rotate(15));
      bullet.x = vector.x;
      bullet.y = vector.y;
      bullet.v = this.v.clone().resize(bullet.speed / 5);
      this.bullets.push(bullet);
      return bullet;
    };
    Level6.prototype.update = function() {
      var vector;
      vector = Jubiol.game.stage.player.center().sub(this.centerPoint).normalize();
      return this.centerPoint.add(vector);
    };
    return Level6;
  })();
  Level7 = (function() {
    __extends(Level7, Level);
    Level7.prototype.level = 7;
    function Level7(stage) {
      this.stage = stage;
      Level7.__super__.constructor.apply(this, arguments);
      this.bullets = [];
    }
    Level7.prototype.getBullet = function(red) {
      var bullet, center, vector;
      bullet = Level7.__super__.getBullet.apply(this, arguments);
      center = new Vector(Jubiol.config.WIDTH / 2, Jubiol.config.HEIGHT / 2);
      vector = Jubiol.game.stage.player.center().sub(center).resize(30);
      bullet.x = center.x;
      bullet.y = center.y;
      bullet.v = vector;
      bullet.addEventListener('enterframe', function() {
        if (!(typeof this !== "undefined" && this !== null ? this.flag : void 0)) {
          this.v.scale(0.9);
          if (this.v.length() < 1) {
            this.v = new Vector(0.5, 0);
            this.v.rotate(Math.random() * 360);
            return this.flag = true;
          }
        }
      });
      this.bullets.push(bullet);
      return bullet;
    };
    Level7.prototype.update = function() {
      if (Math.floor(Math.random() * 60) === 0) {
        return this.redRate += 0.01;
      }
    };
    return Level7;
  })();
  ServerConnectionManager = (function() {
    function ServerConnectionManager() {
      console.log('socket', 'con');
      this.address = 'http://ww24.info:3000';
      this.connect = 0;
      this.uid = 0;
      this.inited = false;
      this.guest_list = [];
      this.item;
    }
    ServerConnectionManager.prototype.onConnection = function() {
      this.socket = io.connect(this.address);
      this.socket.on('count', (function(count) {
        return console.log('count', count.count);
      }));
      this.socket.on('init', __bind(function(data) {
        return this.init(data);
      }, this));
      return this.socket.on('user_list', (__bind(function(data) {
        return this.guest_list = data;
      }, this)));
    };
    ServerConnectionManager.prototype.init = function(data) {
      this.uid = data.id;
      return this.inited = true;
    };
    return ServerConnectionManager;
  })();
  Stage = (function() {
    __extends(Stage, Group);
    function Stage() {
      Stage.__super__.constructor.apply(this, arguments);
      this.map = new Map();
      this.player = new Player(Jubiol.config.WIDTH / 2 - 16, 288);
      this.addChild(this.player);
      this.bullets = new Group();
      this.addChild(this.bullets);
      console.log('hoge', '1');
      this.server = new ServerConnectionManager();
      this.server.onConnection();
      console.log('connect', this.server.connect);
      this.player.server = this.server;
      this.guest = new GuestPlayerManager();
      this.guest.server = this.server;
      this.addChild(this.guest);
      this.field_item = new ItemManager(this.server);
      this.addChild(this.field_item);
    }
    Stage.prototype.update = function(e) {
      var item, _i, _len, _ref, _ref2, _ref3;
      this.player.update();
      this.guest.update();
      this.field_item.update();
      if ((_ref = this.levelTimer) != null) {
        _ref.tick();
      }
      if ((_ref2 = this.levelTimer) != null ? _ref2.isOver() : void 0) {
        if (this.level.level === Jubiol.config.LAST_LEVEL) {
          return new ClearState();
        }
        this.changeLevel(this.level.level + 1);
        Jukebox.play('levelup.wav');
      }
      _ref3 = this.field_item.item_obj;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        item = _ref3[_i];
        if (this.player.intersect(item)) {
          this.field_item.removeChild(item);
          console.log('col', item);
        }
      }
      return false;
    };
    Stage.prototype.changeLevel = function(lv) {
      var bullet, label, levelClass, _i, _len, _ref, _results;
      if (lv > Jubiol.config.LAST_LEVEL) {
        return;
      }
      levelClass = eval("Level" + lv);
      this.level = new levelClass(this);
      label = new Label("Level " + lv);
      label.font = "32px " + Jubiol.config.FONT;
      label.x = -50;
      label.y = 440;
      label.addEventListener('enterframe', function() {
        this.x += 20;
        if (this.x > Jubiol.config.WIDTH) {
          return this.parentNode.removeChild(this);
        }
      });
      this.addChild(label);
      this.levelTimer = new Timer(Jubiol.config.FPS * Jubiol.config.LEVEL_TIME);
      this.levelTimer.play();
      _ref = this.bullets.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bullet = _ref[_i];
        _results.push(bullet.v.isZero() ? bullet.v = Jubiol.game.stage.player.center().sub(bullet.position()).resize(bullet.speed) : void 0);
      }
      return _results;
    };
    return Stage;
  })();
  Counter = (function() {
    function Counter() {
      this.count = 0;
      this.total = 0;
      this.pressA = false;
      this.countTimer = new Timer(30);
      this.soundCount = 0;
      this.soundReverse = false;
    }
    Counter.prototype.update = function() {
      this.countTimer.tick();
      if (this.countTimer.isOver()) {
        this.countTimer.stop();
        this.soundCount = 0;
      }
      if (Jubiol.game.input.a) {
        if (!this.pressA) {
          Jukebox.play("count" + this.soundCount + ".wav");
          ++this.count;
          if (this.soundCount === 6) {
            this.soundReverse = true;
          } else if (this.soundReverse && this.soundCount === 0) {
            this.soundReverse = false;
          }
          if (this.soundCount < 6 && !this.soundReverse) {
            ++this.soundCount;
          } else if (this.soundReverse && this.soundCount > 0) {
            --this.soundCount;
          }
          this.countTimer.reset();
          this.countTimer.play();
          return this.pressA = true;
        }
      } else {
        return this.pressA = false;
      }
    };
    Counter.prototype.calcRate = function() {
      if (this.total) {
        return Math.abs(this.total - this.count) / this.total;
      }
      return 1;
    };
    Counter.prototype.calcScore = function() {
      var base, score;
      base = Jubiol.game.stage.level.level * 1000;
      score = Math.round(base + this.total * 100 - 200 * this.calcRate());
      if (score < 0) {
        score = 0;
      }
      if (this.total !== 0 && this.total === this.count) {
        score *= 2;
      }
      return score;
    };
    return Counter;
  })();
  LogoScene = (function() {
    __extends(LogoScene, Scene);
    function LogoScene() {
      LogoScene.__super__.constructor.apply(this, arguments);
    }
    LogoScene.prototype.setup = function() {
      this.kawaz = new KawazSprite(253, 81);
      this.kawaz.setImage('kawaz.png');
      this.kawaz.x = 193.5;
      this.kawaz.y = 220;
      this.kawaz.opacity = 0;
      this.addChild(this.kawaz);
      this.addEventListener('enterframe', this.update);
      this.timer = new Timer(180);
      this.timer.setComplete(function() {
        return Jubiol.game.replaceScene(new TitleScene());
      });
      return this.timer.play();
    };
    LogoScene.prototype.update = function() {
      if (Jubiol.game.input.a) {
        Jubiol.game.replaceScene(new TitleScene());
      }
      this.timer.tick();
      if (this.timer.now() < 60) {
        return this.kawaz.opacity += 1.0 / 60;
      } else if (this.timer.now() > 120) {
        return this.kawaz.opacity -= 1.0 / 60;
      }
    };
    return LogoScene;
  })();
  TitleScene = (function() {
    __extends(TitleScene, Scene);
    function TitleScene() {
      var scene;
      TitleScene.__super__.constructor.apply(this, arguments);
      this.label = new Label("Jubiol");
      this.label.font = "96px " + Jubiol.config.FONT;
      this.label.color = "#222";
      this.label.x = 195;
      this.label.y = -50;
      this.addEventListener('enterframe', this.update);
      this.timer = new Timer(50);
      this.timer.play();
      scene = this;
      this.timer.setComplete(function() {
        var cursor, howto, kawaz, play;
        play = new Label("Play");
        howto = new Label("Howto");
        kawaz = new Label("Kawaz");
        cursor = new Label(">");
        play.x = 295;
        play.y = 240;
        howto.x = 285;
        howto.y = 300;
        kawaz.x = 280;
        kawaz.y = 360;
        cursor.x = 240;
        cursor.y = 240;
        cursor.addEventListener('enterframe', function() {
          var _ref, _ref2;
          if ((_ref = this.menu) == null) {
            this.menu = 0;
          }
          if ((_ref2 = this.press) == null) {
            this.press = false;
          }
          if (Jubiol.game.input.down) {
            if (!this.press) {
              Jukebox.play('cursor.wav');
              this.press = true;
              ++this.menu;
            }
          } else if (Jubiol.game.input.up) {
            if (!this.press) {
              Jukebox.play('cursor.wav');
              this.press = true;
              --this.menu;
            }
          } else if (Jubiol.game.input.a) {
            if (this.press) {
              return;
            }
            this.press = true;
            Jukebox.play('decide.wav');
            if (this.menu === 0) {
              Jubiol.game.replaceScene(new MainScene());
            } else if (this.menu === 1) {
              window.open("http://www.kawaz.org/projects/jubiol/");
            } else if (this.menu === 2) {
              window.open("http://www.kawaz.org/");
            }
          } else {
            this.press = false;
          }
          this.menu = (this.menu + 3) % 3;
          return this.y = 240 + 60 * this.menu;
        });
        [play, howto, kawaz, cursor].each(function(v, i) {
          return v.font = "36px " + Jubiol.config.FONT;
        });
        scene.addChild(play);
        scene.addChild(howto);
        scene.addChild(kawaz);
        return scene.addChild(cursor);
      });
      this.addChild(this.label);
    }
    TitleScene.prototype.update = function() {
      this.timer.tick();
      if (!this.timer.isOver()) {
        return this.label.y = -50 + 3 * this.timer.now();
      }
    };
    return TitleScene;
  })();
  MainScene = (function() {
    __extends(MainScene, Scene);
    function MainScene() {
      MainScene.__super__.constructor.apply(this, arguments);
      this.stateManager = new StateManager(new ReadyState(this));
      this.stage = new Stage();
      Jubiol.game.stage = this.stage;
      this.addChild(this.stage);
      this.counter = new Counter();
      this.addEventListener('enterframe', this.update);
      this.addEventListener('exit', function() {
        return this.removeEventListener('enterframe');
      });
    }
    MainScene.prototype.update = function(e) {
      var state;
      state = this.stateManager.currentState().update();
      if (state === false) {
        return this.stateManager.popState();
      } else if (state !== true) {
        return this.stateManager.pushState(state);
      }
    };
    return MainScene;
  })();
}).call(this);