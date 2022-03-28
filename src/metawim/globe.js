import {
			Mesh, 
			calculateNormals, 
			PRIMITIVE_TRIANGLES,
			MeshInstance,
			Entity,
			Layer,
			SORTMODE_MANUAL,
			StandardMaterial,
			Material,
			BLEND_PREMULTIPLIED,
		} from 'playcanvas';


import {meshPositions, meshIndices, meshUvs } from './modelglobe';
import { fixFloat } from './utils'

export default class Globe {


	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		/**
		 * [constructor description]
		 * @param  {...[type]} options.props [description]
		 * @return {[type]}                  [description]
		 */
		constructor({...props}) {

			// Props
			const { 
				name
				,index
				,layers
				,graphicsDevice
				,controls
				,useLayers
				,blades
			} = props;	    	
			this.name = name;
			this.index = index;
			this.layers = layers;
			this.graphicsDevice = graphicsDevice;
			this.useLayers = useLayers || false;
			this.blades = blades;

			// Material
			this.material = null;

			// Scripts
			this.scripts = null;

			// Controls
			this.hasControls = (controls === true);
			this.controls = null;

			// Init
			this.init();
	        
		}

	////////////////////////
	// INITIALIZE
	////////////////////////

		/**
		 * [init description]
		 * @return {[type]} [description]
		 */
		init() {

			// Create Material
			this.createMaterial();

			// Create Mesh
			this.createMesh();

			// // Create MeshInstance
			this.createMeshInstance();

			// Create Entity
			this.createEntity();

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		/**
		 * [getEntity description]
		 * @return {[type]} [description]
		 */
		getEntity() {
			return this.entity;
		}

		/**
		 * [getScripts description]
		 * @return {[type]} [description]
		 */
		getScripts() {			
			return this.scripts;
		}

		

	////////////////////////
	// METHODS
	////////////////////////

		/**
		 * [createMaterial description]
		 * @return {[type]} [description]
		 */
		createMaterial() {

			// Instance
			this.material = new StandardMaterial();

			// Props
			this.material.diffuse.set(1, 1, 1);
			this.material.blendType = BLEND_PREMULTIPLIED;
			this.material.opacity = 0.1;
			this.material.depthTest = true;
			this.material.depthWrite = true;

			// TEST
			this.material.bumpiness = 0;
			this.material.shininess = 50;
			this.material.metalness = 0.3;
			this.material.glossiness = 100;
			this.material.useMetalness = true;

			// Update
			this.material.update();

		}


		/**
		 * [createMesh description]
		 * @return {[type]} [description]
		 */
		createMesh() {


			// Postions
			const positions = new Float32Array(meshPositions);
	        const uvs = new Float32Array(meshUvs);   


			this.mesh = new Mesh(this.graphicsDevice);
	        this.mesh.clear(true, false);
	        this.mesh.setPositions(positions);
	        this.mesh.setNormals(calculateNormals(positions, meshIndices));
	        this.mesh.setUvs(0, uvs);
	        this.mesh.setIndices(meshIndices);
	        this.mesh.update(PRIMITIVE_TRIANGLES);

		}


		/**
		 * [createMeshInstance description]
		 * @return {[type]} [description]
		 */
		createMeshInstance() {


			// Create the mesh instance
			this.meshInstance = new MeshInstance(this.mesh, this.material); 

			console.log(this.meshInstance);
			// this.meshInstance.lightmapped = true;
			// this.meshInstance.recieveShadows = true;


			// TRANSPARENCY DEPTH PATCH
				
				//  WORKING when useLayers === false BUT doesn't work for tilted meshes
					this.meshInstance.calculateSortDistance = function(meshInstance, cameraPosition, cameraForward) {
						return this.index;
					}.bind(this);
			
		}

		/**
		 * [createEntity description]
		 * @return {[type]} [description]
		 */
		createEntity() {

			if (this.useLayers === true) {

				// get the world layer index
	    		const worldLayer = this.layers.getLayerByName("World");
	    		const idx = this.layers.getTransparentIndex(worldLayer);

				// Create Custom Layer that will holde the entity
					this.layer = new Layer();
					this.layer.id = this.layer.name = this.name;
					this.layer.opaqueSortMode = SORTMODE_MANUAL;
					this.layer.transparentSortMode = SORTMODE_MANUAL;
					// this.layer.passThrough = true;
					// this.layer.clearDepthBuffer = true;
					// this.layer.shaderPass = SHADER_DEPTH;
					this.layers.insert(this.layer, idx+1);

				// Create Entity
					this.entity = new Entity();
					this.entity.name = this.name;
					this.entity.addComponent("render", {
					    meshInstances: [this.meshInstance],
					});

				// Add Cutom layer to Entity
					this.entity.render.layers = [this.layer.id];

			} else {

				// Create Entity
					this.entity = new Entity();
					this.entity.name = this.name;
					this.entity.addComponent("render", {
					    meshInstances: [this.meshInstance],
					});

			}

			// PUSH in Z-dir so we are the center of blades z direction
				const bladesCount = Object.values(this.blades).length;
				this.entity.translate(0, 0, -fixFloat(((bladesCount/2))/1000));			
		
		}
}