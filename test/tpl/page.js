(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define(["module"], factory);else if (typeof exports === 'object') exports["module"] = factory();else root["module"] = factory();
})(this, function (module = {}) {
    module.exports = function (h, Card, Btn) {
        return h.call(
            this,
            "div",
            {},
            function x() {
                return [h.call(
                    this,
                    "div",
                    {
                        attrs: { "class": "users" }
                    },
                    function x() {
                        return [h.call(
                            this,
                            Card,
                            {
                                attrs: { block: "users" }
                            }
                        )];
                    }
                ), h.call(
                    this,
                    Btn,
                    {
                        attrs: { block: "btn" }
                    }
                )];
            }
        );
    };

    module.exports.id = 'page';
    module.exports.components = ["card", "btn"];
    return module.exports;
});