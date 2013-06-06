-----

Unfortunately, the current state of things is such that the library I'm using has some fundamental issues that make it
ill-suited for this use-case. This project could totally be a reality, but it will involve modifying the threading
library, and doing some work in C. While I can do that, I'm not currently working on that at the moment. I'll update
this notice if I pick this up again.

-----

# Nolang

What is Nolang? Well, it's a portmanteau of 'node' and 'erlang'. It's also _an actor style concurrency framework for
Node.js that implements a large percentage of Erlang's OTP framework_.

## ...What?

Erlang has a beautiful concurency model. You can create a lightweight process, called a `pid`, which will execute the
function you create it with. While that's neat, the real power comes in the ability to pass messages to the pid, and have
it execute code based on those messages.

No state is shared between pids, except via message passing. This makes them much easier to work with than your standard
threading model. Pids are the backbone that most of Erlang's impressive level of concurrency is built upon.

Pids aren't the whole store, however. Erlang's OTP project also implements Supervisors (which monitor pids, and can take
action if they die), `gen_server` (a module that simplifies building pids that are long running, listening to lots of
messages), `gen_fsm` (a module similiar to `gen_server`, except it implements a finite state machine), and `gen_event` (a
module similiar to `gen_server`, but it is more focused on emitting events to a listeners based on messages coming in).

Nolang attempts to borrow the pieces of this that make sense, and build them ontop of a threading library comparitble with
node.js; basically taking the strengths of Erlang and the strengths of Node, and combining them.

## But node doesn't need threads!

I direct you to the wonderful description from the [threads-a-gogo](https://github.com/xk/node-threads-a-gogo) library:

> [Node.js](http://nodejs.org) is the most [awesome, cute and super-sexy](http://javascriptology.com/threads_a_gogo/sexy.jpg) piece of free, open source software.
>
> Its event loop can spin as fast and smooth as a turbo, and roughly speaking, **the faster it spins, the more power it delivers**. That's why [@ryah](http://twitter.com/ryah) took great care to ensure that no -possibly slow- I/O operations could ever block it: a pool of background threads (thanks to [Marc Lehmann's libeio library](http://software.schmorp.de/pkg/libeio.html)) handle any blocking I/O calls in the background, in parallel.
>
> ...
>
> The "can't block the event loop" problem is inherent to Node's evented model. No matter how many Node processes you have running as a [Node-cluster](http://blog.nodejs.org/2011/10/04/an-easy-way-to-build-scalable-network-programs/), it won't solve its issues with CPU-bound tasks.
>
> Launch a cluster of N Nodes running the example B (`quickIntro_blocking.js`) above, and all you'll get is N -instead of one- Nodes with their event loops blocked and showing a sluggish performance.

For this exact reason, I wrote Nolang, building ontop of [threads-a-gogo](https://github.com/xk/node-threads-a-gogo).
Using a paradigm that, IMHO, is the simplest concurency model I've ever worked with seemed like a no-brainer. At the same
time, it allowed me to implement the supervisor functionality of Erlang, something that has proven itself over decades to
provide a level of stability that no other systems have ever been able to achieve.

Nolang makes Node.js a stable, high-performance, multi-core beast that _just won't go down_.
