	_3asyD.Cube = function Cube(length,width,height,colorScheme,color_s) {
		_3asyD.Shape.call(this);
		var l = length/2;
		var w = width/2;
		var h = height/2;
		this.CHILDREN = [];
		this.INDICIES = 24;
		this.LENGTH = length;
		this.WIDTH = width;
		this.HEIGHT = height;
		this.VERTICIES = [  
			-1*l,-1*w,-1*h,   
			1*l,-1*w,-1*h,     
			1*l, 1*w,-1*h,     
			-1*l, 1*w,-1*h,     

			-1*l,-1*w, 1*h,    
			1*l,-1*w, 1*h,    
			1*l, 1*w, 1*h,     
			-1*l, 1*w, 1*h,     

			-1*l,-1*w,-1*h,     
			-1*l, 1*w,-1*h,     
			-1*l, 1*w, 1*h,    
			-1*l,-1*w, 1*h,    

			1*l,-1*w,-1*h,     
			1*l, 1*w,-1*h,     
			1*l, 1*w, 1*h,     
			1*l,-1*w, 1*h,     

			-1*l,-1*w,-1*h,     
			-1*l,-1*w, 1*h,     
			1*l,-1*w, 1*h,    
			1*l,-1*w,-1*h,     

			-1*l, 1*w,-1*h,   
			-1*l, 1*w, 1*h,    
			1*l, 1*w, 1*h,    
			1*l, 1*w,-1*h,    
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
		//BOTTOM
		0,0,-1,
		0,0,-1,
		0,0,-1,
		0,0,-1,
		//TOP
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1,
		//BACK
		-1,0,0,
		-1,0,0,
		-1,0,0,
		-1,0,0,
		//FRONT
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
		//LEFT
		0,-1,0,
		0,-1,0,
		0,-1,0,
		0,-1,0,
		//RIGHT		
		0,1,0,
		0,1,0,
		0,1,0,
		0,1,0
		];

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
        ];
        this.bufferSetUp();
	};

	_3asyD.Cube.prototype = Object.create(_3asyD.Shape.prototype);
	_3asyD.Cube.prototype.constructor = _3asyD.Cube;