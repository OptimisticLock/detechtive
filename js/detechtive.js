'use strict';

/**
 * @module detechtive
 */



module.exports = {mergeTimelines}

const Timelines = require("./timelines")

/**
 * Given the set of original timelines, merges them as per the spec.
 * @param timelines original timelines
 * @returns {timelines}     merged timelines
 */
function mergeTimelines(timelines) {

    // TODO check preconditions

    if (timelines.length === 0)
        return []

    // Convert timelines into a graph of events
    var graph = Timelines.toGraph(timelines)

    // Remove all redundant shortcut connections between events, leaving only the long chains of events
    graph.transitiveReduction()

    // Convert the graph back into timelines
    var mergedTimelines = Timelines.toTimelines(graph)

    return mergedTimelines
}

