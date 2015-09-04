_3asyD.Stage = function(name, viewport, meshes) {
	var proto = this.prototype;
	this.VMATRIX = _3asyD.getI4();
	if(typeof meshes !== undefined) {
		this.MESHES = meshes;

	}
	else {
		this.MESHES = [];
	}
	this.NAME = name;
	this.VIEWPORT = proto.gl.viewport(viewport[0],viewport[1],viewport[2],viewport[3]);
}
_3asyD.Stage.prototype = _3asyD;
_3asyD.Stage.prototype.constructor = _3asyD.Stage;
_3asyD.Stage.prototype.add = function(object) {
	this.MESHES.push(mesh);
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

