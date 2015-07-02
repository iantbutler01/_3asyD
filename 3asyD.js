var PI = Math.PI;
_3asyD = {
	gl: null,
	programs: [],
	currentProgram: null,
	UNIFORMS: [],
	ATTRIBUTES: [],
	PMATRIX: null,
	VMATRIX: [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
		],

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
		return vector;
	},


	translateXYZ: function(moveMatrix, x,y,z){
		moveMatrix[12]+=x;

		moveMatrix[13]+=y;

		moveMatrix[14]+=z;
	},

	setGL: function(id) {
		try {
			this.gl = $(id)[0].getContext('experimental-webgl');
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

	createFromExternalScripts: function(vShaderId,fShaderId,programName,callback){
		var GL = this.gl;
		var SHADER_PROGRAM=null;
		$.when($.get(vShaderId),$.get(fShaderId)).done(function(vShaderSrc,fShaderSrc){
			var vertexShade = GL.createShader(GL.VERTEX_SHADER);
			var fragShade = GL.createShader(GL.FRAGMENT_SHADER);
			GL.shaderSource(vertexShade,vShaderSrc[0]);
			GL.compileShader(vertexShade);
			if(!GL.getShaderParameter(vertexShade,GL.COMPILE_STATUS)) {
				console.error("Vertex Shader Failed to Compile.\n"+GL.getShaderInfoLog(vertexShade)+"\n");
				return false;
			}
			GL.shaderSource(fragShade,fShaderSrc[0]);
			GL.compileShader(fragShade);
			if(!GL.getShaderParameter(fragShade,GL.COMPILE_STATUS)) {
				console.error("Fragment Shader Failed to Compile.\n"+GL.getShaderInfoLog(fragShade)+"\n");
				return false;
			}
			SHADER_PROGRAM = GL.createProgram();
			GL.attachShader(SHADER_PROGRAM,vertexShade);
			GL.attachShader(SHADER_PROGRAM,fragShade);
			GL.linkProgram(SHADER_PROGRAM);
			_3asyD.programs[programName]=SHADER_PROGRAM;
			callback();
		});
	},
	



	hexToGLRGB: function(hexValue) {
		console.log(hexValue.length);
		var newHexValue = "";
		if(hexValue.length == 4) {
			newHexValue = hexValue.charAt(1)+hexValue.charAt(1)+hexValue.charAt(2)+hexValue.charAt(2)+hexValue.charAt(3)+hexValue.charAt(3);
		}
		else newHexValue = hexValue.charAt(1)+hexValue.charAt(2)+hexValue.charAt(3)+hexValue.charAt(4)+hexValue.charAt(5)+hexValue.charAt(6);
		var r = parseInt(newHexValue.charAt(0)+newHexValue.charAt(1),16);
		var g = parseInt(newHexValue.charAt(2)+newHexValue.charAt(3),16);
		var b = parseInt(newHexValue.charAt(4)+newHexValue.charAt(5),16);
		console.log(r/255,g/255,b/255);
		return [r/255,g/255,b/255];
	},

	loadUniforms: function(uniformNamesArray) {
		var GL = this.gl;
		var currentProgram = this.currentProgram;
		var uniforms = {};
		for(var i =  0; i < uniformNamesArray.length; ++i) {
			uniforms[uniformNamesArray[i]] = (GL.getUniformLocation(currentProgram,uniformNamesArray[i]));
		}
		this.UNIFORMS = uniforms;
	},

	setLightDirection: function(directionVector) {
		var GL = this.gl;
		var currentProgram = _3asyD.currentProgram;
		GL.uniform3fv(GL.getUniformLocation(currentProgram,"SOURCE_DIRECTION"),new Float32Array(this.vectorByScalar(directionVector,-1)));
	},

	setLight: function(typeString,color,gloss) {
		var GL = this.gl;
		var currentProgram = _3asyD.currentProgram;
		GL.uniform3fv(GL.getUniformLocation(currentProgram,typeString),new Float32Array(this.hexToGLRGB(color)));
		if(gloss) GL.uniform1f(GL.getUniformLocation(currentProgram,"GLOSS"),gloss);

	},
	bufferSetUp: function(shape) {
		var GL = this.gl;
		shape.VERTEX_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.VERTEX_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(shape.VERTICIES),GL.STATIC_DRAW);
		shape.FACE_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,shape.FACE_BUFFER);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(shape.FACES),GL.STATIC_DRAW);
		shape.NORMAL_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.NORMAL_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shape.NORMALS),GL.STATIC_DRAW);
		shape.COLOR_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.COLOR_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shape.COLOR),GL.STATIC_DRAW);
	},

	loadAttributes: function(attributeNameArray) {
		var GL = this.gl;
		var currentProgram = this.currentProgram;
		for(var i =  0; i < attributeNameArray.length; ++i) {
			console.log(attributeNameArray[i]);
			this.ATTRIBUTES[attributeNameArray[i]] = GL.getAttribLocation(currentProgram,attributeNameArray[i]);
			console.log(this.ATTRIBUTES[attributeNameArray[i]]);
			GL.enableVertexAttribArray(this.ATTRIBUTES[attributeNameArray[i]]);
		}

		
	},

	drawStage: function(shapeList,glOptionsList) {
		var GL = this.gl;
		var attributes = this.ATTRIBUTES;
		try {
			GL.enable(gl.DEPTH_TEST); //MOVE OPTIONS TO ENABLE/DISABLE system per each draw.
			GL.depthFunc(gl.LEQUAL);
			GL.clearColor(0.0,0.0,0.0,0.0);
			GL.clearDepth(1.0);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.uniformMatrix4fv(this.UNIFORMS["pMatrix"],false,this.PMATRIX);
			GL.uniformMatrix4fv(this.UNIFORMS["vMatrix"],false,this.VMATRIX);
			for(var i =  0; i < shapeList.length; ++i) {
				GL.uniformMatrix4fv(this.UNIFORMS["mMatrix"],false,shapeList[i].MMATRIX);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].VERTEX_BUFFER);
				GL.vertexAttribPointer(attributes["position"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].COLOR_BUFFER);
				GL.vertexAttribPointer(attributes["color"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].NORMAL_BUFFER);
				GL.vertexAttribPointer(attributes["normal"],3,GL.FLOAT,false,0,0);
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,shapeList[i].FACE_BUFFER);
				GL.drawElements(shapeList[i].DRAWTYPE,shapeList[i].INDICIES,GL.UNSIGNED_SHORT,0);
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