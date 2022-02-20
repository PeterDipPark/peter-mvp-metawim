import * as pc from 'playcanvas';
import {meshPositions, meshIndices, meshUvs, meshMorphPositions} from './model';



export default class MetaWim {
	constructor({...props}) {
		
		// DOM 
		const { canvas } = props;

		// App 
		this.app = new pc.Application(canvas, {});
		// Start
		this.app.start();

    	
    	// Listeners
    	this.app.on("update", this.update, this);

		
    	// Temp
            this.rotDeg = 0;
            this.rotIdx = 0;

            this.morphWeight = 0;

            this.morphTarget = 0;

		// Init
		this.init();		

        
	}


	/**
	 * Setup Scene
	 * @return {[type]} [description]
	 */
	init() {

		// Test 01
		// this.testMesh_01();

		// Quick Test
		this.testMesh_02();



		
		
	}

	/**
	 * Canvas update
	 * @param  {[type]} dt [description]
	 * @return {[type]}    [description]
	 */
	update(dt) {		

		//this.testMesh_01_update(dt)
		
		// Test 02 
		this.rotateBlades(dt);
	}


	/**
	 * Quick app test
	 * @return {[type]} [description]
	 */
	testMesh_02() {


		// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
	    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
	    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

	    this.app.scene.ambientLight = new pc.Color(0.1, 0.1, 0.1);

	    this.app.scene.ambientLight = new pc.Color(0.1, 0.1, 0.1);

	    // Create an Entity with a camera component
	    const camera = new pc.Entity();
	    camera.addComponent("camera", {
	        clearColor: new pc.Color(0.2, 0.2, 0.2),
	    });

	    // Add the new Entity to the hierarchy
	    this.app.root.addChild(camera);

	    // Position the camera
	    camera.translate(0, 5, 20);
	    camera.lookAt(pc.Vec3.ZERO);


	 
	    // create material
	    const material = new pc.StandardMaterial();
	        // console.warn("this.assets", this.assets);
	        // material.diffuseMap = assets.playcanvasGrey.resource;
	        // Update the material's diffuse and specular properties
	        material.diffuse.set(255, 0, 0);
	        material.specular.set(1, 1, 1);
	    material.shininess = 50;
	    material.metalness = 0.3;
	    material.useMetalness = true;
	    material.cull = pc.CULLFACE_NONE; // front and back face visible (https://developer.playcanvas.com/en/api/pc.Material.html#cull)
	    material.update();



	    // MESH
            
            var positions = new Float32Array(meshPositions);
            var uvs = new Float32Array(meshUvs);    
    
    
            const mesh = new pc.Mesh(this.app.graphicsDevice);
            mesh.clear(true, false);
            mesh.setPositions(positions);
            mesh.setNormals(pc.calculateNormals(positions, meshIndices));
            mesh.setUvs(0, uvs);
            mesh.setIndices(meshIndices);
            mesh.update(pc.PRIMITIVE_TRIANGLES);

             


		            // var positions = new Float32Array(meshPositions);
		            // var uvs = new Float32Array(meshUvs);
		            // var indexArray = meshIndices;
		    
		    
		    
		            // const mesh = new pc.Mesh(this.app.graphicsDevice);
		            // mesh.clear(true, false);
		            // mesh.setPositions(positions);
		            // mesh.setNormals(pc.calculateNormals(positions, indexArray));
		            // mesh.setUvs(0, uvs);
		            // mesh.setIndices(indexArray);
		            // mesh.update(pc.PRIMITIVE_TRIANGLES);

		            //  // Create the mesh instance
		            // const meshInst = new pc.MeshInstance(mesh, material);

		            // // Create the entity with render component using meshInst
		            // const ent = new pc.Entity();
		            // ent.addComponent("render", {
		            //     meshInstances: [meshInst],
		            // });

		            // // Add entity to root
		            // this.app.root.addChild(ent);	
            


    	// MORPH

            // create a morph target - https://developer.playcanvas.com/api/pc.MorphTarget.html
            
            const morphTargets = [];

            for (var i = 0; i < meshMorphPositions.length; i++) {
            	// meshMorphPositions[i]
           
                const morphPositions = new Float32Array(meshMorphPositions[i]);

                const morphNormals = new Float32Array(
                    pc.calculateNormals(morphPositions, meshIndices)
                );
                
                const morphTarget =  new pc.MorphTarget({
                    deltaPositions: morphPositions,
                    deltaNormals: morphNormals,
                    defaultWeight: 0
                });  

                morphTargets.push(morphTarget);
            };

				// TEST
					
					// const morphPositions = new Float32Array(meshMorphPositions);

					// const morphNormals = new Float32Array(
					// 	pc.calculateNormals(morphPositions, meshUvs)
					// );
					// const morphTarget = createMorphTarget(morphPositions, morphNormals, meshIndices, 0, 0, 0);

                //console.warn("morphTarget",test);

            // create a morph using these 3 targets
            // mesh.morph = new pc.Morph([morphTarget], this.app.graphicsDevice);
            mesh.morph = new pc.Morph(morphTargets, this.app.graphicsDevice);


            // add morph instance - this is where currently set weights are stored
            const morphInstance = new pc.MorphInstance(mesh.morph);
            // meshInstance.morphInstance = morphInstance;    


    	// Add 

            // Create the mesh instance
            const meshInst = new pc.MeshInstance(mesh, material);

            // Add morph instance
            meshInst.morphInstance = morphInstance; 

            // Create the entity with render component using meshInst
            this.ent = new pc.Entity();
            this.ent.addComponent("render", {
                meshInstances: [meshInst],
            });

            // Add entity to root
            this.app.root.addChild(this.ent);

            console.log("root",this.app.root); 

          //   setTimeout(function() {        
                
          //       console.warn("morphInstance.getWeight", morphInstance.getWeight(0));
          //       morphInstance.setWeight(0,1);

          //       // var pa = [];
          //       // mesh.getPositions(0, pa)
          //       // console.error("positions", pa);

          //    //    const pa = [];
          //   	// var p = this.app.root._children[1].render._meshInstances[0]._mesh.getPositions(pa);
          //   	// console.info("key getIndices",this.app.root._children[1].render._meshInstances[0]._mesh, pa);


          //   	// const ppositions = this.app.root._children[1].render._meshInstances[0]._mesh._morph.targets[0].deltaPositions;

          //   	// // var ppositions = new Float32Array(pa);
          //   	// mesh.clear(true, false);
	         //    // mesh.setPositions(ppositions);
	         //    // mesh.setNormals(pc.calculateNormals(ppositions, meshIndices));
	         //    // mesh.setUvs(0, uvs);
	         //    // mesh.setIndices(meshIndices);
	         //    // mesh.update(pc.PRIMITIVE_TRIANGLES);


	         //   //  mesh.clear(true, false);
          //   // mesh.setPositions(positions);
          //   // mesh.setNormals(pc.calculateNormals(positions, meshIndices));
          //   // mesh.setUvs(0, uvs);
          //   // mesh.setIndices(meshIndices);
          //   // mesh.update(pc.PRIMITIVE_TRIANGLES);
                
          //       // morphInstance.update();
          //       // mesh.update(pc.PRIMITIVE_TRIANGLES);

          //       // Set updated positions and normal each frame
		        // // mesh.setPositions(meshPositions);
		        // // mesh.setNormals(pc.calculateNormals(meshPositions, meshIndices));

		        // // // update mesh Uvs and Indices only one time, as they do not change each frame
		        // // //if (initAll) {
		        // //     mesh.setUvs(0, meshUvs);
		        // //     mesh.setIndices(meshIndices);
		        // // //}

		        // // // Let mesh update Vertex and Index buffer as needed
		        // // mesh.update(pc.PRIMITIVE_TRIANGLES);

          //   }.bind(this), 3000);  

	}

