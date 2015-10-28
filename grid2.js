/**
 * @license
 * grid2 - v0.5.0
 * Copyright (c) 2015 p1100i
 * https://github.com/p1100i/grid2.js
 *
 * Compiled: 2015-10-29
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
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j;
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a);
            }, k, k.exports, a, b, c, d);
        }
        return c[g].exports;
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e;
}({
    1: [ function(a, b, c) {
        Grid2 = a("./src/grid2");
    }, {
        "./src/grid2": 3
    } ],
    2: [ function(a, b, c) {
        !function d(a, c, e) {
            function f(a, b) {
                return this instanceof f ? (g(a) ? (b = a[1], a = a[0]) : "object" == typeof a && a && (b = a.y, a = a.x), 
                this.x = f.clean(a || 0), void (this.y = f.clean(b || 0))) : new f(a, b);
            }
            var g = function(a) {
                return "[object Array]" === Object.prototype.toString.call(a);
            };
            f.prototype = {
                change: function(a) {
                    if ("function" == typeof a) this.observers ? this.observers.push(a) : this.observers = [ a ]; else if (this.observers && this.observers.length) for (var b = this.observers.length - 1; b >= 0; b--) this.observers[b](this, a);
                    return this;
                },
                ignore: function(a) {
                    if (this.observers) if (a) for (var b = this.observers, c = b.length; c--; ) b[c] === a && b.splice(c, 1); else this.observers = [];
                    return this;
                },
                set: function(a, b, c) {
                    if ("number" != typeof a && (c = b, b = a.y, a = a.x), this.x === a && this.y === b) return this;
                    var d = null;
                    return c !== !1 && this.observers && this.observers.length && (d = this.clone()), this.x = f.clean(a), 
                    this.y = f.clean(b), c !== !1 ? this.change(d) : void 0;
                },
                zero: function() {
                    return this.set(0, 0);
                },
                clone: function() {
                    return new this.constructor(this.x, this.y);
                },
                negate: function(a) {
                    return a ? new this.constructor(-this.x, -this.y) : this.set(-this.x, -this.y);
                },
                add: function(a, b, c) {
                    return "number" != typeof a && (c = b, g(a) ? (b = a[1], a = a[0]) : (b = a.y, a = a.x)), a += this.x, 
                    b += this.y, c ? new this.constructor(a, b) : this.set(a, b);
                },
                subtract: function(a, b, c) {
                    return "number" != typeof a && (c = b, g(a) ? (b = a[1], a = a[0]) : (b = a.y, a = a.x)), a = this.x - a, 
                    b = this.y - b, c ? new this.constructor(a, b) : this.set(a, b);
                },
                multiply: function(a, b, c) {
                    return "number" != typeof a ? (c = b, g(a) ? (b = a[1], a = a[0]) : (b = a.y, a = a.x)) : "number" != typeof b && (c = b, 
                    b = a), a *= this.x, b *= this.y, c ? new this.constructor(a, b) : this.set(a, b);
                },
                rotate: function(a, b, c) {
                    var d, e, f = this.x, g = this.y, h = Math.cos(a), i = Math.sin(a);
                    return b = b ? -1 : 1, d = h * f - b * i * g, e = b * i * f + h * g, c ? new this.constructor(d, e) : this.set(d, e);
                },
                length: function() {
                    var a = this.x, b = this.y;
                    return Math.sqrt(a * a + b * b);
                },
                lengthSquared: function() {
                    var a = this.x, b = this.y;
                    return a * a + b * b;
                },
                distance: function(a) {
                    var b = this.x - a.x, c = this.y - a.y;
                    return Math.sqrt(b * b + c * c);
                },
                nearest: function(a) {
                    for (var b, c = Number.MAX_VALUE, d = null, e = a.length - 1; e >= 0; e--) b = this.distance(a[e]), 
                    c >= b && (c = b, d = a[e]);
                    return d;
                },
                normalize: function(a) {
                    var b = this.length(), c = b < Number.MIN_VALUE ? 0 : 1 / b;
                    return a ? new this.constructor(this.x * c, this.y * c) : this.set(this.x * c, this.y * c);
                },
                equal: function(a, b) {
                    return "number" != typeof a && (g(a) ? (b = a[1], a = a[0]) : (b = a.y, a = a.x)), f.clean(a) === this.x && f.clean(b) === this.y;
                },
                abs: function(a) {
                    var b = Math.abs(this.x), c = Math.abs(this.y);
                    return a ? new this.constructor(b, c) : this.set(b, c);
                },
                min: function(a, b) {
                    var c = this.x, d = this.y, e = a.x, f = a.y, g = e > c ? c : e, h = f > d ? d : f;
                    return b ? new this.constructor(g, h) : this.set(g, h);
                },
                max: function(a, b) {
                    var c = this.x, d = this.y, e = a.x, f = a.y, g = c > e ? c : e, h = d > f ? d : f;
                    return b ? new this.constructor(g, h) : this.set(g, h);
                },
                clamp: function(a, b, c) {
                    var d = this.min(b, !0).max(a);
                    return c ? d : this.set(d.x, d.y);
                },
                lerp: function(a, b, c) {
                    return this.add(a.subtract(this, !0).multiply(b), c);
                },
                skew: function(a) {
                    return a ? new this.constructor(-this.y, this.x) : this.set(-this.y, this.x);
                },
                dot: function(a) {
                    return f.clean(this.x * a.x + a.y * this.y);
                },
                perpDot: function(a) {
                    return f.clean(this.x * a.y - this.y * a.x);
                },
                angleTo: function(a) {
                    return Math.atan2(this.perpDot(a), this.dot(a));
                },
                divide: function(a, b, c) {
                    if ("number" != typeof a ? (c = b, g(a) ? (b = a[1], a = a[0]) : (b = a.y, a = a.x)) : "number" != typeof b && (c = b, 
                    b = a), 0 === a || 0 === b) throw new Error("division by zero");
                    if (isNaN(a) || isNaN(b)) throw new Error("NaN detected");
                    return c ? new this.constructor(this.x / a, this.y / b) : this.set(this.x / a, this.y / b);
                },
                isPointOnLine: function(a, b) {
                    return (a.y - this.y) * (a.x - b.x) === (a.y - b.y) * (a.x - this.x);
                },
                toArray: function() {
                    return [ this.x, this.y ];
                },
                fromArray: function(a) {
                    return this.set(a[0], a[1]);
                },
                toJSON: function() {
                    return {
                        x: this.x,
                        y: this.y
                    };
                },
                toString: function() {
                    return "(" + this.x + ", " + this.y + ")";
                },
                constructor: f
            }, f.fromArray = function(a, b) {
                return new (b || f)(a[0], a[1]);
            }, f.precision = c || 8;
            var h = Math.pow(10, f.precision);
            return f.clean = a || function(a) {
                if (isNaN(a)) throw new Error("NaN detected");
                if (!isFinite(a)) throw new Error("Infinity detected");
                return Math.round(a) === a ? a : Math.round(a * h) / h;
            }, f.inject = d, a || (f.fast = d(function(a) {
                return a;
            }), "undefined" != typeof b && "object" == typeof b.exports ? b.exports = f : window.Vec2 = window.Vec2 || f), 
            f;
        }();
    }, {} ],
    3: [ function(a, b, c) {
        var d, e = a("vec2");
        d = function(a) {
            var b, c, d, f = 1, g = {}, h = {}, i = {}, j = 1, k = "id", l = "pos", m = "rad", n = new e(1, 1), o = {
                between: {
                    dirty: 0,
                    queries: {}
                }
            }, p = function(a, b) {
                this.id = a, this.begPosition = b.clone(), this.center = this.begPosition.add(d, !0), this.objects = {}, 
                this.meta = {};
            }, q = function(a, b, c) {
                o[a].dirty = j, o[a].queries[b] = c;
            }, r = function(a, b) {
                return o[a].dirty === j && o[a].queries[b] ? o[a].queries[b] : void 0;
            }, s = function(a, b) {
                return a.toString() + "_" + b.toString();
            }, t = function(a) {
                a && j++;
            }, u = function() {
                return f++;
            }, v = function(a) {
                return i[a[k]] || (i[a[k]] = {}), i[a[k]];
            }, w = function(a) {
                var b;
                return a = y(a), b = a.toString(), h[b] || (h[b] = new p(b, a)), h[b];
            }, x = function(a) {
                var b, d, e = {}, f = a[m], g = a[l], i = g.subtract(f, f, !0), j = g.add(f, f, !0).subtract(n), k = y(i), o = y(j);
                for (d = k.clone(); d.x <= o.x; d.x += c.x) for (d.y = k.y; d.y <= o.y; d.y += c.y) b = d.toString(), 
                e[b] = h[b], e[b] || (e[b] = h[b] = new p(b, d));
                return e;
            }, y = function(a) {
                return new e(Math.floor(a.x / c.x) * c.x, Math.floor(a.y / c.y) * c.y);
            }, z = function(a) {
                a[k] || (a[k] = u());
            }, A = function(a) {
                var b, c, d = !1, e = v(a), f = x(a);
                for (c in e) f[c] || (d = !0, b = e[c], delete b.objects[a[k]], delete e[c]);
                for (c in f) e[c] || (d = !0, b = f[c], b.objects[a[k]] = a, e[c] = b);
                t(d);
            }, B = function(a) {
                z(a), A(a), g[a[k]] = a;
            }, C = function(a) {
                var b;
                for (b = 0; b < a.length; b++) B(a[b]);
            }, D = function(a) {
                var b, c, d, e = {};
                a = y(a), c = h[a.toString()], d = c && c.objects;
                for (b in d) e[b] = d[b];
                return e;
            }, E = function(a, b) {
                var d, e, f, g = {}, i = y(a), j = y(b), k = s(i, j), l = r("between", k);
                if (l) return l;
                for (f = i.clone(); f.x <= j.x; f.x += c.x) for (f.y = i.y; f.y <= j.y; f.y += c.y) if (e = h[f.toString()]) for (d in e.objects) g[d] = e.objects[d];
                return q("between", k, g), g;
            }, F = function(a) {
                var b = D(a);
                return !(!b || !Object.keys(b).length);
            }, G = function(a) {
                A(a);
            }, H = function(a) {
                var b;
                for (b = 0; b < a.length; b++) G(a[b]);
            }, I = function(a, b, c) {
                var d = w(a);
                d.meta[b] = c;
            }, J = function(a, b) {
                var c;
                return a = y(a), c = h[a.toString()], c && c.meta[b];
            }, K = function() {
                return {
                    objects: g,
                    cells: h
                };
            }, L = function(a) {
                b = a.size.clone(), c = a.cellSize.clone(), d = c.multiply(.5, !0);
            };
            return L(a), this.addObject = B, this.addObjects = C, this.getObjectsOn = D, this.getObjectsBetween = E, 
            this.hasObjectsOn = F, this.updateObject = G, this.updateObjects = H, this.setMetaOn = I, this.getMetaOn = J, 
            this.inspect = K, this;
        }, b.exports = d;
    }, {
        vec2: 2
    } ]
}, {}, [ 1 ]);
