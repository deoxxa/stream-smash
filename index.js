var stream = require("stream");

var StreamSmash = module.exports = function StreamSmash(options) {
  options = options || {};
  options.objectMode = true;

  stream.Readable.call(this, options);

  this._objects = {};
  this._embedded = {};

  this._localKey = options.localKey || "id";
  this._otherKey = options.otherKey || "otherId";
  this._embedInto = options.embedInto || "other";

  this.localStream = new stream.PassThrough({objectMode: true});
  this.otherStream = new stream.PassThrough({objectMode: true});

  this._localEnded = false;
  this._otherEnded = false;

  var self = this;
  this.localStream.on("data", function(object) {
    self._objects[object[self._localKey]] = object;
  });
  this.otherStream.on("data", function(object) {
    var key = object[self._otherKey];

    if (!self._embedded[key]) {
      self._embedded[key] = [];
    }

    self._embedded[key].push(object);
  });

  this.localStream.on("end", function() {
    self._localEnded = true;
    if (self._otherEnded) {
      self.commit();
      self.push(null);
    }
  });

  this.otherStream.on("end", function() {
    self._otherEnded = true;
    if (self._localEnded) {
      self.commit();
      self.push(null);
    }
  });
};
StreamSmash.prototype = Object.create(stream.Readable.prototype, {constructor: {value: StreamSmash}});

StreamSmash.prototype._read = function _read(n) {};

StreamSmash.prototype.commit = function commit() {
  for (var k in this._objects) {
    this._objects[k][this._embedInto] = this._embedded[k];
    this.push(this._objects[k]);
    delete this._embedded[k];
    delete this._objects[k];
  }

  return this;
};
