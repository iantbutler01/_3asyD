var PI = Math.PI;
_3asyD = {
	gl: null,
	programs: [],


	dtor: function(deg) {
		return (deg*Math.PI/180);
	},



	getI4: function() {
		return [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
		]
	},

	rotateY: function(m, angle) {
		var c=Math.cos(angle);
		var s=Math.sin(angle);
		var mv1=m[1], mv5=m[5], mv9=m[9];
		m[1]=m[1]*c-m[2]*s;
		m[5]=m[5]*c-m[6]*s;
		m[9]=m[9]*c-m[10]*s;

		m[2]=m[2]*c+mv1*s;
		m[6]=m[6]*c+mv5*s;
		m[10]=m[10]*c+mv9*s;
	},

	rotateX: function(m, angle) {
		var c=Math.cos(angle);
		var s=Math.sin(angle);
		var mv0=m[0], mv4=m[4], mv8=m[8];
		m[0]=c*m[0]+s*m[2];
		m[4]=c*m[4]+s*m[6];
		m[8]=c*m[8]+s*m[10];

		m[2]=c*m[2]-s*mv0;
		m[6]=c*m[6]-s*mv4;
		m[10]=c*m[10]-s*mv8;
	},

	rotateZ: function(m, angle) {
		var c=Math.cos(angle);
		var s=Math.sin(angle);
		var mv0=m[0], mv4=m[4], mv8=m[8];
		m[0]=c*m[0]-s*m[1];
		m[4]=c*m[4]-s*m[5];
		m[8]=c*m[8]-s*m[9];

		m[1]=c*m[1]+s*mv0;
		m[5]=c*m[5]+s*mv4;
		m[9]=c*m[9]+s*mv8;
	},

	crossProduct: function(v1,v2) {
		try {
			if(v1.length > 3 || v2.length > 3) {
				throw "Vector length greater than 3. Fuck that noise.";
			}
			if( v1.length != v2.length) {
				throw "Vector lengths not equal. Seriously?";
			}
			if(v1.length == 1) {
				throw "This isn't a cross product, this is called basic multiplication use the * operator for that.";
			}

			if(v1.length == 2) {
				return (v1[0]*v2[1]-v2[0]*v1[1])
			}
			if(v1.length == 3) {
				return [(v1[1]*v2[2]-v1[2]*v2[1]),(v1[2]*v2[0]-v1[0]*v2[2]),(v1[0]*v2[1]-v1[1]*v2[0])];
			}
		}
		catch(err) {
			console.error(err);
			return false;
		}
	},

	vectorByScalar: function(vector,scalar) {
		if(vector.length < 2) console.warn("Built in multiplication should be used.");
		for(var i =  0; i < vector.length; ++i) {
			vector[i] *= scalar;
		}
		console.log(vector);
		return vector;
	},


	translateXYZ: function(moveMatrix, x,y,z){
		moveMatrix[12]+=x;

		moveMatrix[13]+=y;

		moveMatrix[14]+=z;
	},

	setGL: function(id) {
		try {
			this.gl = document.getElementById(id).getContext('experimental-webgl');
			this.VMATRIX = this.getI4();

		}
		catch(err) {
			console.error(err);
			return false;
		}
		return true;
	},

	getGL: function() {
		var GL = this.gl;
		if(GL != null) {
			return GL;
		}
		else return false;
	},
	
	hexToGLRGB: function(hexValue) {
		//(hexValue.length);
		var newHexValue = "";
		if(hexValue.length == 4) {
			newHexValue = hexValue.charAt(1)+hexValue.charAt(1)+hexValue.charAt(2)+hexValue.charAt(2)+hexValue.charAt(3)+hexValue.charAt(3);
		}
		else newHexValue = hexValue.charAt(1)+hexValue.charAt(2)+hexValue.charAt(3)+hexValue.charAt(4)+hexValue.charAt(5)+hexValue.charAt(6);
		var r = parseInt(newHexValue.charAt(0)+newHexValue.charAt(1),16);
		var g = parseInt(newHexValue.charAt(2)+newHexValue.charAt(3),16);
		var b = parseInt(newHexValue.charAt(4)+newHexValue.charAt(5),16);
		//(r/255,g/255,b/255);
		return [r/255,g/255,b/255];
	},


	drawStage: function(stage) { //,glOptionsList
		var GL = this.gl;
		var attributes = this.ATTRIBUTES;
		try {
			GL.enable(GL.DEPTH_TEST); //MOVE OPTIONS TO ENABLE/DISABLE system per each draw.
			GL.depthFunc(GL.LEQUAL);
			GL.clearColor(0.0,0.0,0.0,0.0);
			GL.clearDepth(1.0);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.viewport(stage.VIEWPORT[0],stage.VIEWPORT[1],stage.VIEWPORT[2],stage.VIEWPORT[3]);
			for(var i =  0; i < stage.MESHES.length; ++i) {
				var mesh =  stage.MESHES[i];
				var objectList = stage.MESHES[i].OBJECTS;
				var attributes = stage.MESHES[i].ATTRIBUTES;
				GL.useProgram(mesh.SHADER.SHADER_PROGRAM);
				for(var j = 0; j < objectList.length; ++j)
				{
					GL.uniformMatrix4fv(mesh.UNIFORMS["pMatrix"],false,stage.CAMERA);
					GL.uniformMatrix4fv(mesh.UNIFORMS["vMatrix"],false,stage.VMATRIX);
					GL.uniformMatrix4fv(mesh.UNIFORMS["mMatrix"],false,objectList[i].MMATRIX);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].VERTEX_BUFFER);
					GL.vertexAttribPointer(mesh.ATTRIBUTES["position"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].COLOR_BUFFER);
					GL.vertexAttribPointer(mesh.ATTRIBUTES["color"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].NORMAL_BUFFER);
					GL.vertexAttribPointer(mesh.ATTRIBUTES["normal"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,objectList[j].FACE_BUFFER);
					console.log(objectList[j].INDICIES);
					GL.drawElements(objectList[j].DRAWTYPE,objectList[j].INDICIES,GL.UNSIGNED_SHORT,0);
				}
			}
			GL.flush();
		}
		catch(err) {
			console.error(err);
			return false;
		}
	},

	Sphere: function Sphere(radiusX,radiusY,radiusZ,smoothX,smoothY) {
		// x = psinPHIcosTHETA, y = psinPHIsinTHETA z=pcosPHI
		// p is a quick reference to the greek symbol rho,
		// often used in the spherical coordinate system to denote 3 dimensional radii.
		var pX = radiusX;
		var pY = radiusY;
		var pZ = radiusZ;
		var sX = smoothX;
		var sY = smoothY;
		this.CHILDREN = [];
		this.VERTICIES = [];
		this.NORMALS = [];
		this.COLOR = [];
		this.MATERIAL = "FLAT";
		this.MMATRIX = _3asyD.getI4();
		this.INDICIES = smoothX*smoothY*6;
		this.DRAWTYPE = _3asyD.gl.TRIANGLES;
		for(var i =  0; i <= PI; i+=(PI/sY)) {
			for(j = 0; j <= 2*PI; j+=((2*PI)/sX)) {
				var x = Math.sin(i)*Math.cos(j);
				var y = Math.sin(i)*Math.sin(j);
				var z = Math.cos(i);
				this.NORMALS.push(x,y,z);
				this.VERTICIES.push(pX*x,pY*y,pZ*z);
			}
		}
		this.FACES = [];
		for(var i =  0; i < smoothY; ++i) {
			for(j = 0; j < smoothX; ++j) {
				var one = (i*(smoothX+1))+j;
				var two = one+smoothX+1;
				this.FACES.push(one,two,one+1);
				this.FACES.push(two,two+1,one+1);
			}
		}
	
	},

	Cone: function Cone() {

	}


};



