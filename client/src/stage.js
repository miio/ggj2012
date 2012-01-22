var Counter, ServerConnectionManager, Stage;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
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