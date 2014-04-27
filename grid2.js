/**
 * @license
 * grid2 - v0.2.0
 * Copyright (c) 2014 burninggramma
 * https://github.com/burninggramma/grid2.js
 *
 * Compiled: 2014-04-27
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
        "./src/grid2": 4
    } ],
    2: [ function(a, b) {
        var c;
        c = {
            fnName: function(a) {
                var b = a.toString();
                return b = b.substr("function ".length), b = b.substr(0, b.indexOf("("));
            },
            thrower: function(a, b, c) {
                var d = a;
                throw c && (d += "_" + c), b && (d += " - "), b && c && (d += c + ": "), b && (d += b), new Error(d);
            },
            getIdsOfObjects: function(a) {
                var b = [];
                for (var c in a) b.push(a[c].id_);
                return b;
            },
            compare: function(a, b) {
                return a - b;
            },
            arrayDiffs: function(a, b, c) {
                var d = 0, e = 0, f = [], g = [];
                for (a.sort(c || this.compare), b.sort(c || this.compare); d < a.length && e < b.length; ) a[d] !== b[e] ? a[d] < b[e] ? (f.push(a[d]), 
                d++) : (g.push(b[e]), e++) : (d++, e++);
                return d < a.length ? f.push.apply(f, a.slice(d, a.length)) : g.push.apply(g, b.slice(e, b.length)), 
                [ f, g ];
            },
            isPointInsideOfBox: function(a, b, c) {
                return !(c.x < a.x || c.y < a.y || b.x <= c.x || b.y <= c.y);
            },
            isBoxIntersectingBox: function(a, b, c, d) {
                return !(d.x <= a.x || d.y <= a.y || b.x <= c.x || b.y <= c.y);
            },
            validateNumber: function(a, b) {
                "number" != typeof a && this.thrower("NaN", "Not a Number", b);
            },
            validateString: function(a, b) {
                "string" == typeof a || a instanceof String || this.thrower("NaS", "Not a String", b);
            },
            validateVec2: function(a, b) {
                var c = !1;
                c = "object" != typeof a || void 0 === a.x || void 0 === a.y || void 0 === a.add, c && this.thrower("NaV", "Not a Vec2", b);
            },
            validateDefined: function(a, b) {
                void 0 === a && this.thrower("ND", "Not defined", b);
            },
            validateObject: function(a, b) {
                "object" != typeof a && this.thrower("NaO", "Not an Object", b);
            },
            hasKey: function(a, b, c) {
                this.validateDefined(a, "obj"), -1 === Object.keys(a).indexOf(b.toString()) && this.thrower("OhnK", "Object has no key", c + b);
            },
            hasNoKey: function(a, b, c) {
                this.validateDefined(a, "obj"), -1 !== Object.keys(a).indexOf(b.toString()) && this.thrower("OhK", "Object has key", c + b);
            },
            fnFalse: function(a) {
                a() && this.thrower("FarT", "function already returns true", this.fnName(a));
            },
            byCallbackObject: function(a, b, c) {
                var d;
                for (d in b) void 0 !== c ? b[d](a[c[d]], c[d]) : b[d](a[d], d);
            }
        }, b.exports = c;
    }, {} ],
    3: [ function(a, b) {
        !function c(a, d, e) {
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
            }, f.precision = d || 8;
            var h = Math.pow(10, f.precision);
            return f.clean = a || function(a) {
                if (isNaN(a)) throw new Error("NaN detected");
                if (!isFinite(a)) throw new Error("Infinity detected");
                return Math.round(a) === a ? a : Math.round(a * h) / h;
            }, f.inject = c, a || (f.fast = c(function(a) {
                return a;
            }), "undefined" != typeof b && "object" == typeof b.exports ? b.exports = f : window.Vec2 = window.Vec2 || f), 
            f;
        }();
    }, {} ],
    4: [ function(a, b) {
        var c, d = a("vec2"), e = a("my-helper"), f = a("./grid2quadrant");
        c = function(a, b) {
            var c = {
                ids_: 1,
                objects_: {},
                quadrants_: {},
                objectQuadrants_: {},
                cache_: {
                    between: {
                        dirty: 0,
                        queries: {}
                    }
                },
                dirty_: 1,
                size_: null,
                quadrantSize_: null
            }, g = {
                position: "position_",
                halfSize: "halfSize_",
                id: "id_"
            }, h = {
                cache: function(a, b, d) {
                    c.cache_[a].dirty = c.dirty_, c.cache_[a].queries[b] = d;
                },
                cached: function(a, b) {
                    return c.cache_[a].dirty === c.dirty_ && c.cache_[a].queries[b] ? c.cache_[a].queries[b] : void 0;
                },
                cacheKey: function(a, b) {
                    return a.x + "_" + a.y + "_" + b.x + "_" + b.y;
                },
                checkObjectKeys: function(a) {
                    e.validateNumber(a[g.id], g.id), e.validateVec2(a[g.position], g.position), e.validateVec2(a[g.halfSize], g.halfSize), 
                    e.hasNoKey(c.objects_, a[g.id], g.id);
                },
                dirty: function(a) {
                    a && c.dirty_++;
                },
                nextId: function() {
                    return c.ids_++;
                },
                getObjectQuadrants: function(a) {
                    return c.objectQuadrants_[a[g.id]] || (c.objectQuadrants_[a[g.id]] = {}), c.objectQuadrants_[a[g.id]];
                },
                getOrCreateQuadrants: function(a) {
                    for (var b, e = {}, i = h.getQuadrantBegPosition(a[g.position].subtract(a[g.halfSize], !0)), j = h.getQuadrantEndPosition(a[g.position].add(a[g.halfSize], !0)), k = i.x; k < j.x; k += c.quadrantSize_.x) for (var l = i.y; l < j.y; l += c.quadrantSize_.y) b = k + "_" + l, 
                    e[b] = c.quadrants_[b] ? c.quadrants_[b] : c.quadrants_[b] = new f(b, new d(k, l), c.quadrantSize_);
                    return e;
                },
                getQuadrantBegPosition: function(a) {
                    return new d(Math.floor(a.x / c.quadrantSize_.x) * c.quadrantSize_.x, Math.floor(a.y / c.quadrantSize_.y) * c.quadrantSize_.y);
                },
                getQuadrantEndPosition: function(a) {
                    return h.getQuadrantBegPosition(a).add(c.quadrantSize_);
                },
                setSize: function(a) {
                    e.validateVec2(a), c.size_ = new d(a.x, a.y);
                },
                setQuadrantSize: function(a) {
                    e.validateVec2(a), c.quadrantSize_ = new d(a.x, a.y);
                },
                setObjId: function(a) {
                    a[g.id] || (a[g.id] = h.nextId());
                },
                updateObjectQuadrants: function(a) {
                    var b, c, d = !1, e = h.getObjectQuadrants(a), f = h.getOrCreateQuadrants(a);
                    for (c in e) f[c] || (d = !0, b = e[c], delete b.objects_[a[g.id]], delete e[c]);
                    for (c in f) e[c] || (d = !0, b = f[c], b.objects_[a[g.id]] = a, e[c] = b);
                    h.dirty(d);
                }
            }, i = {
                addObject: function(a) {
                    h.setObjId(a), h.checkObjectKeys(a), h.updateObjectQuadrants(a), c.objects_[a[g.id]] = a;
                },
                addObjects: function(a) {
                    for (var b = 0; b < a.length; b++) i.addObject(a[b]);
                },
                updateObject: function(a) {
                    h.updateObjectQuadrants(a);
                },
                updateObjects: function(a) {
                    for (var b = 0; b < a.length; b++) i.updateObject(a[b]);
                },
                getObjectsBetween: function(a, b) {
                    e.validateVec2(a), e.validateVec2(b);
                    var d, f = {}, g = h.getQuadrantBegPosition(a), i = h.getQuadrantEndPosition(b), j = h.cacheKey(g, i), k = h.cached("between", j);
                    if (k) return k;
                    for (var l = g.x; l < i.x; l += c.quadrantSize_.x) for (var m = g.y; m < i.y; m += c.quadrantSize_.y) if (d = c.quadrants_[l + "_" + m]) for (var n in d.objects_) f[n] = d.objects_[n];
                    return h.cache("between", j, f), f;
                },
                debug: function(a, b) {
                    if (void 0 !== a) {
                        c.exposed_ = !!a, c.debugging_ = !!b;
                        for (var d in h) this[d] = c.exposed_ ? h[d] : void 0;
                        this.data_ = c.exposed_ ? c : void 0;
                    }
                    return c.debugging_;
                }
            };
            for (var j in i) this[j] = i[j];
            h.setSize(a), h.setQuadrantSize(b);
        }, b.exports = c;
    }, {
        "./grid2quadrant": 5,
        "my-helper": 2,
        vec2: 3
    } ],
    5: [ function(a, b) {
        var c = function(a, b, c) {
            this.id_ = a, this.posBeg_ = b, this.posEnd_ = b.add(c, !0), this.objects_ = {};
        };
        b.exports = c;
    }, {} ]
}, {}, [ 1 ]);