# DeTECHtive

I wrote this Node app as an answer to the coding challenge described [here](https://www.dropbox.com/sh/8s21475f09ln6mr/AACdxSa7WqeLMuGYQn5t64W2a/Brilliant_DeTECHtive_Take_Home.pdf?dl=0).

### Installation and usage

Download and install Node.js then run one of the following:

#### 1. Local Install

To install:

    git clone https://GuestOptimisticLock:BeMyGuest360@github.com/OptimisticLock/detechtive.git
    cd detechtive
    npm install

To run:


    ./detechtiveMain.js <fileName>


For example,


    ./detechtiveMain.js test/input/input1.json


To test:

    npm test



#### 2. Global Install

To install:

    [sudo] npm install -g https://GuestOptimisticLock:BeMyGuest360@github.com/OptimisticLock/detechtive.git

To run:

    detechtive <fileName>

To uninstall:

    npm uninstall -g detechtive




### Compatibility

Tested under Node 6.2.1 only.


## About this solution

This grew a bit out of control. This being a challenge, I did not want to just write a brute-force
solution, which is what I would have probably done in a real life app, because YAGNI.
I thought this calls for a solution that is meant to scale, e.g. a DNA sequencing app or some such.
So I went for low algorithmic complexity. In retrospect, I think I should have asked the review team
about the scalability/complexity requirements first.

To accomplish the low algorithmic complexity goal, I converted the timelines into a directed acyclic graph
of events, then I calculated the graph's [transitive reduction](https://en.wikipedia.org/wiki/Transitive_reduction)
(thus eliminating all the unnecessary short paths between that needed to be eliminated), then converted
the resulting graph back to timelines.

In doing that, I encountered these problems:

### 1. Computational complexity

In order to calculate transitive reduction, I first calculated
[transitive closure](https://en.wikipedia.org/wiki/Transitive_closure). I intended to use one of the several existing fast
alogirthms for that (listed at the above link), but did not have the time. So I cheated and used a very
slow, but simple [Floyd-Warshall](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
algorithm, which is meant for dense graphs and has the unnecessarily high complexity of O(V^3), thus defeating the whole purpose. Still,
it's a step in the right direction. In real life, I'd plug in an existing graph library instead of
reinventing the wheel.


### 2. Node.js

For this challenge, I wanted to try something new. I had never used Node for computation-intensive stuff,
though I had heard of success stories. I wanted to experiment with Node. In
retrospect, I should have used a different language.

### 3. A known bug

This is the worst part, obviously. I have a unit test that fails, producing a redundant timeline, and there is no easy
fix without changing the algorithm (the final part of the algorithm that converts graphs to timelines).

For what it's worth, the judge probably won't throw away the case just because it's a bit redundant ;-) Nevertheless,
the requirements do clearly say:

> Write a program that, given multiple arrays (eyewitness accounts), produces a **minimal** set of absolutely ordered,
maximally long arrays (timelines) to give to the prosecution.


Here is this failing unit test:

````javascript
       /**  FAIL! The result should be either
         *        [["A1", "B", "C2"], ["A2", "B", "C1"]]
         * or (preferably)
         *        [["A1", "B", "C1"], ["A2", "B", "C2"]],
         *
         * Instead, it's  [["A1", "B", "C1"], ["A1", "B", "C2"], ["A2", "B", "C1"]]. Bummer!
         */

        it("Should produce minimum of timelines", function() {
            var timelines = [["A1", "B", "C1"],
                             ["A2", "B", "C2"]]
            var result = detechtive.merge(timelines)
            result.should.have.length(2, `Too many or too few timelines: ${JSON.stringify(result)}`)
        })
````


## Time complexity

When done right (and this is not done right, see above), the worst case computational complexity can
be as low as [O(n^2.3729)](https://en.wikipedia.org/wiki/Transitive_reduction#Computational_complexity)
where n is the number of unique events.

It gets better: given that our input data is most likely very "sparce"
(meaning that for all possible combinations of events (e1, e2), e1 is seldom immediately followed
by e2), the computational complexity would be as low as O(n * m) where n is the number
of unique events and m is the number of unique couples of events (e1, e2) described above. Again,
that assumes correct application of graph theory from the reference in the above link.

Currently, the complexity is O(V^3), thanks to the slow Floyd-Marshall algorithm.

## Limitations
Node's non-blocking, nearly-single-threaded nature means one can't use this package as a part of a system that needs
to operate in real time, e.g. a webserver, if it's to crunch any significant amounts of data. At least, not directly. It needs to operate in a
separate process, or it can be modified, e.g. to use webworker threads.

## Roadmap

### 1. Topological sorting

Rewrite the whole thing from scratch. Explore an alternative solution involving
[topological sorting](https://en.wikipedia.org/wiki/Topological_sorting). Do it in Python or Scala or another
langauge that lends itself easily to this and has good libraries.

That's what I
would have tried now if I did this challenge from scratch. A topological search is both easy to implement and conceptualize
and  fast to compute; the two metrics I am looking for, and would have fixed this failing unit test problem. Alas, no time.

This is really the only important item on the roadmap, I could end it right there.


### 2. Javascript arrays
Javascript can sometimes (not always) store arrays as a hashmap from 
keys to values. Which works great for sparse arrays. If a dense array
is desired, [here](https://www.youtube.com/watch?feature=player_detailpage&v=XAqIpGU8ZZk#t=994s)
are good tips on how to accomplish that. The implication especially on memory footprint should be significant.

Also, consider using `TypedArray`.

### 3. TODOs
Search the code base for "TODO". There is a lot.

### 4. Testing

Needs much more tests written. Not just of one method.

### 5. Profiling

I expect lots of surprises, this being Javascript.

### 5. Object-oriented

ES6 has added syntactic sugar that simplifies writing
object-oriented code, and I wanted to experiment wtih that. I did not finish. `Graph.js` is object-oriented, `timelines.js`
is not. The entire code base needs to either be object-oriented, or not. (Besides, `timelines.js` needs refactoring,
it's way too verbose.)

### 6. Migrate from ES5 to ES6

Use `let`,  `const`, arrow functions, etc.



