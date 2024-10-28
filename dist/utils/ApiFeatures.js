"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ApiFeatures = /** @class */ (function () {
    function ApiFeatures(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    ApiFeatures.prototype.filter = function () {
        var queryStrCopy = __assign({}, this.queryStr);
        var excludedFilter = ['sort', 'page', 'limit', 'fields'];
        excludedFilter.forEach(function (el) { return console.log(el); });
        return this;
    };
    return ApiFeatures;
}());
exports.default = ApiFeatures;
