(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define(["module"], factory);else if (typeof exports === 'object') exports["module"] = factory();else root["module"] = factory();
})(this, function (module = {}) {
    module.exports = function (h) {
        return h.call(
            this,
            "div",
            {},
            function x() {
                return [h.call(
                    this,
                    "div",
                    {
                        attrs: { "class": "users", block: "users" }
                    },
                    function x() {
                        return [h.call(
                            this,
                            'div',
                            {
                                attrs: { class: "user" }
                            }
                        )];
                    }
                ), h.call(
                    this,
                    'div',
                    {
                        attrs: { block: "btn" }
                    }
                )];
            }
        );
    };

    module.exports.id = 'simple';
    module.exports.components = [];
    return module.exports;
});