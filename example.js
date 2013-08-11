#!/usr/bin/env node

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
