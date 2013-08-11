Stream Smash
============

Smash two object streams together, or, `select * from stream1 join stream2 on stream1.x = stream2.y`.

Overview
--------

Correlating two streams is usually really annoying. I wanted it to be less
annoying.

Operation
---------

StreamSmash takes the input of two streams and correlates them based on the
value of certain properties on the objects passing through. The end result is
something analogous to a `JOIN`, from your favourite relational database.

The way that it works is that it takes all the input from both streams and
keeps it sitting around until either a) you tell it to flush its contents, or
b) you end both of the input streams. Upon this happening, the StreamSmash
instance will become readable and will have a bunch of objects waiting for you
to pick up.

The objects will be the input of the "local" stream with the input of the
"other" stream attached in arrays according to matching the values specified in
`localKey` and `otherKey` in the local and other objects respectively.

Super Quickstart
----------------

Also see [example.js](https://github.com/deoxxa/stream-smash/blob/master/example.js).

```javascript
var StreamSmash = require("./index");

var cats = [
  {id: 1, name: "dotty"},
  {id: 2, name: "honey"},
];

var belongings = [
  {id: 1, catId: 1, name: "cheese thing"},
  {id: 2, catId: 1, name: "flicky material thing"},
  {id: 3, catId: 2, name: "pillow"},
  {id: 4, catId: 1, name: "other pillow"},
  {id: 5, catId: 2, name: "bed"},
];

var smash = new StreamSmash({
  localKey: "id",
  otherKey: "catId",
  smashKey: "belongings",
});

smash.on("data", console.log);

cats.forEach(smash.localStream.write.bind(smash.localStream));
belongings.forEach(smash.otherStream.write.bind(smash.otherStream));

smash.localStream.end();
smash.otherStream.end();
```

Output:

```
{ id: 1,
  name: 'dotty',
  other:
   [ { id: 1, catId: 1, name: 'cheese thing' },
     { id: 2, catId: 1, name: 'flicky material thing' },
     { id: 4, catId: 1, name: 'other pillow' } ] }
{ id: 2,
  name: 'honey',
  other:
   [ { id: 3, catId: 2, name: 'pillow' },
     { id: 5, catId: 2, name: 'bed' } ] }
```

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install stream-smash

Or via git:

> $ git clone git://github.com/deoxxa/stream-smash.git node_modules/stream-smash

API
---

**constructor**

Constructs a new StreamSmash object, providing some hints about how to join
together the objects from both.

```javascript
new StreamSmash(options);
```

```javascript
// basic instantiation
var smash = new StreamSmash({
  localKey: "id",
  otherKey: "catId",
  smashKey: "belongings",
});
```

Arguments

* _options_ - an object providing options for configuring the StreamSmash
  instance

Options

* _localKey_ - the key to use as the discriminator for the "local" side of the
  join-like operation that StreamSmash does
* _otherKey_ - the key to use as the "foreign" side of the join
* _smashKey_ - the key to put the results from the foreign side of the join
  into on the local-side objects

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* ADN ([@deoxxa](https://alpha.app.net/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
