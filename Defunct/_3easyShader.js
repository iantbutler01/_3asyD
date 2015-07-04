//Move to json architecture.

_3asyD.shaders = {
	flat: function flat() {
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
				",
			"sourceCode": "attributePosition+"attributeColor
			+"attributeNormal+"uniformPMatrix+"uniformVMatrix
			+"uniformMMatrix+"varyingColor+"varyingNormal+main; 
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

			",
			"sourceCode": "precision+varyingColor+"varyingNormal+"uniformSourceAmbient+"uniformSourceDiffuse+"uniformSourceDirection+"uniformMaterialDiffuse+"uniformMaterialAmbient+"main;
		}
	},

	
	phong: function phong() {
		this.vertex = {
			"attributePosition": "attribute vec3 position;\n",
			"attributeColor": "attribute vec3 color;\n",
			"attributeNormal": "attribute vec3 normal;\n",
			"uniformPMatrix": "uniform mat4 pMatrix;\n",
			"uniformVMatrix": "uniform mat4 vMatrix;\n",
			"uniformMMatrix": "uniform mat4 mMatrix;\n",
			"varyingColor": "varying vec3 vColor;\n",
			"varyingNormal": "varying vec3 vNormal;\n",
			"varyingView": "varying vec3 vView;\n",
			"main": "void main(void) {
				vNorm = vec3(mMatrix*vec4(normal,0));
				gl_Position = pMatrix*vMatrix*mMatrix*vec4(position,1.0);
				vView = vec3(vMatrix*mMatrix*vec4(position,1));
				vColor = color;
			";
			"sourceCode": "attributePosition+"attributeColor
			+"attributeNormal+"uniformPMatrix+"uniformVMatrix
			+"uniformMMatrix+"varyingColor+"varyingNormal+"varyingView+"main; 
		},
		this.fragment = {
			"precision": "precision mediump float;\n",
			"varyingColor": "varying vec3 vColor;\n",
			"varyingNormal": "varying vec3 vNorm;\n",
			"varyingView": "varying vec3 vView;\n",
			"uniformSourceAmbient": "uniform vec3 SOURCE_AMBIENT;\n",
			"uniformSourceDiffuse": "uniform vec3 SOURCE_DIFFUSE;\n",
			"uniformSourceSpecular": "uniform vec3 SOURCE_SPECULAR;\n",
			"uniformSourceDirection": "uniform vec3 SOURCE_DIRECTION;\n",
			"uniformMaterialAmbient": "uniform vec3 MATERIAL_AMBIENT;\n",
			"uniformMaterialDiffuse": "uniform vec3 MATERIAL_DIFFUSE;\n",
			"uniformMaterialSpecular": "uniform vec3 MATERIAL_SPECULAR;\n",
			"uniformGloss": "uniform float GLOSS;\n",

			"main": "void main(void) {
				vec3 I_ambient = SOURCE_AMBIENT*MATERIAL_AMBIENT;
				vec3 V = normalize(vView);
				vec3 L = normalize(SOURCE_DIRECTION);
				vec3 I_diffuse = max(0.0,dot(vNorm,L))*(MATERIAL_DIFFUSE*SOURCE_DIFFUSE)*10.0;
				vec3 R = reflect(SOURCE_DIRECTION,vNorm);
				vec3 I_specular = SOURCE_SPECULAR*MATERIAL_SPECULAR*pow(max(dot(R,V),0.),GLOSS);
				vec3 I = I_ambient+I_diffuse+I_specular;
				gl_FragColor = vec4(I*vColor,1.);

			";
			"sourceCode": "precsion+"varyingColor+"varyingNormal+
			"varyingView+"uniformSourceAmbient+"uniformSourceDiffuse+thus.uniformSourceDirection
			+"uniformMaterialAmbient+"uniformMaterialDiffuse+"uniformMaterialSpecular+"uniformGloss
			+"main;

		
	


