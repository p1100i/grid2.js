/**
 * @license
 * grid2 - v0.0.1
 * Copyright (c) 2014 burninggramma
 * https://github.com/burninggramma/grid2.js
 *
 * Compiled: 2014-04-26
 *
 * grid2 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
!function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                throw new Error("Cannot find module '" + g + "'");
            }
            var j = c[g] = {
                exports: {}
            };
            b[g][0].call(j.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a);
            }, j, j.exports, a, b, c, d);
        }
        return c[g].exports;
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e;
}({
    1: [ function(a) {
        Grid2 = a("./src/grid2");
    }, {
        "./src/grid2": 2
    } ],
    2: [ function(a, b) {
        var c;
        c = function() {
            var a = {}, b = {}, c = {
                debug: function(c) {
                    if (void 0 !== c) {
                        a.debug_ = !!c;
                        for (var d in b) this[d] = a.debug_ ? b[d] : void 0;
                        this.data_ = a.debug_ ? a : void 0;
                    }
                    return a.debug_;
                }
            };
            for (var d in c) this[d] = c[d];
        }, b.exports = c;
    }, {} ]
}, {}, [ 1 ]);