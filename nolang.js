//----------------------------------------------------------------------------------------------------------------------
// The primary Nolang class. Similar to an Erlang application.
//
// @module nolang.js
//----------------------------------------------------------------------------------------------------------------------

var os = require('os');
var threads = require('threads_a_gogo');
var JASON = require('JASON');

var Pid = require('./lib/pid');
var globals = require('./lib/thread_globals');

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates a Nolang Application. One is required to use any of Nolang's features.
 * @constructor
 */
function Application()
{
    this.asyncThreadCount = os.cpus().length;
} // end Application

/**
 * Performs all mandatory initialization.
 * @private
 */
Application.prototype._init = function()
{
    console.log('Starting %s threads.', this.asyncThreadCount);
    this.pool = threads.createPool(this.asyncThreadCount);

    // Populate our thread contexts
    this.pool.all.eval("JASON = "+ JASON.stringify(JASON));
    this.pool.all.eval(globals);

    // Handle console events
    this.pool.on('console', this._console_handler);
}; // end _init

Application.prototype._console_handler = function(consoleData)
{
    consoleData = JASON.parse(consoleData);
    console[consoleData.func].apply(this, consoleData.args);
}; // end _console_handler

/**
 * Starts the Nolang application.
 * @param {Function} startFunc A function to execute in the context of Application instance. Assumed to be the entry point
 * for Nolang based applications.
 */
Application.prototype.start = function start(startFunc)
{
    // Handle the case where we don't have a function to execute.
    startFunc = startFunc || function(){};

    // Initialize the application
    this._init();

    // Call the program's start callback.
    startFunc.call(this);

    (function spinForever () {
        //process.stdout.write(".");
        process.nextTick(spinForever);
    })();
}; // end start

/**
 * Executes a function in the context of the application instance.
 * @param {Function} func The function to execute in the application's context.
 */
Application.prototype.exec = function exec(func)
{
    // We try to execute the function in the context of the application, and catch any errors caused, so we don't crash
    // the application.
    try
    {
        func.call(this);
    }
    catch(ex)
    {
        console.error('Error executing function %s in app context: \n', func, ex);
    } // end try/catch
}; // end exec


/**
 * Creates a new Pid instance, executing `func`. This must be run inside the Application's context.
 * @param func
 */
Application.prototype.spawn = function spawn(func)
{
    var pid = new Pid(this, func);
    pid.exec();
}; // end spawn

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    Application: Application
}; // end exports

//----------------------------------------------------------------------------------------------------------------------