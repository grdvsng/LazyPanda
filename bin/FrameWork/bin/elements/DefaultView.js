"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var BasicElement_1 = require("./BasicElement");
var DefaultView = (function (_super) {
    __extends(DefaultView, _super);
    function DefaultView(core, child, master) {
        var _this = _super.call(this, core, child, master) || this;
        _this.type = "View";
        _this["class"] = "DefaultView";
        _this.self = _this;
        return _this;
    }
    return DefaultView;
}(BasicElement_1.BasicElement));
