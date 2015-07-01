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
	};
_3asyD.Shape.prototype = _3asyD;
_3asyD.Shape.prototype.constructor = _3asyD.Shape;
_3asyD.Shape.prototype.setDrawType = function(shape,typeString) { //FIX
	try {
		var GL = this.prototype.gl;
		this.DRAWTYPE = GL[typeString];
	}
	catch(err) {
		console.error(err);
		return false;
	}
};