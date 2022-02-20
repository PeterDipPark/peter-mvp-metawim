import {
			Mesh, 
			calculateNormals, 
			PRIMITIVE_TRIANGLES,
			MorphTarget,
			Morph,
			MorphInstance,
			MeshInstance,
			Entity
		} from 'playcanvas';

import {meshPositions, meshIndices, meshUvs, meshMorphPositions} from './model';
import Material from './material';
import { defaultColors } from './colors';


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
			
			// Super
			const { name, graphicsDevice } = props;
	    	
			// Props
			this.name = name;
			this.graphicsDevice = graphicsDevice;


			// Create Material
			this.material = new Material({color:defaultColors[this.name] || defaultColors['blank']});

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
		 * [setRotation description]
		 * @param {[type]} coords [description]
		 */
		setRotation(coords) {
			this.entity.rotateLocal(coords.z, coords.y, coords.x);
			// this.entity.rotate(coords.z, coords.y, coords.x);
		}

		updateMorphtarget(idx,weight, opt_ent) {

			// console.warn("change mt ["+idx+"] from:", this.morphInstance.getWeight(idx), "to:", weight);
			this.morphInstance.setWeight(idx,weight);

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
}