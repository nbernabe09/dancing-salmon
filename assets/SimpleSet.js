(function(simpset) {
  function isArray(ar) { return Array.isArray(ar); }

  function isSet(set) {
    if(set === undefined || set === null) {
      return false;
    }
    return set.constructor.name === "Set";
  }

  function toArray(set) {
    if(!isSet(set)) set = newSet();
    return Array.from(set);
  }
  // simpset.toArray = toArray;

  function newSet(arr) {
    if(!isArray(arr)) arr = null;
    return new Set(arr);
  }
  // simpset.newSet = newSet;

  function clone(set) {
    if(!isSet(set)) set = newSet();
    return newSet(toArray(set));
  }
  // simpset.clone = clone;

  function union(set1, set2) {
    if(!isSet(set1)) set1 = newSet();
    if(!isSet(set2)) set2 = newSet();
    return new Set(([...set1,...set2]));
  }
  // simpset.union = union;

  function map(set1, func) {
    if(!isSet(set1)) set1 = newSet();
    return set1.toArray().map(func).toSet();
  }
  // simpset.map = map;

  function intersection(set1, set2) {
    if(!isSet(set1)) set1 = newSet();
    if(!isSet(set2)) set2 = newSet();
    return new Set([...set1].filter(x => set2.has(x)));
  }
  // simpset.intersection = intersection;

  function difference(set1, set2) {
    if(!isSet(set1)) set1 = newSet();
    if(!isSet(set2)) set2 = newSet();
    return new Set([...set1].filter(x => !set2.has(x)));
  }
  // simpset.difference = difference;

  function setProduct(...sets) {
    var setArs = [...sets].map((obj) => { return obj.toArray(); });
    var _inner = (args) => { return cartesianProduct.apply(null, args); };
    return _inner(setArs).map(function(obj) { return new Set(obj); });
  }
  // simpset.setProduct = setProduct;

  // https://gist.github.com/hu9o/f4e80ed4b036fd76c31ef33dc5b32601
  function cartesianProduct(...arrays) {
    function _inner(...args) {
      if (arguments.length > 1) {
        let arr2 = args.pop(); // arr of arrs of elems
        let arr1 = args.pop(); // arr of elems
        return _inner(...args,
          arr1.map(e1 => arr2.map(e2 => [e1, ...e2]))
              .reduce((arr, e) => arr.concat(e), [])
        );
      } else {
        return args[0];
      }
    };
    return _inner(...arrays, [[]]);
  };

  if(!Set.prototype.hasOwnProperty('toArray')) {
     Object.defineProperty(Set.prototype, 'toArray', {
         value: () => { return toArray(this); },
         enumerable: false,
     });
  }

  if(!Set.prototype.hasOwnProperty('clone')) {
     Object.defineProperty(Set.prototype, 'clone', {
         value: () => { return clone(this); },
         enumerable: false,
     });
  }

  if(!Set.prototype.hasOwnProperty('map')) {
     Object.defineProperty(Set.prototype, 'map', {
         value: function(func) { return new map(this, func); },
         enumerable: false,
     });
  }

  if(!Set.prototype.hasOwnProperty('union')) {
     Object.defineProperty(Set.prototype, 'union', {
         value: function(func) { return new union(this, func); },
         enumerable: false,
     });
  }

  if(!Set.prototype.hasOwnProperty('intersection')) {
     Object.defineProperty(Set.prototype, 'intersection', {
         value: function(func) { return new intersection(this, func); },
         enumerable: false,
     });
  }

  if(!Set.prototype.hasOwnProperty('difference')) {
     Object.defineProperty(Set.prototype, 'difference', {
         value: function(func) { return new difference(this, func); },
         enumerable: false,
     });
  }

  if(!Array.prototype.hasOwnProperty('toSet')) {
     Object.defineProperty(Array.prototype, 'toSet', {
         value: function() { return new Set(this); },
         enumerable: false,
     });
  }

})(window.SimpleSet = {});