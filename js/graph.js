'use strict';

/**
 * @module graph
 */

/**
 * <p>Class representing an adjacency matrix for a graph.
 * TODO: this is part graph, part adjacency matrix of a graph. Decouple those two things. </p>
 *
 *  <o>Any graph has as a miminum two vertices: Start (0) and Finish (1).
 * The "real" events have indices starting with 2.
 * This is to avoid special handling while dealing with corner cases of first/last event.
 * Those two quazi-events are internal and should not make it to the final output. </p>
 * @type {Graph}
 */
module.exports = class Graph {
    constructor() {

        // An array of arrays
        this.matrix = []
    }

    get(row, column) {
        const array = this.matrix[row] || []
        return array[column]
    }

    set(row, column, value) {

        let array = this.matrix[row]

        if (!array) {
            array = []
            this.matrix[row] = array
        }
        array[column] = value
    }

    // This violates encapsulation, but hey, this is JS. TODO: change name
    nextVertices(vertex) {
        return this.matrix[vertex] || []
    }

    numVertices() {
        return this.matrix.length
    }

    delete(row, col) {
        delete this.matrix[row][col]
    }


    /**
     * Converts a graph to a longest distance matrix.
     * In this matrix, dist[i][j] is the longest distance between vertex i and j.
     * This uses a modified FLoyd-Warshall algorithm. The complexity  of the algorithm is |V|^3, which is bad.
     * Here is a source for an algorithm with O((E + V) * V )
     * http://www.geeksforgeeks.org/shortest-path-for-directed-acyclic-graphs/
     *
     * TODO: this is most likely a sparse graph. There are much faster algorithms for sparse graphs:
     * http://cs.stackexchange.com/questions/7644/what-is-the-fastest-algorithm-for-finding-all-shortest-paths-in-a-sparse-graph
     * http://stackoverflow.com/questions/27205793/longest-path-between-all-pairs-in-a-dag
     *
     * @returns {Graph}
     */

    toDistanceMatrix() {

        const numVertices = this.numVertices()

        // TODO: this one should probably be a dense array for performance reasons
        const dist = new Graph()

        // Initialize rows in the matrix
        for (var i = 0; i < numVertices; i++) {

            // TODO https://www.youtube.com/watch?feature=player_detailpage&v=XAqIpGU8ZZk#t=994s

            // Distance from a vertice to self is 0
            dist.set(i, i, 0)

            // Distance to adjacent vertice is 1
            for (var j in this.nextVertices(i))
                dist.set(i, j, 1)
        }

        for (var k = 0; k < numVertices; k++) {
            // TODO: Also, would be nice to add a bit of input validation, i.e. to detect circular paths.
            // TODO: make sure MAX_SAFE_I is not exceeded
            for (var i = 0; i < numVertices; i++)   // TODO i = "0" and not 0
                for (var j = 0; j < numVertices; j++) {
                    var dist1 = dist.get(i, k)
                    var dist2 = dist.get(k, j)

                    // Is k unreachable from i or j unreachable from k?
                    if (!dist1 || !dist2)
                        continue

                    var distK = Math.min(dist1 + dist2, Number.MAX_SAFE_INTEGER)

                    if (distK > (dist.get(i, j) || 0))
                        dist.set(i, j, distK)
                }
        }
        return dist
    }


    /**
     * Assert the graph does not have cycles.
     * TODO: needs more careful testing to rule out false negatives.
     * this is because if the graph is cyclical, how correct is our path matrix? Needs looking into.
     * If the graph is cyclical, we fail, because requirements say:
     * "the ordering of events must be absolutely correct or else the judge will throw our case out".
     * TODO: are assertions enabled in production? If not, need a different library. A precondition checker perhaps?
     */
    assertAcyclical() {

        // TODO no asserts in production

        const numVertices = this.numVertices()

        for (let i = 0; i < numVertices; i++)
            for (let j = i + 1; j < numVertices; j++)
                if (this.get(i, j) && this.get(j, i)) {
                    // TODO add meaningful event names
                    assert(false, `Bad input data: can't tell which happened first, "${i}" or "${j}"`)
                }
    }


    /**
     * Translates this graph into its transitive reduction, i.e. removes all redundant shorter paths without
     * altering any vertex's reachability from any other vertex. For example, if in the original graph,
     * a -> b and b -> c and a -> c, the transitive reduction operator removes a -> c
     *
     * https://en.wikipedia.org/wiki/Transitive_reduction
     */

    transitiveReduction() {
        var dist = this.toDistanceMatrix()
        dist.assertAcyclical()

        var numVertices = this.numVertices()

        for (var i = 0; i < numVertices; i++)
            for (var j in this.nextVertices(i)) {
                // If a vertice V from i to j exists, and also a longer path
                // from i to j exists, then V is redundant and is to be removed
                if (dist.get(i, j) > 1)
                    this.delete(i, j)
            }
    }
}
