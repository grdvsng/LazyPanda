"use strict";
exports.__esModule = true;
var BasicElement = (function () {
    function BasicElement(core, child, master) {
        this.master = master;
        this.htmlClass = (child['htmlClass'] === undefined) ? "div" : child['htmlClass'];
    }
    return BasicElement;
}());
exports.BasicElement = BasicElement;
