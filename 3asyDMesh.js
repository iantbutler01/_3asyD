_3asyD.Mesh = function(name, shaderType, objects) {
	if(typeof objects !== undefined) {
		this.OBJECTS = objects;

	}
	else {
		this.OBJECTS = [];
	}
	
	if(typeof shaderType !== undefined) {
		this.SHADER = new _3asyD.Shader(shaderType);
		this.prototype.loadShaderVariables(this);
		this.SHADER_TYPE = this.SHADER.type;
	}
	this.NAME = name;
};
_3asyD.Mesh.prototype = _3asyD;
_3asyD.Mesh.prototype.constructor = _3asyD.Mesh;
_3asyD.Mesh.prototype.addShape = function(object) {
	this.OBJECTS.push(object);
};
_3asyD.Mesh.prototype.setShader = function(shader) {
	try {
		this.SHADER = shader;
		this.prototype.loadShaderVariables(this);
		this.SHADER_TYPE = this.SHADER.type;
	}
	catch(err) {
		console.error(err);
	}
};
_3asyD.Mesh.prototype.setLight = function(typeStringList,colorList,gloss,direction) {
	try {
		var GL = this.prototype.gl;
		var shader = this.prototype.SHADER;
		for(var i = 0; i < typeStringArray.length; ++i) {
			if(colorArray.length == 1) {
				GL.uniform3fv(GL.getUniformLocation(shader,typeStringList[i]),new Float32Array(this.prototype.hexToGLRGB(colorList[0])));
			}
			else GL.uniform3fv(GL.getUniformLocation(shader,typeStringList[i]),new Float32Array(this.prototype.hexToGLRGB(colorList[i])));
		}		
		if(typeof gloss !== undefined) GL.uniform1f(GL.getUniformLocation(shader,"GLOSS"),gloss);
		if(typeof direction !== undefined) 	GL.uniform3fv(GL.getUniformLocation(shader,"SOURCE_DIRECTION"),new Float32Array(this.prototype.vectorByScalar(directionVector,-1)));

	catch(err)
	{
		console.error(err);
	}
};

_3asyD.Mesh.prototype.loadShaderVariables = function() {
		var GL = this.prototype.gl;
		var currentProgram = this.SHADER;
		var uniformNamesArray = this.SHADER.UNIFORMS;
		var attributeNameArray = this.SHADER.ATTRIBUTES;
		var uniforms = {};

		for(var i =  0; i < uniformNamesArray.length; ++i) {
			uniforms[uniformNamesArray[i]] = (GL.getUniformLocation(currentProgram,uniformNamesArray[i]));
		}
		this.UNIFORMS = uniforms;

		for(var i =  0; i < attributeNameArray.length; ++i) {
			console.log(attributeNameArray[i]);
			this.ATTRIBUTES[attributeNameArray[i]] = GL.getAttribLocation(currentProgram,attributeNameArray[i]);
			console.log(this.ATTRIBUTES[attributeNameArray[i]]);
			GL.enableVertexAttribArray(this.ATTRIBUTES[attributeNameArray[i]]);
		}
	};
_3asyD.Mesh.prototype.readyForDraw = function() {
	this.MESH_VERTICIES = this.OBJECTS[0].
	E
	 RTICIES.slice();
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
		this.MESH_INDICIES+=this.OBJECTS[i].INDICIES;
		currentMax = (this.OBJECTS[i].VERTICIES.length)/3;
	}

};



