"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoize_all = memoize_all;
exports.memoize = memoize;
exports.memoize_one = memoize_one;
function memoize_all(fn) {
  var cache = {};
  return function () {
    var argumentsJSON = JSON.stringify(arguments);
    if (argumentsJSON in cache) {
      return cache[argumentsJSON];
    } else {
      cache[argumentsJSON] = fn.apply(undefined, arguments);
      return cache[argumentsJSON];
    }
  };
}

function memoize(fn) {
  var capacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

  var cache = {};
  var cachePopularity = {};
  var size = 0;
  return function () {
    var argumentsJSON = JSON.stringify(arguments);
    if (argumentsJSON in cache) {
      cachePopularity[argumentsJSON] += 1;
      return cache[argumentsJSON];
    } else {
      console.log("here");
      // Manage cache when oversized
      if (size >= 2 * capacity) {
        var toRemove = getLeastPopularCache(cachePopularity, capacity);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = toRemove[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tmp = _step.value;

            delete cache[tmp];
            delete cachePopularity[tmp];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        for (key in cachePopularity) {
          cachePopularity[key] = 0;
        }
        size = cache.length;
      }
      size += 1;
      cache[argumentsJSON] = fn.apply(undefined, arguments);
      cachePopularity[argumentsJSON] = 1;
      console.log("and here");
      return cache[argumentsJSON];
    }
  };
}

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

function getLeastPopularCache(cachePopularityLUT, limit) {
  var cacheArray = Object.entries(cachePopularityLUT);
  return cacheArray.sort(function (a, b) {
    if (a[1] > b[1]) {
      return 1;
    } else if (a[1] < b[1]) {
      return -1;
    } else {
      return 0;
    }
  }).map(function (row) {
    return row[0];
  }).slice(0, limit);
}