_3asyD.Shader = function(typeString) {
	var material = null;
	if(typeString == "FLAT") {
		material = new this.flat();
		this.UNIFORMS = material.UNIFORMS;
		this.ATTRIBUTES = material.ATTRIBUTES;
	}
	if(typeString == "PHONG") {
		material = new this.phong();
		this.UNIFORMS = material.UNIFORMS;
		this.ATTRIBUTES = material.ATTRIBUTES;
	}
	var GL = _3asyD.gl;
	var SHADER_PROGRAM=null;
	var vertexShade = GL.createShader(GL.VERTEX_SHADER);
	var fragShade = GL.createShader(GL.FRAGMENT_SHADER);
	GL.shaderSource(vertexShade,material.vertex.sourceCode());
	GL.compileShader(vertexShade);
	if(!GL.getShaderParameter(vertexShade,GL.COMPILE_STATUS)) {
		console.error("Vertex Shader Failed to Compile.\n"+GL.getShaderInfoLog(vertexShade)+"\n");
		return false;
	}

	GL.shaderSource(fragShade,material.fragment.sourceCode());
	GL.compileShader(fragShade);
	if(!GL.getShaderParameter(fragShade,GL.COMPILE_STATUS)) {
		console.error("Fragment Shader Failed to Compile.\n"+GL.getShaderInfoLog(fragShade)+"\n");
		return false;
	}
	this.SHADER_PROGRAM = GL.createProgram();
	GL.attachShader(this.SHADER_PROGRAM,vertexShade);
	GL.attachShader(this.SHADER_PROGRAM,fragShade);
	GL.linkProgram(this.SHADER_PROGRAM);
	this.type = typeString+"_SHADER";
}
_3asyD.Shader.prototype = _3asyD;
_3asyD.Shader.prototype.constructor = _3asyD.Shader;
_3asyD.Shader.prototype.flat = function() {
	this.UNIFORMS = ["pMatrix","vMatrix","mMatrix","SOURCE_AMBIENT","SOURCE_DIFFUSE","SOURCE_DIRECTION","MATERIAL_AMBIENT","MATERIAL_DIFFUSE"]
	this.ATTRIBUTES =["color","position","normal"]
	this.vertex = {
		"attributePosition": "attribute vec3 position;\n",
		"attributeColor": "attribute vec3 color;\n",
		"attributeNormal": "attribute vec3 normal;\n",
		"uniformPMatrix": "uniform mat4 pMatrix;\n",
		"uniformVMatrix": "uniform mat4 vMatrix;\n",
		"uniformMMatrix": "uniform mat4 mMatrix;\n",
		"varyingColor": "varying vec3 vColor;\n",
		"varyingNormal": "varying vec3 vNormal;\n",
		"main": "void main(void) { \n\
			vColor = color; \n\
			vNormal = vec3(mMatrix*vec4(normal,0)); \n\
			gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0); \n\
		}",
		"sourceCode": function() {
			return this["attributePosition"]+this["attributeColor"]+this["attributeNormal"]+this["uniformPMatrix"]+this["uniformVMatrix"]+this["uniformMMatrix"]+this["varyingColor"]+this["varyingNormal"]+this["main"];
		}
	},

	this.fragment = {
		"precision": "precision mediump float;\n",
		"varyingColor": "varying vec3 vColor;\n",
		"varyingNormal": "varying vec3 vNormal;\n",
		"uniformSourceAmbient": "uniform vec3 SOURCE_AMBIENT;\n",
		"uniformSourceDiffuse": "uniform vec3 SOURCE_DIFFUSE;\n",
		"uniformSourceDirection": "uniform vec3 SOURCE_DIRECTION;\n",
		"uniformMaterialAmbient": "uniform vec3 MATERIAL_AMBIENT;\n",
		"uniformMaterialDiffuse": "uniform vec3 MATERIAL_DIFFUSE;\n",
		"main": "void main(void) { \n\
			vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT; \n\
			vec3 L = normalize(SOURCE_DIRECTION); \n\
			vec3 I_diffuse = max(0,dot(vNoraml,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0; \n\
			vec3 I = I_ambient+I_diffuse; \n\
			gl_FragColor = vec4(I*vColor,1.0); \n\
		}",
		"sourceCode": function() {
			var frag = this; //change to be cleaner later
			return frag.precision+frag.varyingColor+frag.varyingNormal+
			frag.uniformSourceAmbient+frag.uniformSourceDiffuse+
			frag.uniformSourceDirection+frag.uniformMaterialDiffuse+
			frag.uniformMaterialAmbient+frag.main;
		}
	}
};


