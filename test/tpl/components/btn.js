(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define(["module"], factory);else if (typeof exports === 'object') exports["module"] = factory();else root["module"] = factory();
})(this, function (module = {}) {
  module.exports = function (h) {
    return h.call(
      this,
      "span",
      {
        attrs: { "class": "btn" }
      },
      function x() {
        return [this.text];
      }
    );
  };

  module.exports.id = 'btn';
  module.exports.components = [];
  return module.exports;
});