# DeTECHtive

I wrote this Node app as an answer to the coding challenge described [here](https://www.dropbox.com/sh/8s21475f09ln6mr/AACdxSa7WqeLMuGYQn5t64W2a/Brilliant_DeTECHtive_Take_Home.pdf?dl=0).

## Installation and usage

Download and install Node.js (only tested under Node 6.2.1), then run one of the following:

#### 1. Local Install

    npm install https://GuestOptimisticLock:BeMyGuest360@github.com/OptimisticLock/detechtive.git

To execute from command line:

    ./node_modules/.bin/detechtiveMain.js <fileName>

To call programmatically:
```javascript

let detechtive = require("detechtive")

let timelines = [["fight", "gunshot", "fleeing"],
                 ["gunshot", "falling", "fleeing"]
                ]

var result = detechtive.merge(timelines)
```


### 2. Global Install

(you may need root)

    npm install -g https://GuestOptimisticLock:BeMyGuest360@github.com/OptimisticLock/detechtive.git

To execute:

    detechtive <fileName>

To uninstall (you may need root):

    npm uninstall -g detechtive


# Testing

    npm test

# About My Solution

This sort of grew out of control. This being a challenge, I did not want to just brute-force
a solution, which is what I would have normally done in real life unless I had a good reason not to,
because YAGNI, _premature optimization is the root of all evil_, etc. I imagined this is a solution
that is meant to scale, e.g. a DNA sequencing app or some such. So I went for low algorithmic
complexity. In retrospect, perhaps I should not have.

To accomplish the low algorithmic complexity goal, I converted the timelines into a directed acyclic graph
of events, then I calculated the graph's [transitive reduction](https://en.wikipedia.org/wiki/Transitive_reduction)
(thus eliminating all the unnecessary short paths between that needed to be eliminated), then converted
the resulting graph back to timelines.

In doing that, I encountered two problems.

###1. Computational complexity

In order to calculate transitive reduction, I first calculated
[transitive closure](https://en.wikipedia.org/wiki/Transitive_closure). I intended to one of the several existing fast
alogirthms for that (listed at the above link), but that's when I first realized I am really running out
of time. So I cheated and used the very slow, but simple [Floyd-Warshall](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
algorithm, which has the unnecessarily high complexity of O(V^3), thus defeating the whole purpose.

In real life though, if a fast algorithm was desired, that would have been a step in the right direction,
especially given that there are plenty of graph libraries to use, so no need to reinvent the wheel.

###2. Node.js

For this challenge, I wanted to try something new. I had never used Node for computation-intensive stuff,
though I had heard other people have done that fairly successfully. I wanted to experiment with that. I learned
a lot about Node/V8 in the process, e.g. its different ways of internal representation for dense vs. sparse arrays,
profiling tools, etc. It would have been a lot easier to develop this in Python, but curiocity killed the cat.

TODO say that Node is single-threaded

###3. A known bug.

This is the worst part, obviously. I have a unit test that fails, and there is no easy fix without
changing the algorithm (precizely, the part that converts graphs to timelines).



# A YAGNI disclaimer

In real life, my first question would be: does my use case warrant
careful optimization, or would a slow,
but easily readable and maintainable solution suffice?

Some real life use cases call for careful optimization, for example, a DNA sequencing app
(which would be very similar to this one). Many more don't.

EDIT: after discussing with the review team, turned out that this should have been my first
question for the challenge as well :-)


# Algorithm

The app does the following:

1. Convert the timelines into an adjacency matrix of events (a DAG).

2. Calculate the transitive reduction for the matrix, thus eliminating all short
paths (e1, e2) for which an alternative longer path (e1, .. ei... e2) exists.

3. Convert the transitive reduction graph back to the timelines.


### Time complexity

When done right (and I stopped short of implementing it right due to time constraints), the worst case computational complexity can be as low as O(n^2.3729)
(source: https://en.wikipedia.org/wiki/Transitive_reduction#Computational_complexity)
where n is the number of unique events.

It gets better: given that our input data is most likely very "sparce"
(meaning that for all couples of events (e1, e2),  e1 is not often immediately followed
by e2 in any timeline), the computational complexity would as low as O(n * m) where n is the number
of unique events and m is the number of unique couples of events (e1, e2) described above. Again,
that assumes correct application of graph theory from the reference in the above link.

In real life, I'd just plug in many of the many 3rd party graph libraries.



# Node

For this challenge, I wanted to experiment with writing 
computation-intensive code in Node, something I had not done 
before, so please be kind ;-)


# Roadmap

## Check the input data for validity

Right now, we assume input data is valid, for instance that it has no cycles.


## Tips to improve performance

### Dence vs. sparse graphs

If performance/footprint is important, consider replacing dense DAG with
a sparse one. This use case probably has sparse input data,
i.e. not many events are adjacent. Efficient algorithms exist to
optimize for this case.

## Performance considerations specific to V8/Node

### Javascript arrays
Javascript can sometimes (not always) store arrays as a hashmap from 
keys to values. Which works great for sparse arrays. If a dense array
is desired, here are the tips to
accomplish that (caution, old source): https://www.youtube.com/watch?feature=player_detailpage&v=XAqIpGU8ZZk#t=994s
The implication on performance can be very significant.

Also, consider using TypedArray.

# Roadmap
(In addition to all the numerous TODOs in the source)

* Explore a solution involving topological sorting. That's probably what I would have tried now if I did this challenge
from scratch.

* Need much better test coverage. Not just testing of one method.

* Profiling. This can probably perform much better after small tweaks.

* Finish the conversion to OO or undo it. OO was a bit cumbersome to write in ES5, which may be a part of the reason why it's not a major part of the culture.
This is my first experiment with OO in ES6, mostly I wanted to get a feel of how good or bad it is. In any case, I am
not happy with leaving the code half OO.

* Replace `var` with `let` and `const`.