_3asyD.Shader.prototype.phong = function() {
	this.UNIFORMS = ["pMatrix","vMatrix","mMatrix","SOURCE_AMBIENT","SOURCE_DIFFUSE","SOURCE_DIRECTION","SOURCE_SPECULAR","MATERIAL_AMBIENT","MATERIAL_DIFFUSE","MATERIAL_SPECULAR","GLOSS"]
	this.ATTRIBUTES =["color","position","normal"]
	this.vertex = {
		"attributePosition": "attribute vec3 position;\n",
		"attributeColor": "attribute vec3 color;\n",
		"attributeNormal": "attribute vec3 normal;\n",
		"uniformPMatrix": "uniform mat4 pMatrix;\n",
		"uniformVMatrix": "uniform mat4 vMatrix;\n",
		"uniformMMatrix": "uniform mat4 mMatrix;\n",
		"varyingColor": "varying vec3 vColor;\n",
		"varyingNormal": "varying vec3 vNormal;\n",
		"varyingView": "varying vec3 vView;\n",
		"main": "void main(void) { \n\
			vNormal = vec3(mMatrix*vec4(normal,0)); \n\
			gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0); \n\
			vView = vec3(vMatrix*mMatrix*vec4(position,1.0)); \n\
			vColor = color; \n\
		}",
		"sourceCode": function() {
			return this.attributePosition+this.attributeColor
			+this.attributeNormal+this.uniformPMatrix+this.uniformVMatrix
			+this.uniformMMatrix+this.varyingColor+this.varyingNormal+
			this.varyingView+this.main;
		}
	},
	this.fragment = {
		"precision": "precision mediump float;\n",
		"varyingColor": "varying vec3 vColor;\n",
		"varyingNormal": "varying vec3 vNormal;\n",
		"varyingView": "varying vec3 vView;\n",
		"uniformSourceAmbient": "uniform vec3 SOURCE_AMBIENT;\n",
		"uniformSourceDiffuse": "uniform vec3 SOURCE_DIFFUSE;\n",
		"uniformSourceSpecular": "uniform vec3 SOURCE_SPECULAR;\n",
		"uniformSourceDirection": "uniform vec3 SOURCE_DIRECTION;\n",
		"uniformMaterialAmbient": "uniform vec3 MATERIAL_AMBIENT;\n",
		"uniformMaterialDiffuse": "uniform vec3 MATERIAL_DIFFUSE;\n",
		"uniformMaterialSpecular": "uniform vec3 MATERIAL_SPECULAR;\n",
		"uniformGloss": "uniform float GLOSS;\n",
		"main": "void main(void) { \n\
			vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT; \n\
			vec3 V = normalize(vView); \n\
			vec3 L = normalize(SOURCE_DIRECTION); \n\
			vec3 I_diffuse = max(0.0,dot(vNormal,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0; \n\
			vec3 R = reflect(SOURCE_DIRECTION,vNormal); \n\
			vec3 I_specular = SOURCE_SPECULAR*MATERIAL_SPECULAR*pow(max(dot(R,V),0.),GLOSS); \n\
			vec3 I = I_ambient+I_diffuse+I_specular; \n\
			gl_FragColor = vec4(I*vColor,1.); \n\
		}",
		"sourceCode": function() {
			var frag = this;
			return frag.precision+frag.varyingColor+frag.varyingNormal+
			frag.varyingView+frag.uniformSourceAmbient+frag.uniformSourceDiffuse+frag.uniformSourceSpecular+frag.uniformSourceDirection
			+frag.uniformMaterialAmbient+frag.uniformMaterialDiffuse+frag.uniformMaterialSpecular+frag.uniformGloss
			+frag.main;
		}
	}
};
	
