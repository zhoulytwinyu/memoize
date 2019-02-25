export function memoize_all(fn) {
  let cache = {};
  return function(){
    let argumentsJSON = JSON.stringify(arguments);
    if (argumentsJSON in cache) {
      return cache[argumentsJSON];
    }
    else {
      cache[argumentsJSON] = fn(...arguments);
      return cache[argumentsJSON];
    }
  }
}

export function memoize(fn,capacity=1000) {
  let cache = {};
  let cachePopularity = {};
  let size=0;
  return function(){
    let argumentsJSON = JSON.stringify(arguments);
    if (argumentsJSON in cache) {
      cachePopularity[argumentsJSON]+=1;
      return cache[argumentsJSON];
    }
    else {
      console.log("here");
      // Manage cache when oversized
      if (size>=2*capacity) {
        let toRemove = getLeastPopularCache(cachePopularity,capacity);
        for (let tmp of toRemove) {
          delete cache[tmp];
          delete cachePopularity[tmp];
        }
        for (key in cachePopularity) {
          cachePopularity[key]=0;
        }
        size = cache.length;
      }
      size+=1;
      cache[argumentsJSON] = fn(...arguments);
      cachePopularity[argumentsJSON] = 1;
      console.log("and here");
      return cache[argumentsJSON];
    }
  }
}

export function memoize_one(fn) {
  let cachedArgs = undefined;
  let cachedRes = undefined;
  return function(){
    if (cachedArgs === undefined){
      cachedArgs = [...arguments];
      cachedRes = fn(...arguments);
      return cachedRes;
    }
    
    let newArgs = [...arguments];
    if (testArrayShallowEqual(cachedArgs,newArgs)){
      return cachedRes;
    }
    else {
      cachedArgs = [...arguments];
      cachedRes = fn(...arguments);
      return cachedRes;
    }
  }
}

function testArrayShallowEqual(array1,array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i=0; i<array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

function getLeastPopularCache(cachePopularityLUT,limit) {
  let cacheArray = Object.entries(cachePopularityLUT);
  return cacheArray.sort((a,b)=>{if (a[1]>b[1]) {
                                    return 1;
                                  }
                                  else if (a[1]<b[1]) {
                                    return -1;
                                  }
                                  else {
                                    return 0;
                                  }
                                  }
                          )
                    .map( row=> row[0] )
                    .slice(0,limit);
}
