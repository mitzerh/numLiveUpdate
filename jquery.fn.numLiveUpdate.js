(function($){

    var dataAttrName = "data-numinc-curr",
        timeoutName = "timeoutFN";
    
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
        $.data(target, timeoutName, fn);
    };

    var clearTimeoutFN = function(target) {
        clearTimeout($.data(target, timeoutName));
    };

    var render = function(target, info) {

        var start = 0,
            curr = target.attr(dataAttrName) || false,
            val = info.val,
            interval = info.interval,
            duration = info.duration;

        val = parseFloat(val);

        if (!curr) {

            target.html(info.format(0));

        } else {

            curr = parseFloat(curr);
            start = curr;
            
        }

        target.attr(dataAttrName, val);

        if (start === 0 && !info.startZero) {

            target.html(info.format(val));

        } else {

            var diff = val - start;

            if (diff === 0) { return false; } // no difference, don't animate

            var isNeg = (diff < 0) ? true : false, // if negative to determine operator
                valArr = generate(Math.abs(diff), interval), // generate value interval
                stepArr = generate(duration, interval); // generate steps interval

            var timeoutFN = function() {

                clearTimeoutFN(target);

                if (stepArr.length > 0) {

                    var timeout = stepArr.shift();

                    setTimeoutFN(target, (function(){

                        return setTimeout(function(){

                            var num = (valArr.length > 0) ? valArr.shift() : 0;
                            start = (isNeg) ? (start - num) : (start + num);
                            target.html(info.format(start));

                            timeoutFN();

                        }, timeout);

                    }()));

                } else if (start !== val) {

                    target.html(info.format(val));

                }

            };

            timeoutFN();


        }

    };

    $.fn.numLiveUpdate = function(opts) {

        var val = parseFloat(opts.val),
            startZero = opts.startZero || false,
            duration = opts.duration,
            interval = opts.interval || 10,
            format = opts.format || function(data) { return data; };

        return this.each(function(){

            render($(this), {
                val: val,
                interval: interval,
                duration: duration,
                format: format,
                startZero: startZero
            });

        });

    };

}(jQuery));