_3asyD.Shape =  function () {
		this.CHILDREN = [];
		this.INDICIES = null;
		this.VERTICIES = [];
		this.NORMALS = [];
		this.FACE_UV = [];
		this.FACES = [];
		this.COLOR = [];
		this.DRAWTYPE = this.gl.TRIANGLES;
		this.MMATRIX = this.getI4();
		this.bufferSetUp();
	};
_3asyD.Shape.prototype = _3asyD;
_3asyD.Shape.prototype.constructor = _3asyD.Shape
_3asyD.Shape.prototype.setDrawType = function(typeString) { //FIX
	try {
		var GL = this.gl;
		this.DRAWTYPE = GL[typeString];
	}
	catch(err) {
		console.error(err);
		return false;
	}
};
_3asyD.Shape.prototype.bufferSetUp = function() {
		var GL = this.gl;
		this.VERTEX_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.VERTEX_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(this.VERTICIES),GL.STATIC_DRAW);
		this.FACE_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,this.FACE_BUFFER);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.FACES),GL.STATIC_DRAW);
		this.NORMAL_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.NORMAL_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.NORMALS),GL.STATIC_DRAW);
		this.COLOR_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.COLOR_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.COLOR),GL.STATIC_DRAW);
	};

_3asyD.Stage = function(name, viewport, meshes) {
	this.VMATRIX = _3asyD.getI4();
	this.MESHES = [];
	if(typeof meshes !== undefined) {
		this.MESHES = meshes;

	}
	this.NAME = name;
	this.VIEWPORT = viewport;
}
_3asyD.Stage.prototype = _3asyD;
_3asyD.Stage.prototype.constructor = _3asyD.Stage;
_3asyD.Stage.prototype.add = function(mesh) {
	//(typeof this.MESHES);
	if((typeof this.MESHES) == 'undefined') { this.MESHES = [mesh]; 
	}
	else { this.MESHES.push(mesh); }
}
_3asyD.Stage.prototype.setPerspectiveCamera = function(angle, a, zMax, zMin) {
		var tan = Math.tan(_3asyD.dtor(0.5*angle));
		var A = -(zMax+zMin)/(zMax-zMin);
		var B = (-2*zMax*zMin)/(zMax-zMin)
		this.CAMERA = [
		(0.5/tan),0,0,0,
		0,(0.5*a/tan),0,0,
		0,0,A,B,
		0,0,-1,0
		]
};


