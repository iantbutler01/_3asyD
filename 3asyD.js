var PI = Math.PI;
var _3asyD = {
	gl: null,
	programs: [],
	currentProgram: null,
	VMATRIX: _3asyD.getI4(),
	UNIFORMS: [],
	PMATRIX: _3asyD.getPerspectiveProj(40,($('#canvas').width()/$('#canvas').height()),1,100),
	ATTRIBUTES: [],

	dtor: function(deg) {
		return (deg*Math.PI/180);
	},

	getPerspectiveProj: function(angle, a, zMax, zMin) {
		var tan = Math.tan(_3asyD.dtor(0.5*angle));
		var A = -(zMax+zMin)/(zMax-zMin);
		var B = (-2*zMax*zMin)/(zMax-zMin)
		return [
		(0.5/tan),0,0,0,
		0,(0.5*a/tan),0,0,
		0,0,A,B,
		0,0,-1,0
		]
	},

	getI4: function() {
		return [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
		]
	},

	rotateX: function(m, angle) {
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

	rotateY: function(m, angle) {
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


	translateZ: function(m, t){
		m[14]+=t;
	},

	setGL: function(id) {
		try {
			this.gl = $(id)[0].getContext('experimental-webgl');
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

	setProgram: function(name) {
		try {
			this.GL.useProgram(this.programs[name]);
			this.currentProgram = this.programs[name];
		}
		catch(err) {
			console.error(err);
		}
	},

	loadUniforms: function(uniformNamesArray) {
		var GL = this.gl;
		var currentProgram = this.currentProgram;
		for(i = 0; i < uniformNamesArray.length; ++i) {
			uniforms[uniformNamesArray[i]] = (GL.getUniformLocation(currentProgram,uniformNamesArray[i]));
		}
		for(i = 0; i < shapeList.length; ++i) {
			this.UNIFORMS = uniforms;
		}
	},

	setLighting: function(lightInfoObject) {
		var GL = this.gl;
		var currentProgram = this.currentProgram;
		var propertyName = lightInfoObject.keys();
		for(i = 0; i < propertyName.length; ++i) {
			GL.uniform3fv(GL.getUniformLocation(currentProgram,propertyName[i]),lightInfoObject[i]);
		}

	},
	bufferSetUp: function(shape) {
		var GL = this.gl;
		shape.VERTEX_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.VERTEX_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(shape.VERTICIES),GL.STATIC_DRAW);
		shape.FACE_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,this.FACE_BUFFER);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(shape.FACES),GL.STATIC_DRAW);
		shape.NORMAL_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.NORMAL_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shape.NORMALS),GL.STATIC_DRAW);
		shape.COLOR_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,this.COLOR_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shape.COLOR),GL.STATIC_DRAW);
	},
	setDrawType: function(shape,typeString) {
		try {
			var GL = this.gl;
			shape.DRAWTYPE = gl[typeString];
		}
		catch(err) {
			console.error(err);
			return false;
		}
	},

	loadAttributes: function(attributeNameArray) {
		var GL = this.gl;
		var currentProgram = this.currentProgram;
		for(i = 0; i < attributeNameArray.length; ++i) {
			this.ATTRIBUTES[attributeNameArray[i]] = GL.getAttribLocation(currentProgram,attributeNameArray[i]);
			GL.enableVertexAttribArray(this.ATTRIBUTES[attributeNameArray[i]]);
		}
		
	},

	drawElements: function(shapeList) {
		var GL = this.gl;
		var attributes = this.ATTRIBUTES;
		try {
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.uniformMatrix4fv(this.UNIFORMS["pMatrix"],false,this.PMATRIX);
			GL.uniformMatrix4fv(this.UNIFORMS["vMatrix"],false,this.VMATRIX);
			for(i = 0; i < shapeList.length; ++i) {
				GL.uniformMatrix4fv(this.UNIFORMS["mMatrix"],false,shapeList[i].MMATRIX);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].VERTEX_BUFFER);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].COLOR_BUFFER);
				GL.bindBuffer(GL.ARRAY_BUFFER,shapeList[i].NORMAL_BUFFER);
				for(j = 0; j < attributes.length; ++j) {
					GL.vertexAttribPointer(attributes[j],3,GL.FLOAT,false,4*3,0);
				}
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

	Cube: function Cube(length,width,height) {
		var l = length/2;
		var w = width/2;
		var h = height/2;
		this.INDICIES = 36;
		this.LENGTH = length;
		this.WIDTH = width;
		this.HEIGHT = height;
		this.MMATRIX = this.getI4();
		this.DRAWTYPE = _3asyD.gl.TRIANGLES;
		this.VERTICIES = [    //Eventually take out the colors from this.
			-1*l,-1*w,-1*h,     1,1,0,
			1*l,-1*w,-1*h,     1,1,0,
			1*l, 1*w,-1*h,     1,1,0,
			-1*l, 1*w,-1*h,     1,1,0,

			-1*l,-1*w, 1*h,     0,0,1,
			1*l,-1*w, 1*h,     0,0,1,
			1*l, 1*w, 1*h,     0,0,1,
			-1*l, 1*w, 1*h,     0,0,1,

			-1*l,-1*w,-1*h,     0,1,1,
			-1*l, 1*w,-1*h,     0,1,1,
			-1*l, 1*w, 1*h,     0,1,1,//ll
			-1*l,-1*w, 1*h,     0,1,1,

			1*l,-1*w,-1*h,     1,0,0,
			1*l, 1*w,-1*h,     1,0,0,
			1*l, 1*w, 1*h,     1,0,0,//kk
			1*l,-1*w, 1*h,     1,0,0,

			-1*l,-1*w,-1*h,     1,0,1,
			-1*l,-1*w, 1*h,     1,0,1,
			1*l,-1*w, 1*h,     1,0,1, //jj
			1*l,-1*w,-1*h,     1,0,1,

			-1*l, 1*w,-1*h,     0,1,0,
			-1*l, 1*w, 1*h,     0,1,0,
			1*l, 1*w, 1*h,     0,1,0, //oo
			1*l, 1*w,-1*h,     0,1,0
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
		];
		var crossProduct = this.crossProduct;
		for(i = 1; i <= 24; ++i) {
			if(i <= 2) {
				this.NORMALS.concat(crossProduct([-1*l,-1*w,-1*h],[1*l,-1*w,-1*h]));
			}
			if(i>2 && i<=4) {
				this.NORMALS.concat(crossProduct([1*l,1*w,-1*h],[-1*l,1*w,-1*h]));
			}
			if(i>4 && i<=6) {
				this.NORMALS.concat(crossProduct([-1*l,-1*w,1*h],[1*l,-1*w,1*h]));
			}
			if(i>6 && i<=8) {
				this.NORMALS.concat(crossProduct([1*l,1*w,1*h],[-1*l,1*w,1*h]));
			}
			if(i>8 && i<=10) {
				this.NORMALS.concat(crossProduct([-1*l,-1*w,-1*h],[-1*l,1*w,-1*h]));
			}
			if(i>10 && i<=12) {
				this.NORMALS.concat(crossProduct([-1*l,1*w,1*h],[-1*l,-1*w,1*h]));
			}
			if(i>12 && i<=14) {	
				this.NORMALS.concat(crossProduct([1*l,-1*w,-1*h],[1*l,1*w,-1*h]));
			}
			if(i>14 && i<=16) {
				this.NORMALS.concat(crossProduct([1*l,1*w,1*h],[1*l,-1*w,1*h]));
			}
			if(i>16 && i<=18) {
				this.NORMALS.concat(crossProduct([-1*l,-1*w,-1*h],[-1*l,-1*w,1*h]));
			}
			if(i>18 && i<=20) {
				this.NORMALS.concat(crossProduct([1*l,-1*w,1*h],[1*l,-1*w,-1*h]));
			}
			if(i>20 && i<=22) {
				this.NORMALS.concat(crossProduct([-1*l,1*w,-1*h],[-1*l,1*w,1*h]));
			}
			if(i>22 && i<=24) {
				this.NORMALS.concat(crossProduct([1*l,1*w,1*h],[1*l,1*w,-1*h]));
			}
		}
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

		]
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
		this.VERTICIES = [];
		this.NORMALS = [];
		this.COLOR = [];
		this.MMATRIX = _3asyD.getI4();
		this.INDICIES = smoothX*smoothY*6;
		this.DRAWTYPE = _3asyD.gl.TRIANGLES;
		for(i = 0; i <= PI; i+=(PI/sY)) {
			for(j = 0; j <= 2*PI; j+=((2*PI)/sX)) {
				var x = Math.sin(i)*Math.cos(j);
				var y = Math.sin(i)*Math.sin(j);
				var z = Math.cos(i);
				if(j<=PI) {
					this.COLOR.push(0.5,0.2,0.9);
				}
				else this.COLOR.push(0.2,0.4,0.7);
				this.NORMALS.push(x,y,z);
				this.VERTICIES.push(pX*x,pY*y,pZ*z);
			}
		}
		this.FACES = [];
		for(i = 0; i < smoothY; ++i) {
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