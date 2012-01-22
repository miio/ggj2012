var GuestPlayer, GuestPlayerManager, ItemManager, ItemObject, Player;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
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