_3asyD.Mesh = function(name, shaderType, objects) {
	if(typeof objects != 'undefined') {
		this.OBJECTS = objects;

	}
	else {
		this.OBJECTS = [];
	}
	
	if(typeof shaderType != 'undefined') {
		this.SHADER = new _3asyD.Shader(shaderType);
		this.loadShaderVariables();
		this.SHADER_TYPE = this.SHADER.type;
	}
	this.UNIFORMS = [];
	this.ATTRIBUTES = [];
	this.NAME = name;
};
_3asyD.Mesh.prototype = _3asyD;
_3asyD.Mesh.prototype.constructor = _3asyD.Mesh;
_3asyD.Mesh.prototype.addShape = function(object) {
	if(typeof this.OBJECTS == 'undefined') { this.OBJECTS = [object]; 
	}
	else { this.OBJECTS.push(object) };
};
_3asyD.Mesh.prototype.setShader = function(shader) {
	try {
		this.SHADER = shader;
		this.loadShaderVariables();
		this.SHADER_TYPE = this.SHADER.type;
	}
	catch(err) {
		console.error(err);
	}
};
_3asyD.Mesh.prototype.setLight = function(typeStringList,colorList,gloss,directionVector) {
	try {
		var GL = this.gl;
		var shader = this.SHADER.SHADER_PROGRAM;
		GL.useProgram(shader);
		for(var i = 0; i < typeStringList.length; ++i) {
			if(colorList.length == 1) {
				GL.uniform3fv(GL.getUniformLocation(shader,typeStringList[i]),new Float32Array(this.hexToGLRGB(colorList[0])));
			}
			else GL.uniform3fv(GL.getUniformLocation(shader,typeStringList[i]),new Float32Array(this.hexToGLRGB(colorList[i])));
		}		
		if(typeof gloss !== undefined) GL.uniform1f(GL.getUniformLocation(shader,"GLOSS"),gloss);
		if(typeof directionVector !== undefined) GL.uniform3fv(GL.getUniformLocation(shader,"SOURCE_DIRECTION"),new Float32Array(this.vectorByScalar(directionVector,-1)));
		GL.useProgram(null);
	}
	catch(err)
	{
		console.error(err);
	}
};

