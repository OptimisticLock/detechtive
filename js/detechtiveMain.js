#!/usr/bin/env node

'use strict';

/**
 * @module detechtiveMain
 */

 /* A standalone utility. Reads and timelines from json file specified in the first command line argument.
 * Prints modified timelines to standard output.
 */



var detechtive = require("./detechtive")
var fs = require('fs')


// Only use this in a standalone app, not in a module
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("****Uncaught exception", err)
    const ERROR = 1
    process.exit(ERROR)
})

// TODO print output, error when file not found,

// First command line argument is path to nodejs, second is path to js file being executed, followed by
// application-specific arguments

var argv = process.argv
var filename = argv[2] || ""

// Is file name omitted or incorrect?
if (filename.length === 0 || filename[0] === '-') {
    usage()
    throw new Error("Usage")
}


// TODO: this loads the whole json file into memory at once. Use stream instead.
fs.readFile(filename, 'utf8', (err, contents) => {

    // TODO better error handling
    if (err) {
        console.log(err.message)
        throw err
    }

    var timelines = JSON.parse(contents)
    var merged = detechtive.merge(timelines)

})


/**
 * Print usage to standard output
 */
function usage() {
    console.log('usage: detective [file]')
}