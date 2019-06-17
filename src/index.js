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