_3asyD.Mesh.prototype.loadShaderVariables = function() {
		var GL = this.gl;
		var currentProgram = this.SHADER.SHADER_PROGRAM;
		var uniformNamesArray = this.SHADER.UNIFORMS;
		var attributeNameArray = this.SHADER.ATTRIBUTES;
		var uniforms = {};
		var attributes = {};

		for(var i =  0; i < uniformNamesArray.length; ++i) {
			uniforms[uniformNamesArray[i]] = (GL.getUniformLocation(currentProgram,uniformNamesArray[i]));
		}
		this.UNIFORMS = uniforms;

		for(var i =  0; i < attributeNameArray.length; ++i) {
			//(attributeNameArray[i]);
			attributes[attributeNameArray[i]] = GL.getAttribLocation(currentProgram,attributeNameArray[i]);
			//(attributes[attributeNameArray[i]]);
			GL.enableVertexAttribArray(attributes[attributeNameArray[i]]);
		}
		this.ATTRIBUTES = attributes;
	};


	_3asyD.Cube = function Cube(length,width,height,colorScheme,color_s) {
		_3asyD.Shape.call(this);
		var l = length/2;
		var w = width/2;
		var h = height/2;
		this.CHILDREN = [];
		this.INDICIES = 24;
		this.LENGTH = length;
		this.WIDTH = width;
		this.HEIGHT = height;
		this.DRAWTYPE = _3asyD.gl.TRIANGLES;
		this.VERTICIES = [  
			-1*l,-1*w,-1*h,   
			1*l,-1*w,-1*h,     
			1*l, 1*w,-1*h,     
			-1*l, 1*w,-1*h,     

			-1*l,-1*w, 1*h,    
			1*l,-1*w, 1*h,    
			1*l, 1*w, 1*h,     
			-1*l, 1*w, 1*h,     

			-1*l,-1*w,-1*h,     
			-1*l, 1*w,-1*h,     
			-1*l, 1*w, 1*h,    
			-1*l,-1*w, 1*h,    

			1*l,-1*w,-1*h,     
			1*l, 1*w,-1*h,     
			1*l, 1*w, 1*h,     
			1*l,-1*w, 1*h,     

			-1*l,-1*w,-1*h,     
			-1*l,-1*w, 1*h,     
			1*l,-1*w, 1*h,    
			1*l,-1*w,-1*h,     

			-1*l, 1*w,-1*h,   
			-1*l, 1*w, 1*h,    
			1*l, 1*w, 1*h,    
			1*l, 1*w,-1*h,    
	    ];

		this.FACES = [    
			0,1,2,
			0,2,3,

			4,5,6,
			4,6,7,

			8,9,10,
			8,10,11,

			12,13,14,
			12,14,15,

			16,17,18,
			16,18,19,

			20,21,22,
			20,22,23
	    ];
		
		this.NORMALS = [
		//BOTTOM
		0,0,-1,
		0,0,-1,
		0,0,-1,
		0,0,-1,
		//TOP
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1,
		//BACK
		-1,0,0,
		-1,0,0,
		-1,0,0,
		-1,0,0,
		//FRONT
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
		//LEFT
		0,-1,0,
		0,-1,0,
		0,-1,0,
		0,-1,0,
		//RIGHT		
		0,1,0,
		0,1,0,
		0,1,0,
		0,1,0
		];

		this.COLOR = [ 
			1,1,0,
			1,1,0,
			1,1,0,
			1,1,0,

			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1,

			0,1,1,
			0,1,1,
			0,1,1,
			0,1,1,

			1,0,0,
			1,0,0,
			1,0,0,
			1,0,0,

			1,0,1,
			1,0,1,
			1,0,1,
			1,0,1,

			0,1,0,
			0,1,0,
			0,1,0,
			0,1,0
        ];
	};

	_3asyD.Cube.prototype = Object.create(_3asyD.Shape.prototype);
	_3asyD.Cube.prototype.constructor = _3asyD.Cube;




