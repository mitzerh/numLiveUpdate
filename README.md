jQuery.fn.numLiveUpdate
=======================

Display a number difference that mimic's a live update

Example:

As a jQuery element bind:

[http://jsfiddle.net/mitzerh/r93bn13v/](http://jsfiddle.net/mitzerh/r93bn13v/)

As an independent plugin:

[http://jsfiddle.net/mitzerh/7thq7553/](http://jsfiddle.net/mitzerh/7thq7553/)

## Format options

**REQUIRED**

`val` - (number) value

`duration` - (number) Time in milliseconds for this "live update" to span

**OPTIONAL**

`interval` - (number) The number of times the "live updates" occur at a given duration | DEFAULT: 10

`format` - (function) Callback function to format your number value | DEFAULT: none

`startZero` - (boolean) On inital page load, start from 0 | DEFAULT: false

`start` - (number) Only if used as an independent plugin. Ignored on element bind | DEFAULT: 0