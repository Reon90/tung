(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define(["module"], factory);else if (typeof exports === 'object') exports["module"] = factory();else root["module"] = factory();
})(this, function (module = {}) {
    module.exports = function (h, Button, Btn) {
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
                        attrs: { src: this.img, width: "50", height: "50", alt: "" }
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
                                attrs: { block: "isAdmin" }
                            },
                            function x() {
                                return [" \u2022 admin"];
                            }
                        )];
                    }
                ), h.call(
                    this,
                    Button,
                    {
                        attrs: { block: "btn" }
                    }
                ), h.call(
                    this,
                    Btn,
                    {
                        attrs: { block: "delete" }
                    }
                )];
            }
        );
    };

    module.exports.id = 'card';
    module.exports.components = ["button", "btn"];
    return module.exports;
});