	rotateBlades(dt) {

        // Rotate 360 deg in x,y,z 
        
            // Reset angle and dimmension
            if (this.rotDeg === 360) {

                this.rotDeg = 0;
                this.rotIdx++;

                if (this.rotIdx > 2) {
                    this.rotIdx = 0;
                }

            } else {

                this.rotDeg++;

            }
        
            // Select angle
            switch(this.rotIdx) {
                case 0:
                    this.ent.rotateLocal(1, 0, 0);
                    break;
                case 1:
                    this.ent.rotateLocal(0, 1, 0);
                    break;
                case 2: 
                    this.ent.rotateLocal(0, 0, 1);
                    break;
            }
        
        // Change morph weight
            if (this.morphWeight<100) {
                this.morphWeight++;

                if (this.morphTarget>9) {
                	this.morphTarget = 0;
                }

                this.ent.render._meshInstances[0]._morphInstance.setWeight(this.morphTarget,this.morphWeight/100);    

            } else if (this.morphWeight<=200) {
                this.morphWeight++;

                this.ent.render._meshInstances[0]._morphInstance.setWeight(this.morphTarget,(200-this.morphWeight)/100);
            } else {

                this.morphWeight = 0;   

                this.morphTarget++;
            }

        // var e = this.ent.getLocalEulerAngles();
        // //this.ent.setLocalEulerAngles(e.x, e.y, e.z+1);

        // if (e.y<=90) {
        //     console.log("e.y+1", e.y+1);

        //     this.ent.setLocalEulerAngles(e.x, 145, e.z);
        // }

        // // this.ent.setLocalEulerAngles(e.x+1, e.y, e.z);
        // 
	};


