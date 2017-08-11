(function(obsp) {
   obsp.canonObj = {
        "string":  "",
        "number":  0,
        "object":  {},
         "array":  [],
      "function":  (() => {}),
        "symbol":  Symbol(),
     "undefined":  undefined,
          "null":  null,
       "boolean":  false,
   }

   function isString(str)    { return typeof str === "string"; }
   function isNumber(num)    { return typeof num === "number"; }
   function isObject(obj)    { return typeof obj === "object" }
   function isArray(ar)      { return Array.isArray(ar); }
   function isFunction(fun)  { return typeof fun === "function"; }
   function isSymbol(sym)    { return typeof sym === "symbol"; }
   function isUndefined(und) { return typeof und === "undefined"; }
   function isNull(nul)      { return nul === null; }
   function isBoolean(bol)   { return typeof bol === "boolean"}
   function isNan(nan)       { return isNan(nan); }
   function isObsject(obs)   { return obs.constructor.name === "Obsject"; }

   function trueType(val) {
      var tmpType = typeof val;
      if(isArray(val)) { tmpType = "array"; }
      if(isNull(val)) { tmpType = "null"; }
      return tmpType;
   }

   function newObsject(obj, hasOwn) {
      return new Obsject(obj, hasOwn);
   }
   obsp.newObsject = newObsject;

   function newObset(obj) {
     return new Obset(obj);
   }
   obsp.newObset = newObset;

   function Obset(obsjAr) {
      this.setArray = [];

      function clear() {
        this.setArray = [];
      }
      this.clear = clear;

      function push(objs) {
        if(isObsject(objs)) {
          this.setArray.push(objs);
        }
      }
      this.push = push;

      function collect(param) {
        var tmpArs = [];
        this.setArray.forEach(function(elem) {
          tmpArs.push(elem[param])
        });
        return tmpArs;
      }

      function unionSet(collector) {
        var collection = collector.apply(this);
        return union.apply(this, collection);
      }

      function intersectSet(collector) {
        var collection = collector.apply(this);
        return intersection.apply(this, collection);
      }

      function unionProp(prop) {
        if(prop === "props") return unionSet.apply(this, [collectProps]);
        if(prop === "vals" ) return unionSet.apply(this, [collectValues]);
        if(prop === "types") return unionSet.apply(this, [collectTypes]);
      }
      this.unionProp = unionProp;

      function intersectProp(prop) {
        if(prop === "props") return intersectSet.apply(this, [collectProps]);
        if(prop === "vals" ) return intersectSet.apply(this, [collectValues]);
        if(prop === "types") return intersectSet.apply(this, [collectTypes]);
      }
      this.intersectProp = intersectProp;

      function collectProps() {
        return collect.apply(this, ["props"]);
      }
      this.collectProps = collectProps;

      function collectValues() {
        return collect.apply(this, ["vals"]);
      }
      this.collectValues = collectValues;

      function collectTypes() {
        return collect.apply(this, ["types"])
      }
      this.collectTypes = collectTypes;

      function union(...arr) {
        return reduce("union", new Set(), ...arr);
      }

      function intersection(...arr) {
        return reduce("intersection", new Set([...arr[0]]), ...arr);
      }

      function reduce(func, start, ...arr) {
        if(!isArray(...arr)) arr = [];
        return [...arr].reduce((agr,cur) => {
          return agr[func](cur.toSet());
        }, start);
      }

      if(isArray(obsjAr)) {
        obsjAr.forEach((elem) => {
          this.push(elem);
        })
      }
   }

   function allObj(array) {
    if(!isArray(array)) return false;
     for(var i = 0; i < array.length; i++) {
       if(!isObject(array[i]) || isArray(array[i])) return false;
     }
     return true;
   }

   function objArrayToObsj(array) {
     var tmpAr = [];
     if(isArray(array) && allObj(array)) {
       for(var i = 0; i < array.length; i++) {
        tmpAr.push(array[i].obsj());
       }
       return tmpAr;
     } else {
      return [];
     }
   }
   obsp.objArrayToObsj = objArrayToObsj;

   function Obsject(obj, hasOwn) {
      this.props  = [];
      this.vals   = [];
      this.types  = [];
      function quickAdd(prop, val) {
         this.props.push(prop);
         this.vals.push(val);
         this.types.push(trueType(val));
      }

      Object.defineProperty(this, 'pushObj', {
          enumerable: false,
          value: (prop, val, isEnum) => {
            isEnum = (isEnum === undefined || isEnum === true) ? true : false;
            if(isEnum) {
               if(obj.propertyIsEnumerable(prop)) {
                  quickAdd.apply(this, [prop, val]);
               }
            } else {
               quickAdd.apply(this, [prop, val]);
            }
         }
      });

      if(obj) {
         var allProps = Object.getOwnPropertyNames(obj);
         for(var prop in allProps) {
            this.pushObj(allProps[prop], obj[allProps[prop]], hasOwn);
         }
      }
   }

   if(!Object.prototype.hasOwnProperty('obsj')) {
      Object.defineProperty(Object.prototype, 'obsj', {
          value: function(hasOwn) {
              return newObsject(this, hasOwn);
          },
          enumerable: false,
      });
   }

})(window.Obspection = {});