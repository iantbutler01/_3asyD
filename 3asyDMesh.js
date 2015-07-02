_3asyD.Mesh = function(name, objects, shaderType) {
	if(typeof objects !== undefined) {
		this.OBJECTS = objects;

	}
	else {
		this.OBJECTS = [];
	}
	
	if(typeof shaderType !== undefined) {
		this.SHADER = _3asyD.Shader[shaderType];
		this.SHADER_TYPE = shaderType;
	}
	this.NAME = name;
};
_3asyD.Mesh.prototype = _3asyD;
_3asyD.Mesh.prototype.constructor = _3asyD.Mesh;
_3asyD.Mesh.prototype.addObject = function(object) {
	this.OBJECTS.push(object);
};
_3asyD.Mesh.prototype.setShader = function(shader) {
	try {
		this.SHADER = shader;
	}
	catch(err) {
		console.error(err);
	}
};