	/**
	 * TEST 01
	 */


		testMesh_01() {
			console.log("test mesh 01");    

		    // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
		    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
		    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

		    this.app.scene.ambientLight = new pc.Color(0.1, 0.1, 0.1);

		    this.app.scene.ambientLight = new pc.Color(0.1, 0.1, 0.1);

		    

		    // create 4 lights that will move in the scene and deform the mesh as well
		    this.lights = [
		        {
		            radius: 7,
		            speed: 1,
		            scale: 2.5,
		            light: this.createLight(new pc.Color(0.3, 0.9, 0.6), 1.0),
		        },
		        {
		            radius: 3,
		            speed: 1.2,
		            scale: 3.0,
		            light: this.createLight(new pc.Color(0.7, 0.2, 0.3), 1.3),
		        },
		        {
		            radius: 5,
		            speed: -0.8,
		            scale: 4.0,
		            light: this.createLight(new pc.Color(0.2, 0.2, 0.9), 1.5),
		        },
		        {
		            radius: 4,
		            speed: -0.3,
		            scale: 5.5,
		            light: this.createLight(new pc.Color(0.8, 0.9, 0.4), 1.7),
		        },
		    ];

		    // Create an Entity with a camera component
		    const camera = new pc.Entity();
		    camera.addComponent("camera", {
		        clearColor: new pc.Color(0.2, 0.2, 0.2),
		    });

		    // Add the new Entity to the hierarchy
		    this.app.root.addChild(camera);

		    // Position the camera
		    camera.translate(0, 5, 20);
		    camera.lookAt(pc.Vec3.ZERO);

		    // Generate a 3D grid plane with world size of 20, and resolution of 60
		    this.resolution = 60;
		    const extent = 20;
		    const scale = extent / this.resolution;

		    // Generate positions and uv coordinates for verticies, store them in Float32Arrays
		    this.positions = new Float32Array(3 * this.resolution * this.resolution);
		    this.uvs = new Float32Array(2 * this.resolution * this.resolution);
		    let index = 0;
		    for (let x = 0; x < this.resolution; x++) {
		        for (let z = 0; z < this.resolution; z++) {
		            this.positions[3 * index] = scale * (x - this.resolution * 0.5);
		            this.positions[3 * index + 1] = 0; // no elevation, flat grid
		            this.positions[3 * index + 2] = scale * (z - this.resolution * 0.5);
		            this.uvs[2 * index] = x / this.resolution;
		            this.uvs[2 * index + 1] = 1 - z / this.resolution;
		            index++;
		        }
		    }

		    // Generate array of indicies to form triangle list - two triangles per grid square
		    this.indexArray = [];
		    for (let x = 0; x < this.resolution - 1; x++) {
		        for (let y = 0; y < this.resolution - 1; y++) {
		            this.indexArray.push(
		                x * this.resolution + y + 1,
		                (x + 1) * this.resolution + y,
		                x * this.resolution + y,
		                (x + 1) * this.resolution + y,
		                x * this.resolution + y + 1,
		                (x + 1) * this.resolution + y + 1
		            );
		        }
		    }  

		    // Create a mesh with dynamic vertex buffer and static index buffer
		    this.mesh = new pc.Mesh(this.app.graphicsDevice);
		    this.mesh.clear(true, false);
		    this.updateMesh(true);

		    // create material
		    const material = new pc.StandardMaterial();
		        // console.warn("assets", assets);
		        // console.warn("this.assets", this.assets);
		        // material.diffuseMap = assets.playcanvasGrey.resource;
		    material.shininess = 50;
		    material.metalness = 0.3;
		    material.useMetalness = true;
		    material.update();

		     // Create the mesh instance
		    const meshInstance = new pc.MeshInstance(this.mesh, material);

		    // Create the entity with render component using meshInstances
		    const entity = new pc.Entity();
		    entity.addComponent("render", {
		        meshInstances: [meshInstance],
		    });

		    // Add entity to root
		    this.app.root.addChild(entity);


		    // Time
		    this.time = 0;



		    // Other mesh
		            // const positions =
		            // [
		            //     0, 0, 0,
		            //     3, 0, 0,
		            //     3, 0, 3
		            // ];
		            
		            // const uvs =
		            // [
		            //     0, 0,
		            //     1, 0,
		            //     1, 1
		            // ];
		    
		            // const indices = [ 2,1,0 ];
		            
		                

		            // var positions = new Float32Array([
		            //     0, 0, 0, // pos 0
		            //     1, 0, 0, // pos 1
		            //     1, 1, 0, // pos 2
		            //     0, 1, 0  // pos 3
		            // ]);
		            // var uvs = new Float32Array([
		            //     0, 0, // uv 0
		            //     1, 0, // uv 1
		            //     1, 1, // uv 2
		            //     0, 1  // uv 3
		            // ]);
		            // var indexArray = [
		            //     0, 1, 2, // triangle 0
		            //     0, 2, 3  // triangle 1
		            // ];
		            
		            var positions = new Float32Array(meshPositions);
		            var uvs = new Float32Array(meshUvs);
		            var indexArray = meshIndices;
		    
		    
		    
		            const mesh = new pc.Mesh(this.app.graphicsDevice);
		            mesh.clear(true, false);
		            mesh.setPositions(positions);
		            mesh.setNormals(pc.calculateNormals(positions, indexArray));
		            mesh.setUvs(0, uvs);
		            mesh.setIndices(indexArray);
		            mesh.update(pc.PRIMITIVE_TRIANGLES);

		             // Create the mesh instance
		            const meshInst = new pc.MeshInstance(mesh, material);

		            // Create the entity with render component using meshInst
		            const ent = new pc.Entity();
		            ent.addComponent("render", {
		                meshInstances: [meshInst],
		            });

		            // Add entity to root
		            this.app.root.addChild(ent);

		            console.log(ent);
		}
		createLight(color, scale) {
	    
		    // Create an Entity with a omni light component, which is casting shadows (using rendering to cubemap)
		    const light = new pc.Entity();
		    light.addComponent("light", {
		        type: "omni",
		        color: color,
		        radius: 10,
		        castShadows: false,
		    });

		    // create material of specified color
		    const material = new pc.StandardMaterial();
		    material.emissive = color;
		    material.update();

		    // add sphere at the position of light
		    light.addComponent("render", {
		        type: "sphere",
		        material: material,
		    });

		    // Scale the sphere
		    light.setLocalScale(scale, scale, scale);

		    this.app.root.addChild(light);
		    return light;

		}
		updateMesh(initAll) {
	        // Set updated positions and normal each frame
	        this.mesh.setPositions(this.positions);
	        this.mesh.setNormals(pc.calculateNormals(this.positions, this.indexArray));

	        // update mesh Uvs and Indices only one time, as they do not change each frame
	        if (initAll) {
	            this.mesh.setUvs(0, this.uvs);
	            this.mesh.setIndices(this.indexArray);
	        }

	        // Let mesh update Vertex and Index buffer as needed
	        this.mesh.update(pc.PRIMITIVE_TRIANGLES);
		}
		testMesh_01_update(dt) {

	    	this.time += dt;

	        // Move the lights along circles, also keep separate list of their position for faster update in next block of code
	        const lightPositions = [];
	        for (let l = 0; l < this.lights.length; l++) {
	            const element = this.lights[l];
	            const lightPos = new pc.Vec2(
	                element.radius * Math.sin(this.time * element.speed),
	                element.radius * Math.cos(this.time * element.speed)
	            );
	            lightPositions.push(lightPos);
	            element.light.setLocalPosition(lightPos.x, 3, lightPos.y);
	        }

	        // animate .y coordinate of grid vertices by moving them up when lights are close
	        let index = 0;
	        for (let x = 0; x < this.resolution; x++) {
	            for (let z = 0; z < this.resolution; z++) {
	                let elevation = 0;

	                // Evaluate distance of grid vertex to each light position, and increase elevation if light is within the range
	                for (let l = 0; l < lightPositions.length; l++) {
	                    const dx = this.positions[index] - lightPositions[l].x;
	                    const dz = this.positions[index + 2] - lightPositions[l].y;
	                    let dist = Math.sqrt(dx * dx + dz * dz);
	                    dist = pc.math.clamp(dist, 0, this.lights[l].scale);
	                    dist = pc.math.smoothstep(0, this.lights[l].scale, dist);
	                    elevation += 1 - dist;
	                }

	                // Store elevation in .y element
	                this.positions[index + 1] = elevation;
	                index += 3;
	            }
	        }

	        // update the mesh
	        this.updateMesh();
		}

}



