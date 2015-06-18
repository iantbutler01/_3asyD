//Move to json architecture.

_3asyD.shaders = {
	flat: function flat() {
		this.vertex = {
			this.attributePosition = "attribute vec3 position;\n";
			this.attributeColor = "attribute vec3 color;\n";
			this.attributeNormal = "attribute vec3 normal;\n";
			this.uniformPMatrix = "uniform mat4 pMatrix;\n";
			this.uniformVMatrix = "uniform mat4 vMatrix;\n";
			this.uniformMMatrix = "uniform mat4 mMatrix;\n";
			this.varyingColor = "varying vec3 vColor;\n";
			this.varyingNormal = "varying vec3 vNormal;\n";
			this.main = "void main(void) {
				vColor = color;
				vNormal = vec3(mMatrix*vec4(normal,0));
				gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0);
				}";
			this.sourceCode = this.attributePosition+this.attributeColor
			+this.attributeNormal+this.uniformPMatrix+this.uniformVMatrix
			+this.uniformMMatrix+this.varyingColor+this.varyingNormal+this.main; 
		};
		this.fragment = {\
			this.precision = "precision mediump float;\n";
			this.varyingColor = "varying vec3 vColor;\n";
			this.varyingNormal = "varying vec3 vNormal;\n";
			this.uniformSourceAmbient = "uniform vec3 SOURCE_AMBIENT;\n";
			this.uniformSourceDiffuse = "uniform vec3 SOURCE_DIFFUSE;\n";
			this.uniformSourceDirection = "uniform vec3 SOURCE_DIRECTION;\n";
			this.uniformMaterialAmbient = "uniform vec3 MATERIAL_AMBIENT;\n";
			this.uniformMaterialDiffuse = "uniform vec3 MATERIAL_DIFFUSE;\n";
			this.main = "void main(void) {
				vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT;
				vec3 L = normalize(SOURCE_DIRECTION);
				vec3 I_diffuse = max(0,dot(vNoraml,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0;
				vec3 I = I_ambient+I_diffuse;
				gl_FragColor = vec4(I*vColor,1.0);

			}";
			this.sourceCode = this.precision+this.varyingColor+this.varyingNormal+this.uniformSourceAmbient+this.uniformSourceDiffuse+this.uniformSourceDirection+this.uniformMaterialDiffuse+this.uniformMaterialAmbient+this.main;
		}

	},
	phong: function phong() {
		this.vertex = {
			this.attributePosition = "attribute vec3 position;\n";
			this.attributeColor = "attribute vec3 color;\n";
			this.attributeNormal = "attribute vec3 normal;\n";
			this.uniformPMatrix = "uniform mat4 pMatrix;\n";
			this.uniformVMatrix = "uniform mat4 vMatrix;\n";
			this.uniformMMatrix = "uniform mat4 mMatrix;\n";
			this.varyingColor = "varying vec3 vColor;\n";
			this.varyingNormal = "varying vec3 vNormal;\n";
			this.varyingView = "varying vec3 vView;\n";
			this.main = "void main(void) {
				vNorm = vec3(mMatrix*vec4(normal,0));
				gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0);
				vView = vec3(vMatrix*mMatrix*vec4(position,1));
				vColor = color;
			}";
			this.sourceCode = this.attributePosition+this.attributeColor
			+this.attributeNormal+this.uniformPMatrix+this.uniformVMatrix
			+this.uniformMMatrix+this.varyingColor+this.varyingNormal+this.varyingView+this.main; 
		};
		this.fragment = {
			this.precision = "precision mediump float;\n";
			this.varyingColor = "varying vec3 vColor;\n";
			this.varyingNormal = "varying vec3 vNorm;\n";
			this.varyingView = "varying vec3 vView;\n";
			this.uniformSourceAmbient = "uniform vec3 SOURCE_AMBIENT;\n";
			this.uniformSourceDiffuse = "uniform vec3 SOURCE_DIFFUSE;\n";
			this.uniformSourceSpecular = "uniform vec3 SOURCE_SPECULAR;\n";
			this.uniformSourceDirection = "uniform vec3 SOURCE_DIRECTION;\n";
			this.uniformMaterialAmbient = "uniform vec3 MATERIAL_AMBIENT;\n";
			this.uniformMaterialDiffuse = "uniform vec3 MATERIAL_DIFFUSE;\n";
			this.uniformMaterialSpecular = "uniform vec3 MATERIAL_SPECULAR;\n";
			this.uniformGloss = "uniform float GLOSS;\n";

			this.main = "void main(void) {
				vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT;
				vec3 V = normalize(vView);
				vec3 L = normalize(SOURCE_DIRECTION);
				vec3 I_diffuse = max(0.0,dot(vNorm,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0;
				vec3 R = reflect(SOURCE_DIRECTION,vNorm);
				vec3 I_specular = SOURCE_SPECULAR*MATERIAL_SPECULAR*pow(max(dot(R,V),0.),GLOSS);
				vec3 I = I_ambient+I_diffuse+I_specular;
				gl_FragColor = vec4(I*vColor,1.);

			}";
			this.sourceCode = this.precsion+this.varyingColor+this.varyingNormal+
			this.varyingView+this.uniformSourceAmbient+this.uniformSourceDiffuse+thus.uniformSourceDirection
			+this.uniformMaterialAmbient+this.uniformMaterialDiffuse+this.uniformMaterialSpecular+this.uniformGloss
			+this.main;

		}
	}

}
