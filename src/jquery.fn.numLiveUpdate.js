(function($){

    var dataAttrName = "data-numinc-curr",
        timeoutName = "timeoutFN",
        store = {};
    
    var randomNumber = function(ceil, floor) {

        var ret = Math.floor(Math.floor(Math.random() * (ceil - floor) + 1) + floor);
        return ret;

    };

    var getRange = function(val) {
        var ceil = Math.abs(val),
            floor = val * -1,
            ret = randomNumber(ceil, floor);
            
        return ret;
    };

    var getMargin = function(val) {
        var div = Math.abs(getRange(val));
        div = (div < 1) ? 1 : div;
        
        var diff = Math.floor(Math.abs(getRange(val / div))),
            ret = Math.floor(val - diff);

        return ret;
    };

    var generate = function(val, interval) {

        var pr = val / interval, // portion
            arr = [],
            remaining = pr * interval;
        
        for (var i = 0; i < interval; i++) {

            var mr = getMargin(pr),
                pm = getRange(mr), // plus/minus
                iVal = pr + pm;
            
            iVal = (remaining < iVal) ? remaining : iVal;
            remaining = remaining - iVal;

            if (iVal > 0) {
                arr.push(iVal);
            } else {
                break;
            }
            
        }

        return arr;

    };

    var setTimeoutFN = function(target, fn) {
        if (isStr(target)) {
            store[target].timeout = fn;
        } else {
            $.data(target, timeoutName, fn);
        }
    };

    var clearTimeoutFN = function(target) {
        clearTimeout((isStr(target)) ? store[target].timeout : $.data(target, timeoutName));
    };

    var isFn = function(val) {
        return (typeof val === "function") ? true : false;
    };

    var isStr = function(val) {
        return (typeof val === "string") ? true : false;
    };

    var getStore = function(id) {

        return store[id].val;

    };

    var setStore = function(id, val) {

        store[id].val = val;

    };

    var clearStore = function(id) {

        try {
            delete store[id];
        } catch(err) {
            store[id] = null;
        }
        
    };

    var getUID = function() {
        var i = 0,
            id = [dataAttrName, i].join("-");

        while (store[id]) {
            i++;
            id = [dataAttrName, i].join("-");
        }

        return id;
    };

    var render = function(target, info) {

        var curr,
            uid = false,
            start = info.start || 0,
            isFn = info.isFn,
            val = parseFloat(info.val),
            interval = info.interval,
            duration = info.duration;

        // create temp storage
        if (isFn) {

            uid = getUID();

            store[uid] = {
                timeout: false,
                val: start
            };

            curr = getStore(uid);
            info.startZero = (start === 0) ? true : false;

        } else {

            curr = target.attr(dataAttrName) || false;

        }

        var set = function(val) {

            if (isFn) {
                target(info.format(val));
            } else {
                target.html(info.format(val));
            }

        };

        if (!curr) {

            set(0);

        } else {

            curr = parseFloat(curr);
            start = curr;
            
        }

        if (isFn) {

            setStore(uid, val);

        } else {

            target.attr(dataAttrName, val);

        }
        

        if (start === 0 && !info.startZero) {

            set(val);

        } else {

            var diff = val - start;

            if (diff === 0) { return false; } // no difference, don't animate

            var isNeg = (diff < 0) ? true : false, // if negative to determine operator
                valArr = generate(Math.abs(diff), interval), // generate value interval
                stepArr = generate(duration, interval); // generate steps interval

            var timeoutFN = function() {

                clearTimeoutFN(uid || target);

                if (stepArr.length > 0) {

                    var timeout = stepArr.shift();

                    setTimeoutFN(uid || target, (function(){

                        return setTimeout(function(){

                            var num = (valArr.length > 0) ? valArr.shift() : 0;
                            start = (isNeg) ? (start - num) : (start + num);
                            set(start);
                            
                            timeoutFN();

                        }, timeout);

                    }()));

                } else if (start !== val) {

                    set(val);
                    clearStore(uid);

                } else if (isFn) {

                    clearStore(uid);

                }

            };

            timeoutFN();

        }

    };

    var trigger = function(opts, target) {

        render(target, {
            val: parseFloat(opts.val),
            isFn: isFn(target),
            duration: opts.duration,
            start: opts.start || 0,
            startZero: opts.startZero || false,
            interval: opts.interval || 10,
            format: opts.format || function(data) { return data; }
        });

    };

    // as a function
    $.numLiveUpdate = function(opts, callback) {

        trigger(opts, callback);

    };

    // as a binding
    $.fn.numLiveUpdate = function(opts) {

        return this.each(function(){

            trigger(opts, $(this));

        });

    };

}(jQuery));