// helper function to return the shortest distance from point [x, y, z] to a plane defined by [a, b, c] normal
    const shortestDistance = function (x, y, z, a, b, c) {
        const d = Math.abs(a * x + b * y + c * z);
        const e = Math.sqrt(a * a + b * b + c * c);
        return d / e;
    };

    // helper function that creates a morph target from original positions, normals and indices, and a plane normal [nx, ny, nz]
    const createMorphTarget = function (
        positions,
        normals,
        indices,
        nx,
        ny,
        nz
    ) {
        // modify vertices to separate array
        const modifiedPositions = new Float32Array(positions.length);
        let dist, i, displacement;
        const limit = 0.2;
        for (i = 0; i < positions.length; i += 3) {
            // distance of the point to the specified plane
            dist = shortestDistance(
                positions[i],
                positions[i + 1],
                positions[i + 2],
                nx,
                ny,
                nz
            );

            // modify distance to displacement amount - displace nearby points more than distant points
            displacement = pc.math.smoothstep(0, limit, dist);
            displacement = 1 - displacement;

            // generate new position by extruding vertex along normal by displacement
            modifiedPositions[i] = positions[i] + normals[i] * displacement;
            modifiedPositions[i + 1] =
                positions[i + 1] + normals[i + 1] * displacement;
            modifiedPositions[i + 2] =
                positions[i + 2] + normals[i + 2] * displacement;
        }

        // generate normals based on modified positions and indices
        // @ts-ignore engine-tsd
        const modifiedNormals = new Float32Array(
            pc.calculateNormals(modifiedPositions, indices)
        );

        // generate delta positions and normals - as morph targets store delta between base position / normal and modified position / normal
        for (i = 0; i < modifiedNormals.length; i++) {
            modifiedPositions[i] -= positions[i];
            modifiedNormals[i] -= normals[i];
        }

        // create a morph target
        // @ts-ignore engine-tsd
        return new pc.MorphTarget({
            deltaPositions: modifiedPositions,
            deltaNormals: modifiedNormals,
        });
    };