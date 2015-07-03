var PI = Math.PI;
_3asyD = {
	gl: null,
	programs: [],
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


	drawStage: function(stage) { //,glOptionsList
		var GL = this.gl;
		var attributes = this.ATTRIBUTES;
		try {
			GL.enable(gl.DEPTH_TEST); //MOVE OPTIONS TO ENABLE/DISABLE system per each draw.
			GL.depthFunc(gl.LEQUAL);
			GL.clearColor(0.0,0.0,0.0,0.0);
			GL.clearDepth(1.0);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.uniformMatrix4fv(stage.CAMERA,false,this.PMATRIX);
			GL.uniformMatrix4fv(this.UNIFORMS["vMatrix"],false,this.VMATRIX);
			for(var i =  0; i < stage.MESHES.length; ++i) {
				var objectList = stage.MESHES[i].OBJECTS;
				var attributes = stage.MESHES[i].ATTRIBUTES;
				for(var j = 0; j < objectList.length; ++j)
				{
					GL.uniformMatrix4fv(this.UNIFORMS["mMatrix"],false,objectList[i].MMATRIX);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].VERTEX_BUFFER);
					GL.vertexAttribPointer(attributes["position"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].COLOR_BUFFER);
					GL.vertexAttribPointer(attributes["color"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ARRAY_BUFFER,objectList[i].NORMAL_BUFFER);
					GL.vertexAttribPointer(attributes["normal"],3,GL.FLOAT,false,0,0);
					GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,objectList[i].FACE_BUFFER);
					GL.drawElements(objectList[i].DRAWTYPE,objectList[i].INDICIES,GL.UNSIGNED_SHORT,0);
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