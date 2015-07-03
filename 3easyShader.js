

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
	var GL = this.prototype.gl;
	var SHADER_PROGRAM=null;
	var vertexShade = GL.createShader(GL.VERTEX_SHADER);
	var fragShade = GL.createShader(GL.FRAGMENT_SHADER);
	GL.shaderSource(vertexShade,material.vertex.sourceCode);
	GL.compileShader(vertexShade);
	if(!GL.getShaderParameter(vertexShade,GL.COMPILE_STATUS)) {
		console.error("Vertex Shader Failed to Compile.\n"+GL.getShaderInfoLog(vertexShade)+"\n");
		return false;
	}
	GL.shaderSource(fragShade,material.fragment.sourceCode);
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
		"main": "void main(void) {
			vColor = color;
			vNormal = vec3(mMatrix*vec4(normal,0));
			gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0);
		}",
		"sourceCode": function() {
			var vert = this.vertex;
			return vert.attributePosition+vert.attributeColor+vert.attributeNormal+
			vert.uniformPMatrix+vert.uniformVMatrix+vert.uniformMMatrix+vert.varyingColor+
			vert.varyingNormal+vert.main;
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
		"main": "void main(void) {
			vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT;
			vec3 L = normalize(SOURCE_DIRECTION);
			vec3 I_diffuse = max(0,dot(vNoraml,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0;
			vec3 I = I_ambient+I_diffuse;
			gl_FragColor = vec4(I*vColor,1.0);
		}",
		"sourceCode": function() {
			var frag = this.fragment;
			return frag.precision+frag.varyingColor+frag.varyingNormal+
			frag.uniformSourceAmbient+frag.uniformSourceDiffuse+
			frag.uniformSourceDirection+frag.uniformMaterialDiffuse+
			frag.uniformMaterialAmbient+frag.main;
		}
	}
};






