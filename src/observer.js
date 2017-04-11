'use strict';

class Observer {
    constructor() {
        this.listeners = {};
    }

    on(evt, callback, ctx) {
        if (!this.listeners.hasOwnProperty(evt)) {
            this.listeners[evt] = [];
        }
        let index = this.listeners[evt].length;
        this.listeners[evt][index] = {};
        this.listeners[evt][index].fn = callback;
        this.listeners[evt][index].ctx = ctx;
        
        return this;
    }

    off(evt, callback) {
        if (this.listeners.hasOwnProperty(evt)) {
            var i, length;

            for (i = 0, length = this.listeners[evt].length; i < length; i += 1) {
                if (this.listeners[evt][i] === callback) {
                    this.listeners[evt].splice(i, 1);
                }
            }
        }
        
        return this;
    }

    fire(evt, ...args) {
        if (this.listeners.hasOwnProperty(evt)) {
            var i, length;

            for (i = 0, length = this.listeners[evt].length; i < length; i += 1) {
                if (!args) {
                    args = [];
                }
                this.listeners[evt][i].fn.apply(this.listeners[evt][i].ctx, args);
            }
        }
    }
}

export default Observer;