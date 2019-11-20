/**
* numLiveUpdate v0.4.0 | 2019-11-20
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

        function render(info, step, done) {

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
                step(info.format(val));
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
                        if (isFn(done)) {
                            done(uid);
                        }
                    } else {
                        clearStore(uid);
                        if (isFn(done)) {
                            done(uid);
                        }
                    }

                };

                timeoutFN();

            }

            return uid;

        }

        function randomNumber(ceil, floor) {
            return Math.floor(Math.floor(Math.random() * (ceil - floor) + 1) + floor);
        }

        function getRange(val) {
            var ceil = Math.abs(val),
                floor = val * -1,
                ret = randomNumber(ceil, floor);

            return ret;
        }

        function getMargin(val) {
            var div = Math.abs(getRange(val));
            div = (div < 1) ? 1 : div;

            var diff = Math.floor(Math.abs(getRange(val / div))),
                ret = Math.floor(val - diff);

            return ret;
        }

        function generate(val, interval) {

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

        }

        function setTimeoutFN(uid, fn) {
            store[uid].timeout = fn;
        }

        function clearTimeoutFN(uid) {
            clearTimeout(store[uid].timeout);
        }

        function isFn(val) {
            return (typeof val === "function") ? true : false;
        }

        function isStr(val) {
            return (typeof val === "string") ? true : false;
        }

        function getStore(id) {
            return store[id].val;
        }

        function setStore(id, val) {
            store[id].val = val;
        }

        function clearStore(id) {
            try {
                delete store[id];
            } catch(err) {
                store[id] = null;
            }
        }

        function getUID() {
            var i = 0,
                id = [dataAttrName, i].join("-");

            while (store[id]) {
                i++;
                id = [dataAttrName, i].join("-");
            }

            return id;
        }

        return function(opts, step, done) {

            // requires a step callback function
            if (!isFn(step)) { return null; }

            return render({
                val: parseFloat(opts.val),
                duration: opts.duration,
                start: opts.start || 0,
                startZero: opts.startZero || false,
                interval: opts.interval || 10,
                format: opts.format || function(data) { return data; }
            }, step, done);

        };

    }())

));
