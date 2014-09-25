jQuery.fn.numLiveUpdate
=======================

Display a number difference that mimic's a live update

Example:
[http://jsfiddle.net/mitzerh/r93bn13v/](http://jsfiddle.net/mitzerh/r93bn13v/)

## Format options

**REQUIRED**

`val` - (number) value

`duration` - (number) Time in milliseconds for this "live update" to span

**OPTIONAL**

`interval` - (number) The number of times the "live updates" occur at a given duration | DEFAULT: 10

`format` - (function) Callback function to format your number value | DEFAULT: none

`startZero` - (boolean) On inital page load, start from 0 | DEFAULT: false
