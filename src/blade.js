import {
			Mesh, 
			calculateNormals, 
			PRIMITIVE_TRIANGLES,
			MorphTarget,
			Morph,
			MorphInstance,
			MeshInstance,
			Entity,
			Quat
		} from 'playcanvas';


import {meshPositions, meshIndices, meshUvs, meshMorphPositions } from './model';
import Material from './material';
import { defaultColors } from './colors';
import BladeControls from './bladecontrols';

export default class Blade {


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
				,graphicsDevice
				,controls
				,meshMorphsIndex
				,bladeRotationOffset
				,bladeRotation
			} = props;	    	
			this.name = name;
			this.graphicsDevice = graphicsDevice;
			this.meshMorphsIndex = meshMorphsIndex;
			this.bladeRotationOffset = bladeRotationOffset;
			this.bladeRotation = bladeRotation

			// Create Material
			this.material = new Material({color:defaultColors[this.name] || defaultColors['blank']});


			// Rotation
			this.rotation = {
				x: 0,
				y: 0,
				z: 0
			};
			this.quads = {	
				x: new Quat()
				,y: new Quat()
				,z: new Quat()
				,f: new Quat()
			};

			// Create Controls
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

			// Create Mesh
			this.createMesh();

			// Create MorphTargets
			this.createMorphTargets();

			// Create MorphInstance
			this.createMorphInstance();

			// Create MeshInstance
			this.createMeshInstance();

			// Create Entity
			this.createEntity();			

			// Set Initial Rotateion
	        this.setRotation(this.bladeRotation);

			// Create Controls
			this.createControls();

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
		 * [getMorphTargetsCount description]
		 * @return {[type]} [description]
		 */
		getMorphTargetsCount() {
			return this.morphTargets.length;
		}

		/**
		 * [getMeshMorphsIndex description]
		 * @return {[type]} [description]
		 */
		getMeshMorphsIndex() {
			return this.meshMorphsIndex;
		}

		/**
		 * [getControls description]
		 * @param  {[type]} opt_key [description]
		 * @return {[type]}         [description]
		 */
		getControls(opt_key) {
			return this.controls.getControls(opt_key);
		}

		/**
		 * [setRotation description]
		 * @param {[type]} coords      [description]
		 * @param {[type]} opt_control [description]
		 */
		setRotation(coords, opt_control) {

			// Update Rotation
			this.rotation = { ...this.rotation, ...coords };

			if (opt_control !== undefined && this.hasControls) {
				// Via controls
				this.controls.getControls().observers[opt_control].observer.set('progress', this.rotation[opt_control]); 
			} else {

				// Calculate		        
		        this.quads.y.setFromEulerAngles(0, this.rotation.y, 0);
		        this.quads.x.setFromEulerAngles(this.rotation.x, 0, 0);
		        this.quads.z.setFromEulerAngles(0, 0, this.rotation.z);
		        this.quads.f.setFromEulerAngles(0, 0, 0);
		        this.quads.f.mul(this.quads.y).mul(this.quads.x).mul(this.quads.z);

		        // Set Rotation
		        this.entity.setLocalRotation(this.quads.f);
		    }
		}

		/**
		 * [getRotation description]
		 * @param  {[type]} opt_key [description]
		 * @return {[type]}         [description]
		 */
		getRotation(opt_key) {
			return (opt_key!==undefined)?this.rotation[opt_key]:this.rotation;
			// return this.entity.getLocalRotation();
			// return this.entity.getLocalEulerAngles();
		}

		getBladeRotation(opt_key) {
			return (opt_key!==undefined)?this.bladeRotation[opt_key]:this.bladeRotation;
			// return this.entity.getLocalRotation();
			// return this.entity.getLocalEulerAngles();
		}


		/**
		 * [updateMorphtarget description]
		 * @param  {[type]} idx         [description]
		 * @param  {[type]} weight      [description]
		 * @param  {[type]} opt_control [description]
		 * @return {[type]}             [description]
		 */
		updateMorphtarget(idx,weight,opt_control) {

			// Change Morph Weight		
			if (opt_control !== undefined && this.hasControls) {
				// Via controls
				this.controls.getControls().observers[opt_control].observer.set('progress', weight); 
			} else {
				// Directly
				this.morphInstance.setWeight(idx,weight);	
			}

		}


	////////////////////////
	// METHODS
	////////////////////////

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
		 * [createMorphTargets description]
		 * @return {[type]} [description]
		 */
		createMorphTargets() {

			this.morphTargets = [];

	        for (var i = 0; i < meshMorphPositions.length; i++) {
	   
	            const morphPositions = new Float32Array(meshMorphPositions[i]);

	            const morphNormals = new Float32Array(
	                calculateNormals(morphPositions, meshIndices)
	            );
	            
	            const morphTarget =  new MorphTarget({
	                deltaPositions: morphPositions,
	                deltaNormals: morphNormals,
	                defaultWeight: 0
	            });  

	            this.morphTargets.push(morphTarget);
	        }

		}

		/**
		 * [createMorphInstance description]
		 * @return {[type]} [description]
		 */
		createMorphInstance() {

			this.mesh.morph = new Morph(this.morphTargets, this.graphicsDevice);
			this.morphInstance = new MorphInstance(this.mesh.morph);

		}


		/**
		 * [createMeshInstance description]
		 * @return {[type]} [description]
		 */
		createMeshInstance() {

			// reate the mesh instance
			this.meshInstance = new MeshInstance(this.mesh, this.material.getMaterial());

			// Add morph instance
			this.meshInstance.morphInstance = this.morphInstance; 

		}

		/**
		 * [createEntity description]
		 * @return {[type]} [description]
		 */
		createEntity() {

			this.entity = new Entity();
			this.entity.name = this.name;
			this.entity.addComponent("render", {
			    meshInstances: [this.meshInstance],
			});

		}

		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createControls() {

			// Has UI
			if (this.hasControls === true) {
			
				this.controls = new BladeControls({
					name: this.name
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationOffset: this.bladeRotationOffset
					,bladeRotation: this.bladeRotation
				});

			}

		}
}