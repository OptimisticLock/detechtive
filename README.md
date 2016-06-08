# DeTECHtive

This is Irina Rapoport's answer a coding challenge described [here](Brilliant_DeTECHtive_Take_Home.pdf)

Installation
============

1. Install Node (tested under 6.2.1)

2. Contact Irina with your email address to be added to the private Github repo,
or login to github as user tempUser@optimisticlock.com, password 3435SFH#$

3. `npm install -g https://github.com/OptimisticLock/usermindFirst.git`

(you may need root).


Running the app
===============
`detechtive <input file>`

Uninstall
=========
`npm uninstall -g detechtive`

(you may need root)

Testing
=======

`npm test`

About My Solution
=================

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


