var PI = Math.PI;
_3asyD = {
	gl: null,
	programs: [],
	canvas: null,


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

	compareApproximate: function(matrix,value,controlType,operatorType,tolerance,indicies) {
		var booleanReturnValue = null;
		var indicieLength = null;
		if (typeof indicies == 'undefined') {
			if(controlType == 'SPECIFIC'){ 
				console.error('Control type set to specific but no indicies given.');
				return;
			}
			indicies = matrix.length;
			indicieLength = matrix.length;
		}
		else indicieLength = indicies.length;
		if(typeof tolerance == 'undefined') {
			tolerance = 0;
		}
		if(typeof controlType == 'undefined') {
			controlType = 'MATCH_ALL';
		}
		var operatorFunction = function(a,b) {
			switch(operatorType) {
				case ">": 
					if(a > b-tolerance) return true;
					else return false;
				case "<": 
					if(a < b+tolerance) return true;
					else return false;
				case ">=":
					if(a > b-tolerance || b-tolerance < a < b+tolerance) return true;
					else return false;
				case "<=": 
					if(a < b+tolerance ||  b-tolerance < a < b+tolerance) return true;
					else return false;
				case "==":
					if(b-tolerance < a && a < b+tolerance) return true;
					else return false;
			}
			
		}
		if(controlType == 'ONE_FOR_ALL') booleanReturnValue = false;
		else booleanReturnValue = [];
		for(var i = 0; i < indicieLength; ++i) {
			if(controlType == 'ONE_FOR_ALL') {
				if(operatorFunction(matrix[i],value) == true) return true;
			}
			else {
				if(controlType == 'SPECIFIC') {
					booleanReturnValue.push(operatorFunction(matrix[indicies[i]],value));
				}
				else booleanReturnValue.push(operatorFunction(matrix[i],value));
			}
		}
		var numTrue = 0;
		var numFalse = 0;
		for(var i = 0; i < booleanReturnValue.length; ++i) {
			if(booleanReturnValue[i] == true) ++numTrue;
			else ++numFalse;	
		}
		if(controlType == 'MAJORITY_CALL') {
			if(numTrue > numFalse) return true;
			else return false; 
		}
		if(controlType == 'MINORITY_CALL') {
			if(numTrue < numFalse) return true;
			else return false; 
		}
		if(controlType == 'MATCH_ALL') if(numTrue == indicies.length) return true;
		if(controlType == 'SPECIFIC') {
			var tempBoolean = booleanReturnValue[0];
			for(var i = 1; i < indicieLength; ++i) {
				tempBoolean = tempBoolean & booleanReturnValue[i];
			}
			return tempBoolean
		}
		return false;
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
		return vector;
	},

	matrixMultiply: function(matrix1,matrix2,dim1,dim2) {
		var result = [];
		var sum = 0;
		var place = 0;
		var shift = 0;
		var test = 0;
		for(var j = 0;;) {
			if(test >= 1000) break;
			else ++test;
			if(result.length%dim2[1] == 0 && (result.length != 1 || (result.length-dim2[1]) == 0) && result.length != 0) {
				++j;
				if(j >= dim1[1]) break;
				place = 0;
				shift = (dim1[0]*j);
			}
			for(var i = 0; i < dim1[0]; ++i) {
				sum+=matrix1[i+shift]*(matrix2[place+(i*dim2[1])]);
				if((i+1)%dim1[0] == 0 && (i+1)!=1) {
					//console.log("t---b");
					//console.log(test);
					//console.log("t---e");
					place+=1;
					result.push(sum);
					sum = 0;
				}
			}
		}
		return result;
	},


	translateXYZ: function(matrix, x,y,z){
		matrix[12]+=x;

		matrix[13]+=y;

		matrix[14]+=z;
	},

	setGL: function(id) {
		try {
			this.canvas = document.getElementById(id);
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
		console.log(newHexValue);
		var r = parseInt(newHexValue.charAt(0)+newHexValue.charAt(1),16);
		var g = parseInt(newHexValue.charAt(2)+newHexValue.charAt(3),16);
		var b = parseInt(newHexValue.charAt(4)+newHexValue.charAt(5),16);
		console.log(r,g,b);
		//(r/255,g/255,b/255);
		return [r/255,g/255,b/255];
	},

	max: function(array) {
		if(array.length > 50000) {
			var currentMax = -Infinity;
			for(var i = 0; i < array.length; ++i) {
				if(array[i] > currentMax) {
					currentMax = array[i];
				}
			}
			return currentMax;
		}
		else return Math.max.apply(Math,array);

	},
	
	extend: function(array1,array2,shift) {
		if(typeof shift == 'undefined') shift = 0;
		array2.forEach(function(entry) {array1.push(entry+shift)},this);
	},
	
	drawStage: function(stage) { //,glOptionsList
		var GL = this.gl;
		var attributes = this.ATTRIBUTES;
		var canvas = this.canvas;
		try {
			var displayWidth  = canvas.clientWidth;
			var displayHeight = canvas.clientHeight;
			if (canvas.width  != displayWidth || canvas.height != displayHeight) {
				canvas.width  = displayWidth;
				canvas.height = displayHeight;
			}
			GL.enable(GL.DEPTH_TEST); //MOVE OPTIONS TO ENABLE/DISABLE system per each draw.
			GL.depthFunc(GL.LEQUAL);
			GL.clearColor(0.0,0.0,0.0,0.0);
			GL.clearDepth(1.0);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.viewport(stage.VIEWPORT[0],stage.VIEWPORT[1],stage.VIEWPORT[2],stage.VIEWPORT[3]);
			for(var i =  0; i < stage.MESHES.length; ++i) {
				var mesh =  stage.MESHES[i];
				var attributes = stage.MESHES[i].ATTRIBUTES;
				GL.useProgram(mesh.SHADER.SHADER_PROGRAM);
				GL.uniformMatrix4fv(mesh.UNIFORMS["pMatrix"],false,stage.CAMERA);
				GL.uniformMatrix4fv(mesh.UNIFORMS["vMatrix"],false,stage.VMATRIX);
				GL.uniformMatrix4fv(mesh.UNIFORMS["mMatrix"],false,mesh.MMATRIX);
				GL.bindBuffer(GL.ARRAY_BUFFER,mesh.VERTEX_BUFFER);
				GL.vertexAttribPointer(mesh.ATTRIBUTES["position"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ARRAY_BUFFER,mesh.COLOR_BUFFER);
				GL.vertexAttribPointer(mesh.ATTRIBUTES["color"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ARRAY_BUFFER,mesh.NORMAL_BUFFER);
				GL.vertexAttribPointer(mesh.ATTRIBUTES["normal"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,mesh.FACE_BUFFER);
				GL.drawElements(mesh.DRAWTYPE,mesh.MESH_INDICIES,GL.UNSIGNED_SHORT,0);
				//console.log(mesh.MESH_INDICIES);
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
		this.MATERIAL = "FLAT"; //remove
		this.MMATRIX = _3asyD.getI4(); //remove
		this.INDICIES = smoothX*smoothY*6;
		this.DRAWTYPE = _3asyD.gl.TRIANGLES; //remove
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
	
_3asyD.Shape =  function (type,color_s,indicies) {
		this.CHILDREN = [];
		this.INDICIES = indicies;
		this.VERTICIES = [];
		this.NORMALS = [];
		this.FACE_UV = [];
		this.FACES = [];
		this.COLOR = [];
		this.setColor(color_s);
		this.type = type;
		this.DRAWTYPE = this.gl.TRIANGLES;
		
	};
_3asyD.Shape.prototype = _3asyD;
_3asyD.Shape.prototype.constructor = _3asyD.Shape;

_3asyD.Shape.prototype.setColor = function(color_s) {
	var color = [];
	var colorCounter = 0;
	for(var i = 0; i < color_s.length; ++i) {
		color.push(_3asyD.hexToGLRGB(color_s[i]));
	}
	var updateSeries = Math.floor(this.INDICIES/color_s.length)-1;
	for(var i = 0; i < this.INDICIES; ++i) {
		if(color_s.length == 1) {

			this.COLOR.push(color[0][0],color[0][1],color[0][2]);
		}
		else if(i <= updateSeries) {
			this.COLOR.push(color[colorCounter][0],color[colorCounter][1],color[colorCounter][2])
			if(i == updateSeries) {
				++colorCounter;
				updateSeries = updateSeries*(colorCounter+1);
			}
		} 
	}
};

_3asyD.Shape.prototype.move = function(x,y,z) {
	for(var i = 0; i < this.VERTICIES.length; i+=3) {
		this.VERTICIES[i] += x;
		this.VERTICIES[i+1] += y;
		this.VERTICIES[i+2] += z;
	}
}; 
_3asyD.Shape.prototype.rotate = function(angleX,angleY,angleZ) {

	var rotationMatrix = [

	]

};
_3asyD.Stage = function(name, viewport, meshes) {
	this.VMATRIX = _3asyD.getI4();
	this.MESHES = [];
	if(typeof meshes !== undefined) {
		this.MESHES = meshes;

	}
	this.NAME = name;
	this.VIEWPORT = viewport;
};
_3asyD.Stage.prototype = _3asyD;
_3asyD.Stage.prototype.constructor = _3asyD.Stage;
_3asyD.Stage.prototype.add = function(mesh) {
	//(typeof this.MESHES);
	if((typeof this.MESHES) == 'undefined') { this.MESHES = [mesh]; 
	}
	else { this.MESHES.push(mesh); }
};
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

_3asyD.Stage.prototype.setOrthographicCamera = function(width,height,zMax,zMin) {
	this.CAMERA = [
	(1/(width)),0,0,0,
	0,(1/(height)),0,0,
	0,0,(-2/(zMax-zMin)),0,
	0,0,0,1
	]

}


_3asyD.Mesh = function(name, shaderType, objects) {
	this.MMATRIX = _3asyD.getI4();
	this.DRAWTYPE = _3asyD.gl.TRIANGLES;
	this.bufferSet = false;
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
		this.UNIFORMS = {};
		this.ATTRIBUTES = {};

		for(var i =  0; i < uniformNamesArray.length; ++i) {
			this.UNIFORMS[uniformNamesArray[i]] = (GL.getUniformLocation(currentProgram,uniformNamesArray[i]));
		}


		for(var i =  0; i < attributeNameArray.length; ++i) {
			//(attributeNameArray[i]);
			this.ATTRIBUTES[attributeNameArray[i]] = GL.getAttribLocation(currentProgram,attributeNameArray[i]);
			//(attributes[attributeNameArray[i]]);
			GL.enableVertexAttribArray(this.ATTRIBUTES[attributeNameArray[i]]);
		}

	};
_3asyD.Mesh.prototype.readyForDraw = function() {
	this.MESH_VERTICIES = this.OBJECTS[0].VERTICIES.slice();
	this.MESH_FACES = this.OBJECTS[0].FACES.slice();
	this.MESH_NORMALS = this.OBJECTS[0].NORMALS.slice();
	this.MESH_COLOR = this.OBJECTS[0].COLOR.slice();
	this.MESH_INDICIES = this.OBJECTS[0].INDICIES;
	var currentMax = (this.OBJECTS[0].VERTICIES.length)/3;
	for(var i = 1; i < this.OBJECTS.length; ++i) {
		var tempFaces = this.OBJECTS[i].FACES.slice();
		_3asyD.extend(this.MESH_FACES,tempFaces,currentMax);
		_3asyD.extend(this.MESH_VERTICIES,this.OBJECTS[i].VERTICIES);
		_3asyD.extend(this.MESH_NORMALS,this.OBJECTS[i].NORMALS);
		_3asyD.extend(this.MESH_COLOR,this.OBJECTS[i].COLOR);
		this.MESH_INDICIES+=this.OBJECTS[i].INDICIES;
		currentMax += ((this.OBJECTS[i].VERTICIES.length)/3);
	}
	if(this.bufferSet == false) {
		var GL = this.gl;
		this.VERTEX_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.VERTEX_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(this.MESH_VERTICIES),GL.STATIC_DRAW);
		this.FACE_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,this.FACE_BUFFER);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.MESH_FACES),GL.STATIC_DRAW);
		this.NORMAL_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.NORMAL_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.MESH_NORMALS),GL.STATIC_DRAW);
		this.COLOR_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.COLOR_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.MESH_COLOR),GL.STATIC_DRAW);
		this.bufferSet = true;
	}
};

_3asyD.Mesh.prototype.setDrawType = function(typeString) { 
	try {
		var GL = this.gl;
		this.DRAWTYPE = GL[typeString];
	}
	catch(err) {
		console.error(err);
		return false;
	}
};


_3asyD.Cube = function Cube(length,width,height,color_s) {
	_3asyD.Shape.call(this,'CUBE',color_s,36);
	var l = length/2;
	var w = width/2;
	var h = height/2;
	this.CHILDREN = [];
	this.LENGTH = length;
	this.WIDTH = width;
	this.HEIGHT = height;
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
};

_3asyD.Cube.prototype = Object.create(_3asyD.Shape.prototype);
_3asyD.Cube.prototype.constructor = _3asyD.Cube;




