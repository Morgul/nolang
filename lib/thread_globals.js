//----------------------------------------------------------------------------------------------------------------------
// A bunch of re-implemented things to make the environment in threads a little more sane.
//
// @module thread_globals.js
//----------------------------------------------------------------------------------------------------------------------

function set_globals()
{
    console = {
        log: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'log', args: args}));
        },
        info: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'info', args: args}));
        },
        error: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'error', args: args}));
        },
        warn: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'warn', args: args}));
        },
        dir: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'dir', args: args}));
        },
        time: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'time', args: args}));
        },
        timeEnd: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'timeEnd', args: args}));
        },
        trace: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'trace', args: args}));
        },
        assert: function()
        {
            var args = Array.prototype.slice.call(arguments, 0);
            thread.emit('console', JASON.stringify({func: 'assert', args: args}));
        }
    }; // end console

    receive = function receive(event, listener)
    {
        thread.on(event, function(data)
        {
            if(data.pid == self)
            {
                listener(data.message);
            } // end if
        });
    }; // end receive

    send = function(event, pid, message)
    {
        thread.emit(event, {pid: pid, message: message});
    };
} // end set_globals

//----------------------------------------------------------------------------------------------------------------------

module.exports = '(' + set_globals.toString() + ')()';

//----------------------------------------------------------------------------------------------------------------------