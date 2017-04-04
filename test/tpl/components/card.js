(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define(["module"], factory);else if (typeof exports === 'object') exports["module"] = factory();else root["module"] = factory();
})(this, function (module = {}) {
    module.exports = function (h, Btn) {
        return h.call(
            this,
            "div",
            {
                attrs: { "class": "item item--admin" }
            },
            function x() {
                return [h.call(
                    this,
                    "img",
                    {
                        attrs: { src: this.url, width: "50", height: "50", alt: "" }
                    }
                ), h.call(
                    this,
                    "span",
                    {
                        attrs: { "class": "item__content" }
                    },
                    function x() {
                        return [this.name, h.call(
                            this,
                            "span",
                            {
                                attrs: { block: "admin" }
                            },
                            function x() {
                                return [" \u2022 admin"];
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

    module.exports.id = 'card';
    module.exports.components = ["btn"];
    return module.exports;
});