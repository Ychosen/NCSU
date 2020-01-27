/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0;
const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0;
const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog2/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://ncsucgclass.github.io/prog2/spheres.json"; // spheres file loc
var Eye = new vec4.fromValues(0.5, 0.5, -0.5, 1.0); // default eye position in world space

/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var vertexBuffer; // this contains vertex coordinates in triples
var triangleBuffer; // this contains indices into vertexBuffer in triples
var colorBuffer;
var triBufferSize = 0; // the number of indices in the triangle buffer
var vertexPositionAttrib; // where to put position for vertex shader
var colorAttrib;


// ASSIGNMENT HELPER FUNCTIONS

// get the JSON file from the passed URL
function getJSONFile(url, descr) {
    try {
        if ((typeof (url) !== "string") || (typeof (descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET", url, false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now() - startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open " + descr + " file!";
            else
                return JSON.parse(httpReq.response);
        } // end if good params
    } // end try    

    catch (e) {
        console.log(e);
        return (String.null);
    }
} // end get input spheres

// set up the webGL environment
function setupWebGL() {

    // Get the canvas and context
    var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it

    try {
        if (gl == null) {
            throw "unable to create gl context -- is your browser gl ready?";
        } else {
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
            gl.clearDepth(1.0); // use max when we clear the depth buffer
            gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
        }
    } // end try

    catch (e) {
        console.log(e);
    } // end catch

} // end setupWebGL

// read triangles in, load them into webgl buffers
function loadTriangles() {
    var inputTriangles = getJSONFile(INPUT_TRIANGLES_URL, "triangles");
    // +Bhargav Deshpande
    // +Saurabh Joshi
    // var inputTriangles = [
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.5,0.2,0.9], "specular": [0.3,0.3,0.3], "n":11},
    //         "vertices": [[0.15, 0.6, 0.75],[0.35, 0.8, 0.75],[0.15,0.35,0.75], [-0.40,0.3,0.75]],
    //         "triangles": [[2,1,3]]
    //     },
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.2,0.8,0.1], "specular": [0.3,0.3,0.3], "n":17},
    //         "vertices": [[0.15, 0.15, 0.75],[0.15, 0.35, 0.75],[0.35,0.35,0.75],[0.15,-0.15,0.75],[0.35,-0.25,0.75]],
    //         "triangles": [[0,1,2],[2,3,4]]
    //     },
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.9,0.8,0.7], "specular": [0.3,0.3,0.3], "n":17},
    //         "vertices": [[0.15, -0.25, 0.75],[0.15, -0.55, 0.75],[0.35,-0.65,0.75],[0.35,-0.25,0.75]],
    //         "triangles": [[1,2,3]]
    //     },
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.8,0.4,0.4], "specular": [0.3,0.3,0.3], "n":17},
    //         "vertices": [[-0.40, 0.3, 0.75],[0.15, -0.15, 0.75],[0.15,0.15,0.75]],
    //         "triangles": [[0,1,2]]
    //     }
    // ];
    // var inputTriangles = [
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.4,0.4], "specular": [0.3,0.3,0.3], "n":11},
    //         "vertices": [[0.15, 0.6, 0.75],[0.25, 0.9, 0.75],[0.35,0.6,0.75], [-0.40,0.3,0.75]],
    //         "triangles": [[1,2,3]]
    //     },
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.6,0.4], "specular": [0.3,0.3,0.3], "n":17},
    //         "vertices": [[0.15, 0.15, 0.75],[0.15, 0.35, 0.75],[0.35,0.35,0.75],[0.35,0.15,0.75]],
    //         "triangles": [[0,1,2],[2,3,0]]
    //     },
    //     {
    //         "material": {"ambient": [0.1,0.1,0.1], "diffuse": [1.0,1.0,0.0], "specular": [0.3,0.3,0.3], "n":17},
    //         "vertices": [[0.15, -0.15, 0.75],[0.15, -0.75, 0.75],[0.35,-0.65,0.75],[0.35,-0.25,0.75]],
    //         "triangles": [[0,1,2],[2,3,0]]
    //     }
    // ];
    if (inputTriangles != String.null) {
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set
        var coordArray = []; // 1D array of vertex coords for WebGL
        var indexArray = [];
        var colorArray = [];
        var vtxBufferSize = 0;
        var vtxToAdd = [];
        var indexOffset = vec3.create();
        var triToAdd = vec3.create();
        var colorToAdd = vec3.create();

        for (var whichSet = 0; whichSet < inputTriangles.length; whichSet++) {

            vec3.set(indexOffset, vtxBufferSize, vtxBufferSize, vtxBufferSize); // update vertex offset

            // set up the vertex coord array
            for (whichSetVert = 0; whichSetVert < inputTriangles[whichSet].vertices.length; whichSetVert++) {
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0], vtxToAdd[1], vtxToAdd[2]);
                // console.log(inputTriangles[whichSet].vertices[whichSetVert]);
                colorToAdd = inputTriangles[whichSet].material.diffuse;
                console.log(colorToAdd);
                colorArray.push(colorToAdd[0], colorToAdd[1], colorToAdd[2]);
            }

            for (whichSetTri = 0; whichSetTri < inputTriangles[whichSet].triangles.length; whichSetTri++) {
                vec3.add(triToAdd, indexOffset, inputTriangles[whichSet].triangles[whichSetTri]);
                indexArray.push(triToAdd[0], triToAdd[1], triToAdd[2]);

            }

            vtxBufferSize += inputTriangles[whichSet].vertices.length;
            triBufferSize += inputTriangles[whichSet].triangles.length;

        } // end for each triangle set

        triBufferSize *= 3;

        vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordArray), gl.STATIC_DRAW); // coords to that buffer

        triangleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

        colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
    } // end if triangles found
} // end load triangles

// setup the webGL shaders
function setupShaders() {

    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        varying highp vec4 fColor;
        void main(void) {
            gl_FragColor = fColor; 
        }
    `;

    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 vertexPosition;
        attribute vec3 vertexColor;
        varying highp vec4 fColor;
        
        void main(void) {
            gl_Position = vec4(vertexPosition, 1.0); // use the untransformed position
            fColor = vec4(vertexColor, 1.0);    
        }
    `;

    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader, fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader, vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
            gl.deleteShader(vShader);
        } else { // no compile errors
            var shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                vertexPositionAttrib = // get pointer to vertex shader input
                    gl.getAttribLocation(shaderProgram, "vertexPosition");
                colorAttrib =
                    gl.getAttribLocation(shaderProgram, "vertexColor");
                gl.enableVertexAttribArray(vertexPositionAttrib); // input to shader from array
                gl.enableVertexAttribArray(colorAttrib);
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try 

    catch (e) {
        console.log(e);
    } // end catch
} // end setup shaders

// render the loaded model
function renderTriangles() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers

    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, 3, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 0, 0);

    // gl.drawArrays(gl.TRIANGLES,0,3); // render
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.drawElements(gl.TRIANGLES, triBufferSize, gl.UNSIGNED_SHORT, 0);

} // end render triangles


/* MAIN -- HERE is where execution begins after window load */

function main() {

    setupWebGL(); // set up the webGL environment
    loadTriangles(); // load in the triangles from tri file
    setupShaders(); // setup the webGL shaders
    renderTriangles(); // draw the triangles using webGL

} // end main
