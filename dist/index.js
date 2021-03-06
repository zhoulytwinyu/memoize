"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoize_one = memoize_one;
function memoize_one(fn) {
  var cachedArgs = undefined;
  var cachedRes = undefined;
  return function () {
    if (cachedArgs === undefined) {
      cachedArgs = [].concat(Array.prototype.slice.call(arguments));
      cachedRes = fn.apply(undefined, arguments);
      return cachedRes;
    }

    var newArgs = [].concat(Array.prototype.slice.call(arguments));
    if (testArrayShallowEqual(cachedArgs, newArgs)) {
      return cachedRes;
    } else {
      cachedArgs = [].concat(Array.prototype.slice.call(arguments));
      cachedRes = fn.apply(undefined, arguments);
      return cachedRes;
    }
  };
}

function testArrayShallowEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (var i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}