'use strict';

/** A timeline is an array of events in chronological order.
 * TODO: convert into a class; rename.
 */

/**
 * @module timelines
 */


module.exports = {
    toTimelines,    // convert timelines to graph
    toGraph        // convert graph to timelines

}

const assert = require('assert')
const Events = require('./events')
const Graph = require('./graph')

var mergedTimelines = []

let visitedEvents
let visitedEventCount

/**
 * Converts a graph to an array of timelines
 * @param graph
 * @returns {Array} Array of timelines
 */
function toTimelines(graph) {
    visitedEvents = new Array(graph.length)
    visitedEventCount = 0

    mergedTimelines = []
    var mergedTimeline = []
    toTimelines0(graph, mergedTimeline, 0, 0)
    return mergedTimelines // TODO check standalone
}


/**
 * A "private" recursive function converting a graph to an array of timelines
 * @param graph     a graph to convert
 * @param timeline  the timeline we are currently building
 * @param event     the id of the starting event
 * @param depth     the depth of the recursion
 */
function toTimelines0(graph, timeline, event, depth) {


    var nextEvents = graph.nextVertices(event)

    if (!nextEvents) {
        var v = graph.nextEvents(4)
        console.log("vvv", v)
    }

    // No more events, finished with this timeline, store it and return
    if (nextEvents.length === 0) {
        // TODO: asserts in production?
        // TODO finish or finish_symbol?
        assert(event == Events.FINISH, "FINISH should be the Last event in any timeline") // TODO
        //    var clone = timeline.slice(0, depth - 1)

        const newTimeline = new Array(depth - 1)

        let timelineHasUnvisitedEvents = false

        for (let i = 0; i < depth - 1; i++) {
            var event = timeline[i]

            if (!visitedEvents[event]) {
                timelineHasUnvisitedEvents = true
                visitedEventCount++
                visitedEvents[event] = true
            }

            newTimeline[i] = events.name(event)
        }

        if (timelineHasUnvisitedEvents)
            mergedTimelines.push(newTimeline)
    }  // TODO node versions TODO const


    let allVisited = true

    // Visit all previously unvisited events that immediately follow the current one
    for (var nextEvent in nextEvents) {
        var isVisited = visitedEvents[nextEvent]
        if (!isVisited) {
            allVisited = false
            timeline[depth] = nextEvent
            toTimelines0(graph, timeline, nextEvent, depth + 1)
        }
    }

    // If any unvisited events follow, recording the already visited ones would be redundant
    if (!allVisited)
        return

    // If no unvisited events follow, we still need to get from start to finish, so
    // must use a visited event (TODO: which?) TODO: dry. TODO: for

    for (var nextEvent in nextEvents) {
        var isVisited = visitedEvents[nextEvent]
        timeline[depth] = nextEvent
        toTimelines0(graph, timeline, nextEvent, depth + 1)
        break
    }

}

/**
 * Compute a graph of longest paths from v1 to v2 using modified Floyd–Warshall algorithm
 * https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
 *
 * I keep thinking I can bring complexity down closer to O(n * n) by using
 * http://math.stackexchange.com/questions/369134/how-to-use-warshalls-algorithm
 * but alas, out of time. Please let me know if you'd like me to dig deeper on this.
 *
 * TODO: V8/Node stores arrays in one of the two modes: sparse (a hashmap from indices to values)
 * and dense (traditional C-style arrays). Sometimes I take advantage of sparse arrays, at other
 * times I should ensure the array is stored in dense mode, by specifying array sizes in constructor
 *  ahead of the time and by not deleting individual elements of the array. The footprint
 *  difference could be substantial. Ditto typed arrays.
 */


/**
 * TODO: events should be a property of something. Don't want to make it a property of
 * Graph, because Graph should be a generic graph library that's event-agnostic.
 * Don't want to make it static in case two sets of timelines
 * coexist at the same time. Probably will be a property of Timelines once that's converted
 * into a class.
 */


let events = new Events()

/**
 *
 * @param timelines
 * @returns {Graph|*}
 */
function toGraph(timelines) {

    events = new Events()

    let graph = new Graph()

    var numWitnesses = timelines.length

    for (var witness = 0; witness < numWitnesses; witness++) {
        var timeline = timelines[witness]

        var last = 0
        for (var eventName of timeline) {

            var eventId = events.add(eventName)

            // St// Store witness number in the adjacency graph in order to (TODO) sort timelines inore witness number in the adjacency graph in order to (TODO) sort timelines in
            // an order resembling that of the input file.

            // If the order of timelines (as opposed to events within a single timeline) is not important,
            // then it's possible to rewrite the graph allowing for one bit per cell.

            graph.set(last, eventId, witness)

            last = eventId
        }

        const FINISH = 1  // TODO
        graph.set(last, FINISH, witness)
    }

    return graph
}


