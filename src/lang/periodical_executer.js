/** section: lang
 * class PeriodicalExecuter
**/
var PeriodicalExecuter = Class.create({
  /**
   *  new PeriodicalExecuter(callback, frequency)
   *  - callback (Function): the function to be executed at each interval.
   *  - frequency (Number): the amount of time, in sections, to wait in between
   *      callbacks.
   *
   *  Creates an object that oversees the calling of a particular function via
   *  `window.setInterval`.
   *
   *  The only notable advantage provided by `PeriodicalExecuter` is that it
   *  shields you against multiple parallel executions of the `callback`
   *  function, should it take longer than the given interval to execute (it
   *  maintains an internal “running” flag, which is shielded against
   *  exceptions in the callback function).
   *
   *  This is especially useful if you use one to interact with the user at
   *  given intervals (e.g. use a prompt or confirm call): this will avoid
   *  multiple message boxes all waiting to be actioned.
  **/
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },
  
  /**
   *  PeriodicalExecuter#stop() -> undefined
   *
   *  Stops the periodical executer (there will be no further triggers).
  **/
  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
});
