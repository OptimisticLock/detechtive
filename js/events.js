'use strict';

/**
 * @module events
 */

/**
 * A collection of events. "Shout", "Light a match" are examples of events. An event has a name and a number.
 * First two events (zero and one) are reserved for Start and Finish pseudo-events, added here to simplify handling
 * of corner cases.
 *
 * TODO: this should probably be refactored to some other place. 
 * I mainly wanted to encapsulate the ugliness of a linear lookup.
 */

var Events = module.exports = class {
    constructor() {
        // These are symbols, not strings, in an odd case our input includes identical strings.
        this.events = [Symbol("***Start***"), Symbol("***Finish***")]
    }

    name(eventId) {
        return this.events[eventId]
    }

    /**
     * Adds a new event if it has not already been added.
     * @param eventName
     * @returns {number} eventId
     */
    add(eventName) {
        // TODO inefficient
        var eventId = this.eventId(eventName)
        return eventId === -1 ? this.events.push(eventName) - 1 : eventId
    }

    /**
     * Looks up event by name 
     * @param eventName
     * @returns {number} eventId
     */
    eventId(eventName) {
        // TODO inefficient
        return this.events.indexOf(eventName)
    }
}

/**
 * eventId of the Start pseudo-event
 * @type {number}
 */
Events.START = 0

/**
 * eventId of the Finish pseudo-event
 * @type {number}
 */
Events.FINISH = 1



