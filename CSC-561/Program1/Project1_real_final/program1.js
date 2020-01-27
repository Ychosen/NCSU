var MODE = "rec";
// var MODE = "sphere";

// Vector constructor
class Vector {
    constructor(x, y, z) {
        this.set(x, y, z);
    } // end constructor

    // sets the components of a vector
    set(x, y, z) {
        try {
            if ((typeof (x) !== "number") || (typeof (y) !== "number") || (typeof (z) !== "number"))
                throw "vector component not a number";
            else
                this.x = x;
            this.y = y;
            this.z = z;
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end vector set

    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.copy: non-vector parameter";
            else
                this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        } // end try

        catch (e) {
            console.log(e);
        }
    }

    toConsole(prefix = "") {
        console.log(prefix + "[" + this.x + "," + this.y + "," + this.z + "]");
    } // end to console

    // static dot method
    static dot(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.dot: non-vector parameter";
            else
                return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
        } // end try

        catch (e) {
            console.log(e);
            return (NaN);
        }
    } // end dot static method

    // static cross method
    static cross(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else {
                var crossX = v1.y * v2.z - v1.z * v2.y;
                var crossY = v1.z * v2.x - v1.x * v2.z;
                var crossZ = v1.x * v2.y - v1.y * v2.x;
                return (new Vector(crossX, crossY, crossZ));
            } // endif vector params
        } // end try

        catch (e) {
            console.log(e);
            return (NaN);
        }
    } // end dot static method

    // static add method
    static add(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.add: non-vector parameter";
            else
                return (new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z));
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.subtract: non-vector parameter";
            else {
                var v = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
                return (v);
            }
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end subtract static method

    // static scale method
    static scale(c, v) {
        try {
            if (!(typeof (c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return (new Vector(c * v.x, c * v.y, c * v.z));
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end scale static method

    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.normalize: parameter not a vector";
            else {
                var lenDenom = 1 / Math.sqrt(Vector.dot(v, v));
                return (Vector.scale(lenDenom, v));
            }
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end scale static method

    static toList(v) {
        return [v.x, v.y, v.z];
    }

    static power(v, n) {
        var res = v;
        for (var i = 0; i < n - 1; i++) {
            res = Vector.dot(res, v);
        }
        return res;
    }
} // end Vector class


// Color constructor
class Color {
    constructor(r, g, b, a) {
        try {
            if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
                throw "color component not a number";
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw "color component less than 0";
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw "color component bigger than 255";
            else {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end Color constructor

    // Color change method
    change(r, g, b, a) {
        try {
            if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
                throw "color component not a number";
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw "color component less than 0";
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw "color component bigger than 255";
            else {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        } // end throw

        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


function intersect(point1, point2, obj) {
    var D = Vector.subtract(point2, point1);

    // Y axis
    // top Y
    var t_by = (obj.by - point1.y) / D.y;
    // bot Y
    var t_ty = (obj.ty - point1.y) / D.y;

    var t_y0 = Math.min(t_by, t_ty);
    var t_y1 = Math.max(t_by, t_ty);

    // X axis
    // left X
    var t_lx = (obj.lx - point1.x) / D.x;
    // right X
    var t_rx = (obj.rx - point1.x) / D.x;

    var t_x0 = Math.min(t_lx, t_rx);
    var t_x1 = Math.max(t_lx, t_rx);

    // Z axis
    // front Z
    var t_fz = (obj.fz - point1.z) / D.z;
    // back X
    var t_rz = (obj.rz - point1.z) / D.z;

    var t_z0 = Math.min(t_fz, t_rz);
    var t_z1 = Math.max(t_fz, t_rz);


    // first isect with special case check
    var t0 = Number.MIN_VALUE;
    var t1 = Number.MAX_VALUE;
    if (D.x !== 0) {
        t0 = Math.max(t_x0, t0);
    }
    t1 = Math.min(t_x1, t1);
    if (D.y !== 0) {
        t0 = Math.max(t_y0, t0);
    }
    t1 = Math.min(t_y1, t1);
    if (D.z !== 0) {
        t0 = Math.max(t_z0, t0);
    }
    t1 = Math.min(t_z1, t1);

    if (t0 <= t1) {
        var N = [];
        switch(t0) {
            case t_lx:
                N = new Vector(-1, 0, 0);
                break;
            case t_rx:
                N = new Vector(1, 0, 0);
                break;
            case t_by:
                N = new Vector(0, -1, 0);
                break;
            case t_ty:
                N = new Vector(0, 1, 0);
                break;
            case t_fz:
                N = new Vector(0, 0, -1);
                break;
            case t_rz:
                N = new Vector(0, 0, 1);
                break;
        }
        return [t0, N];
    } else {
        return false;
    }
}


function sphereIntersect(point1, point2, obj) {
    var center = new Vector(obj.x, obj.y, obj.z);
    var oc = Vector.subtract(point1, center);

    var ray = Vector.subtract(point2, point1);
    var a = Vector.dot(ray, ray);
    var b = 2 * Vector.dot(ray, oc);
    var c = Vector.dot(oc, oc) - obj.r * obj.r;

    var delta = b * b - 4 * a * c;

    if (delta < 0) {
        return false;
    }

    var t = (-b - Math.sqrt(delta)) / (2.0 * a);

    if (t < 0) {
        return false;
    }

    var hitPoint = Vector.add(point1, Vector.scale(t, Vector.subtract(point2, point1)));

    var N = Vector.normalize(Vector.subtract(hitPoint, center));

    return [t, N];

}


// Ka*La + Kd*Ld*(N•L) + Ks*Ls*(N•H)n = color
function computeColor(eye, obj, global, N, hitPoint, inputBoxes) {

    var ka = obj.ambient;
    var kd = obj.diffuse;
    var ks = obj.specular;

    var la = Vector.toList(global.lightColor);
    var ld = la;
    var ls = la;

    var L = Vector.subtract(global.lightPos, hitPoint);
    L = Vector.normalize(L);

    var V = Vector.subtract(eye, hitPoint);
    var H = Vector.normalize(Vector.add(L, V));

    var color = new Color(0, 0, 0, 255);

    for (var i = 0; i < 3; i++) {
        var S = shade(hitPoint, global.lightPos, inputBoxes, obj);
        // var S = 1;
        var part3 = Math.max(0, ks[i]*ls[i] * Math.pow(Vector.dot(N, H), obj.n));
        var pcolor = ka[i] * la[i] + S * (Math.max(0, kd[i] * ld[i] * Vector.dot(N, L)) + part3);

        switch (i) {
            case 0:
                color.r = pcolor * 255;
                break;
            case 1:
                color.g = pcolor * 255;
                break;
            case 2:
                color.b = pcolor * 255;
                break;
        }
    }

    return color;
}


// function computeR(N, global, hitPoint) {
//     var AO = Vector.subtract(hitPoint, global.lightPos);
//
//     var temp = Vector.dot(AO, N);
//
//     // var R = Vector.subtract(AO, Vector.dot(Vector.scale(2, temp), N));
//     var R = Vector.subtract(AO, Vector.scale(2*temp, N));
//
//     return R;
// }


// function computeH(N, eye, hitPoint) {
//
//     var AO = Vector.subtract(hitPoint, eye);
//
//     var temp = Vector.dot(AO, N);
//
//     var H = Vector.subtract(AO, Vector.scale(2*temp, N));
//
//     return H;
// }


function shade(hitPoint, lightPos, inputBoxes, selfObj) {
    for (let i = 0; i < inputBoxes.length; i++) {
        var obj = inputBoxes[i];
        if (obj == selfObj) {
            continue;
        }
        if (MODE == "rec") {
            var temp = intersect(hitPoint, lightPos, obj);

        } else if (MODE == "sphere") {
            var temp = sphereIntersect(hitPoint, lightPos, obj);
        }
        if (temp !== false && temp[0] < 1 && temp[0] > 0) {
            return false;
        }
    }

    return true;
}


function getInputBoxes(MODE) {
    if (MODE == "rec") {

        var INPUT_BOXES_URL =
            "https://ncsucgclass.github.io/prog1/boxes.json";
    } else if (MODE == "sphere") {
        var INPUT_BOXES_URL =
            "https://ncsucgclass.github.io/prog1/spheres.json";
    }

    // load the boxes file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET", INPUT_BOXES_URL, false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now() - startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log * ("Unable to open input boxes file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response);
} // end get input boxes


// draw a pixel at x,y using color
function drawPixel(imagedata, x, y, color) {
    try {
        if ((typeof (x) !== "number") || (typeof (y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x < 0) || (y < 0) || (x >= imagedata.width) || (y >= imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y * imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex + 1] = color.g;
            imagedata.data[pixelindex + 2] = color.b;
            imagedata.data[pixelindex + 3] = color.a;
        } else
            throw "drawpixel color is not a Color";
    } // end try

    catch (e) {
        console.log(e);
    }
} // end drawPixel


function draw(context) {

    // let inputBoxes = getInputBoxes(MODE);
    // one more test case with shadow
    let inputBoxes = [
        {"lx": 0.11, "rx": 0.17, "by": 0.14, "ty": 0.21, "fz":0.09, "rz":0.45, "ambient": [0.1,0.1,0.1], "diffuse": [0.0,0.0,0.6], "specular": [0.3,0.3,0.3], "n":5},
        {"lx": 0.35, "rx": 0.54, "by": 0.13, "ty": 0.24, "fz":0.05, "rz":1.55, "ambient": [0.1,0.1,0.1], "diffuse": [0.0,0.6,0.0], "specular": [0.3,0.3,0.3], "n":7},
        {"lx": 0.09, "rx": 0.74, "by": 0.27, "ty": 0.77, "fz":0.05, "rz":0.35, "ambient": [0.1,0.1,0.1], "diffuse": [1.0,0.0,0.0], "specular": [0.3,0.3,0.3], "n":7}
    ];
    let w = context.canvas.width;
    let h = context.canvas.height;
    let imagedata = context.createImageData(w, h);

    const PIXEL_DENSITY = 1;
    let numCanvasPixels = (w * h) * PIXEL_DENSITY;
    const black = new Color(0, 0, 0, 255);


    var eye = new Vector(0.5, 0.5, -0.5);
    var viewUp = new Vector(0, 1, 0);
    var lookAt = new Vector(0, 0, 1);
    var view = {eye: eye, at: lookAt, up: viewUp};
    var globals = {
        lightPos: new Vector(-0.5, 1.5, -0.5),
        lightColor: new Vector(1, 1, 1)
    };

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            var pixel = new Vector(x / w, y / h, 0);


            var frontObj = null;
            var frontT = Number.MIN_VALUE;
            var N;

            for (var i = 0; i < inputBoxes.length; i++) {
                var obj = inputBoxes[i];
                var temp;
                if (MODE == "rec") {
                    temp = intersect(eye, pixel, obj);
                } else if (MODE == "sphere") {
                    temp = sphereIntersect(eye, pixel, obj);
                }
                var t = temp[0];
                if (t !== false && t >= 1 && (t < frontT || frontObj == null)) {
                    frontT = t;
                    frontObj = obj;
                    N = temp[1];
                }
            }

            if (frontObj != null) {
                var hitPoint = Vector.add(eye, Vector.scale(frontT, Vector.subtract(pixel, eye)));
                var color = computeColor(eye, frontObj, globals, N, hitPoint , inputBoxes);
                // var color = new Color(frontObj.diffuse[0] * 255, frontObj.diffuse[1] * 255, frontObj.diffuse[2] * 255, 255);
                drawPixel(imagedata, x, h-y-1, color);
            } else {
                drawPixel(imagedata, x, h-y-1, black);

            }
        }
    }

    context.putImageData(imagedata, 0, 0);
}


function main() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");


    draw(context);
}
