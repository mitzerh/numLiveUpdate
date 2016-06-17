numLiveUpdate
=============

Display a number difference that mimic's a live update

Example:

[http://jsfiddle.net/mitzerh/7thq7553/](http://jsfiddle.net/mitzerh/7thq7553/)

## Format options

| Options    | Type      |                                                                            |
|:-----------|-----------|----------------------------------------------------------------------------|
| `val`      | _number_  | **(required)** Value                                                       |
| `duration` | _number_  | **(required)** Time in milliseconds for this "live update" to span         |
| `interval` | _number_  | Number of times the "live updates" occur at a given duration (default: 10) |
| `format`   | _function_| Callback function to format your number value (default: none)              |
| `start`    | _number_  | Intial value on page load (default: 0)                                     |

