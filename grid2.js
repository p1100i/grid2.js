/**
 * @license
 * grid2 - v0.6.0
 * Copyright (c) 2015 p1100i
 * https://github.com/p1100i/grid2.js
 *
 * Compiled: 2021-01-03
 *
 * grid2 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function e(i, s, o) {
    function u(n, t) {
        if (!s[n]) {
            if (!i[n]) {
                var r = "function" == typeof require && require;
                if (!t && r) return r(n, !0);
                if (h) return h(n, !0);
                throw (r = new Error("Cannot find module '" + n + "'")).code = "MODULE_NOT_FOUND", r;
            }
            r = s[n] = {
                exports: {}
            }, i[n][0].call(r.exports, function(t) {
                return u(i[n][1][t] || t);
            }, r, r.exports, e, i, s, o);
        }
        return s[n].exports;
    }
    for (var h = "function" == typeof require && require, t = 0; t < o.length; t++) u(o[t]);
    return u;
}({
    1: [ function(t, n, r) {
        Grid2 = t("./src/grid2");
    }, {
        "./src/grid2": 3
    } ],
    2: [ function(t, u, n) {
        !function t(n, r, e) {
            var i = function(t) {
                return "[object Array]" === Object.prototype.toString.call(t);
            };
            function s(t, n) {
                if (!(this instanceof s)) return new s(t, n);
                i(t) ? (n = t[1], t = t[0]) : "object" == typeof t && t && (n = t.y, t = t.x), this.x = s.clean(t || 0), 
                this.y = s.clean(n || 0);
            }
            s.prototype = {
                change: function(t) {
                    if ("function" == typeof t) this.observers ? this.observers.push(t) : this.observers = [ t ]; else if (this.observers && this.observers.length) for (var n = this.observers.length - 1; 0 <= n; n--) this.observers[n](this, t);
                    return this;
                },
                ignore: function(t) {
                    if (this.observers) if (t) for (var n = this.observers, r = n.length; r--; ) n[r] === t && n.splice(r, 1); else this.observers = [];
                    return this;
                },
                set: function(t, n, r) {
                    if ("number" != typeof t && (r = n, n = t.y, t = t.x), this.x === t && this.y === n) return this;
                    var e = null;
                    return !1 !== r && this.observers && this.observers.length && (e = this.clone()), this.x = s.clean(t), 
                    this.y = s.clean(n), !1 !== r ? this.change(e) : void 0;
                },
                zero: function() {
                    return this.set(0, 0);
                },
                clone: function() {
                    return new this.constructor(this.x, this.y);
                },
                negate: function(t) {
                    return t ? new this.constructor(-this.x, -this.y) : this.set(-this.x, -this.y);
                },
                add: function(t, n, r) {
                    return "number" != typeof t && (r = n, t = i(t) ? (n = t[1], t[0]) : (n = t.y, t.x)), t += this.x, n += this.y, 
                    r ? new this.constructor(t, n) : this.set(t, n);
                },
                subtract: function(t, n, r) {
                    return "number" != typeof t && (r = n, t = i(t) ? (n = t[1], t[0]) : (n = t.y, t.x)), t = this.x - t, 
                    n = this.y - n, r ? new this.constructor(t, n) : this.set(t, n);
                },
                multiply: function(t, n, r) {
                    return "number" != typeof t ? (r = n, t = i(t) ? (n = t[1], t[0]) : (n = t.y, t.x)) : "number" != typeof n && (r = n, 
                    n = t), t *= this.x, n *= this.y, r ? new this.constructor(t, n) : this.set(t, n);
                },
                rotate: function(t, n, r) {
                    var e = this.x, i = this.y, s = Math.cos(t), o = Math.sin(t), t = s * e - (n = n ? -1 : 1) * o * i, i = n * o * e + s * i;
                    return r ? new this.constructor(t, i) : this.set(t, i);
                },
                length: function() {
                    var t = this.x, n = this.y;
                    return Math.sqrt(t * t + n * n);
                },
                lengthSquared: function() {
                    var t = this.x, n = this.y;
                    return t * t + n * n;
                },
                distance: function(t) {
                    var n = this.x - t.x, t = this.y - t.y;
                    return Math.sqrt(n * n + t * t);
                },
                nearest: function(t) {
                    for (var n, r = Number.MAX_VALUE, e = null, i = t.length - 1; 0 <= i; i--) (n = this.distance(t[i])) <= r && (r = n, 
                    e = t[i]);
                    return e;
                },
                normalize: function(t) {
                    var n = this.length(), n = n < Number.MIN_VALUE ? 0 : 1 / n;
                    return t ? new this.constructor(this.x * n, this.y * n) : this.set(this.x * n, this.y * n);
                },
                equal: function(t, n) {
                    return "number" != typeof t && (t = i(t) ? (n = t[1], t[0]) : (n = t.y, t.x)), s.clean(t) === this.x && s.clean(n) === this.y;
                },
                abs: function(t) {
                    var n = Math.abs(this.x), r = Math.abs(this.y);
                    return t ? new this.constructor(n, r) : this.set(n, r);
                },
                min: function(t, n) {
                    var r = this.x, e = this.y, i = t.x, t = t.y, i = r < i ? r : i, t = e < t ? e : t;
                    return n ? new this.constructor(i, t) : this.set(i, t);
                },
                max: function(t, n) {
                    var r = this.x, e = this.y, i = t.x, t = t.y, i = i < r ? r : i, t = t < e ? e : t;
                    return n ? new this.constructor(i, t) : this.set(i, t);
                },
                clamp: function(t, n, r) {
                    t = this.min(n, !0).max(t);
                    return r ? t : this.set(t.x, t.y);
                },
                lerp: function(t, n, r) {
                    return this.add(t.subtract(this, !0).multiply(n), r);
                },
                skew: function(t) {
                    return t ? new this.constructor(-this.y, this.x) : this.set(-this.y, this.x);
                },
                dot: function(t) {
                    return s.clean(this.x * t.x + t.y * this.y);
                },
                perpDot: function(t) {
                    return s.clean(this.x * t.y - this.y * t.x);
                },
                angleTo: function(t) {
                    return Math.atan2(this.perpDot(t), this.dot(t));
                },
                divide: function(t, n, r) {
                    if ("number" != typeof t ? (r = n, t = i(t) ? (n = t[1], t[0]) : (n = t.y, t.x)) : "number" != typeof n && (r = n, 
                    n = t), 0 === t || 0 === n) throw new Error("division by zero");
                    if (isNaN(t) || isNaN(n)) throw new Error("NaN detected");
                    return r ? new this.constructor(this.x / t, this.y / n) : this.set(this.x / t, this.y / n);
                },
                isPointOnLine: function(t, n) {
                    return (t.y - this.y) * (t.x - n.x) == (t.y - n.y) * (t.x - this.x);
                },
                toArray: function() {
                    return [ this.x, this.y ];
                },
                fromArray: function(t) {
                    return this.set(t[0], t[1]);
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
                constructor: s
            }, s.fromArray = function(t, n) {
                return new (n || s)(t[0], t[1]);
            }, s.precision = r || 8;
            var o = Math.pow(10, s.precision);
            return s.clean = n || function(t) {
                if (isNaN(t)) throw new Error("NaN detected");
                if (!isFinite(t)) throw new Error("Infinity detected");
                return Math.round(t) === t ? t : Math.round(t * o) / o;
            }, s.inject = t, n || (s.fast = t(function(t) {
                return t;
            }), void 0 !== u && "object" == typeof u.exports ? u.exports = s : window.Vec2 = window.Vec2 || s), 
            s;
        }();
    }, {} ],
    3: [ function(t, n, r) {
        var p = t("vec2"), t = function(t) {
            function h(t, n) {
                this.id = t, this.begPosition = n.clone(), this.center = this.begPosition.add(o, !0), this.objects = {}, 
                this.meta = {};
            }
            function c(t) {
                return new p(Math.floor(t.x / f.x) * f.x, Math.floor(t.y / f.y) * f.y);
            }
            function n(t) {
                t.id || (t.id = a++);
            }
            function r(t) {
                var n, r, e, i = !1, s = (l[(e = t).id] || (l[e.id] = {}), l[e.id]), o = function(t) {
                    for (var n, r = {}, e = t.rad, i = t.pos, t = i.subtract(e, e, !0), e = i.add(e, e, !0).subtract(b), s = c(t), o = c(e), u = s.clone(); u.x <= o.x; u.x += f.x) for (u.y = s.y; u.y <= o.y; u.y += f.y) r[n = u.toString()] = x[n], 
                    r[n] || (r[n] = x[n] = new h(n, u));
                    return r;
                }(t);
                for (r in s) o[r] || (i = !0, delete (n = s[r]).objects[t.id], delete s[r]);
                for (r in o) s[r] || (i = !0, (n = o[r]).objects[t.id] = t, s[r] = n);
                i && d++;
            }
            function e(t) {
                n(t), r(t), y[t.id] = t;
            }
            function i(t) {
                var n, r, e = {};
                for (n in t = c(t), r = (t = x[t.toString()]) && t.objects) e[n] = r[n];
                return e;
            }
            function s(t) {
                r(t);
            }
            var f, o, u, a = 1, y = {}, x = {}, l = {}, d = 1, b = new p(1, 1), v = {
                between: {
                    dirty: 0,
                    queries: {}
                }
            };
            return (u = t).size.clone(), f = u.cellSize.clone(), o = f.multiply(.5, !0), this.addObject = e, this.addObjects = function(t) {
                for (var n = 0; n < t.length; n++) e(t[n]);
            }, this.getObjectsOn = i, this.getObjectsBetween = function(t, n) {
                var r, e, i, s, o = {}, u = c(t), h = c(n), t = (s = h, u.toString() + "_" + s.toString()), n = function(t, n) {
                    if (v[t].dirty === d && v[t].queries[n]) return v[t].queries[n];
                }("between", t);
                if (n) return n;
                for (i = u.clone(); i.x <= h.x; i.x += f.x) for (i.y = u.y; i.y <= h.y; i.y += f.y) if (e = x[i.toString()]) for (r in e.objects) o[r] = e.objects[r];
                return s = t, n = o, v[t = "between"].dirty = d, v[t].queries[s] = n, o;
            }, this.hasObjectsOn = function(t) {
                t = i(t);
                return !(!t || !Object.keys(t).length);
            }, this.updateObject = s, this.updateObjects = function(t) {
                for (var n = 0; n < t.length; n++) s(t[n]);
            }, this.setMetaOn = function(t, n, r) {
                var e;
                (t = (e = c(e = t)).toString(), x[t] || (x[t] = new h(t, e)), x[t]).meta[n] = r;
            }, this.getMetaOn = function(t, n) {
                return t = c(t), (t = x[t.toString()]) && t.meta[n];
            }, this.inspect = function() {
                return {
                    objects: y,
                    cells: x
                };
            }, this;
        };
        n.exports = t;
    }, {
        vec2: 2
    } ]
}, {}, [ 1 ]);