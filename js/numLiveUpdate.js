/**
* jQuery.fn.numLiveUpdate v0.3.0 | 2016-06-17
* jQuery plugin to display a number difference that mimic's a live update
* by Helcon Mabesa
* MIT license http://opensource.org/licenses/MIT
**/

(function(app){

    window.numLiveUpdate = window.numLiveUpdate || app;

}(

    (function(){

        var dataAttrName = "data-numinc-curr",
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

        var setTimeoutFN = function(uid, fn) {
            store[uid].timeout = fn;
        };

        var clearTimeoutFN = function(uid) {
            clearTimeout(store[uid].timeout);
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

        var render = function(callback, info) {

            var curr,
                uid = getUID(),
                start = info.start || 0,
                val = parseFloat(info.val),
                interval = info.interval,
                duration = info.duration;

            store[uid] = {
                timeout: false,
                val: start
            };

            curr = getStore(uid);
            info.startZero = (start === 0) ? true : false;

            var set = function(val) {
                callback(info.format(val));
            };

            if (!curr) {
                set(0);
            } else {
                curr = parseFloat(curr);
                start = curr;
            }

            setStore(uid, val);

            if (start === 0 && !info.startZero) {

                set(val);

            } else {

                var diff = val - start;

                if (diff === 0) { return false; } // no difference, don't animate

                var isNeg = (diff < 0) ? true : false, // if negative to determine operator
                    valArr = generate(Math.abs(diff), interval), // generate value interval
                    stepArr = generate(duration, interval); // generate steps interval

                var timeoutFN = function() {

                    clearTimeoutFN(uid);

                    if (stepArr.length > 0) {

                        var timeout = stepArr.shift();

                        setTimeoutFN(uid, (function(){

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

                    } else {

                        clearStore(uid);

                    }

                };

                timeoutFN();

            }

        };

        var App = function(opts, callback) {

            // requires a callback function
            if (!isFN(callback)) { return false; }

            render(callback, {
                val: parseFloat(opts.val),
                duration: opts.duration,
                start: opts.start || 0,
                startZero: opts.startZero || false,
                interval: opts.interval || 10,
                format: opts.format || function(data) { return data; }
            });

        };

        return App;

    }())

));