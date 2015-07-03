_3asyD.Shape =  function () {
		var proto = this.prototype;
		this.CHILDREN = [];
		this.INDICIES = null;
		this.VERTICIES = [];
		this.NORMALS = [];
		this.FACE_UV = [];
		this.FACES = [];
		this.COLOR = [];
		this.DRAWTYPE = proto.gl.TRIANGLES;
		this.MMATRIX = proto.getI4();
		this.bufferSetUp();
	};
_3asyD.Shape.prototype = _3asyD;
_3asyD.Shape.prototype.constructor = _3asyD.Shape
_3asyD.Shape.prototype.setDrawType = function(typeString) { //FIX
	try {
		var GL = this.prototype.gl;
		this.DRAWTYPE = GL[typeString];
	}
	catch(err) {
		console.error(err);
		return false;
	}
};
_3asyD.Shape.prototype.bufferSetUp = function() {
		var GL = this.prototype.gl;
		this.VERTEX_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.VERTEX_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(this.VERTICIES),GL.STATIC_DRAW);
		this.FACE_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,this.FACE_BUFFER);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.FACES),GL.STATIC_DRAW);
		this.NORMAL_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.NORMAL_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.NORMALS),GL.STATIC_DRAW);
		this.COLOR_BUFFER = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,shape.COLOR_BUFFER);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.COLOR),GL.STATIC_DRAW);
	},