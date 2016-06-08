#!/usr/bin/env node

'use strict';

/**
 * @module detechtiveMain
 */

 /* A standalone utility. Reads and timelines from json file specified in the first command line argument.
 * Prints modified timelines to standard output.
 */



var detechtive = require("./js/detechtive")
var fs = require('fs')


// Only use this in a standalone app, not in a module
process.on('uncaughtException', function(err) {

    console.log(err.message)

    if (err.showStackTrace !== false)
        console.log(err.stack)

    const ERROR = 1
    process.exit(ERROR)
})

// TODO print output, error when file not found,

// First command line argument is path to nodejs, second is path to js file being executed, followed by
// application-specific arguments

var argv = process.argv
var filename = argv[2] || ""
const USAGE = "usage: detective [file]"

// Is file name omitted or incorrect?
if (filename.length === 0 || filename[0] === '-') {
    const error = new Error(USAGE)
    error.showStackTrace = false
    throw error
}


// TODO: this loads the whole json file into memory at once. Use stream instead.
fs.readFile(filename, 'utf8', (err, contents) => {

    // TODO better error handling
    if (err) {
        err.showStackTrace = false
        throw err
    }

    var timelines = JSON.parse(contents)
    var mergedTimelines = detechtive.merge(timelines)
    console.log(toString(mergedTimelines))

})

// TODO what if it's very long?
/**
 * Convert timelines to string. TODO: can be too big, use stream instead
 * @param timelines
 * @returns {string}
 */
function toString(timelines) {

    // Could just JSON.stringify() the entire timelines object, but it would be harder to get whitespaces right.

    var result = "[\n"

    for (var timeline of timelines)
        result += JSON.stringify(timeline) + "\n"

    result += "]"

    return result
}