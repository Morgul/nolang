//----------------------------------------------------------------------------------------------------------------------
// Brief Description of pid.js.
//
// @module pid.js
//----------------------------------------------------------------------------------------------------------------------

var autoID = 0;

//----------------------------------------------------------------------------------------------------------------------

function Pid(app, func)
{
    this.app = app;
    this.func = func;
    this.id = autoID++;
} // end Pid

Pid.prototype = {
    get execString()
    {
        return '(function(){ self = '
            + this.id
            + ';\n'
            + 'var func = '
            + this.func.toString()
            + '.call(this);'
            + '})()';
    }
}; // end prototype

Pid.prototype.exec = function()
{
    this.app.pool.any.eval(this.execString, function(err, data)
    {
        console.log('Pid %s returned: %s %s', this.id, err, data)
    })
}; // end exec

//----------------------------------------------------------------------------------------------------------------------

module.exports = Pid;

//----------------------------------------------------------------------------------------------------------------------