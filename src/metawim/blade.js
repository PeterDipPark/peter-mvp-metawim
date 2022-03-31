import {
			Mesh, 
			calculateNormals, 
			PRIMITIVE_TRIANGLES,
			MorphTarget,
			Morph,
			MorphInstance,
			MeshInstance,
			Entity,
			Quat,			
			Layer,
			SORTMODE_MANUAL,
			Vec3,
			BoundingSphere,
			Ray,
			Color,
			Mat4,
			// TEST
				// BLEND_NONE,
				// BLEND_NORMAL,
				// BLEND_PREMULTIPLIED,
				// BLEND_ADDITIVEALPHA,
				// BLEND_ADDITIVE,
				// BLEND_SCREEN,
				// SORTMODE_NONE,
				// SORTMODE_MATERIALMESH,
				// SORTMODE_BACK2FRONT,
				// SORTMODE_FRONT2BACK,
				// SHADER_DEPTH,
				// SHADER_FORWARDHDR,						
		} from 'playcanvas';


import {meshPositions, meshIndices, meshUvs, meshMorphPositions } from './modelblade';
import Material from './material';
import { defaultColors } from './colors';
import BladeControls from './bladecontrols';
import { fixFloat } from './utils'

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
				,index
				,layers
				,graphicsDevice
				,controls
				,meshMorphsIndex
				,bladeRotationOffset
				,bladeRotation
				,useLayers
			} = props;	    	
			this.name = name;
			this.index = index;
			this.layers = layers;
			this.graphicsDevice = graphicsDevice;
			this.meshMorphsIndex = meshMorphsIndex;
			this.bladeRotationOffset = bladeRotationOffset;
			this.bladeRotation = bladeRotation;
			this.useLayers = useLayers || false;


			// Label
			this.bladeLabelText = this.name;
			this.bladeLabelEnabled =  {
				info: false,
				axis: false,
			}

				// Temp - test labels
				if (this.name === "blade1") {
					this.bladeLabelEnabled.axis = true;
				}
				if (this.name === "blade4") {
					this.bladeLabelEnabled.info = true;
				}

			this.bladeLabelVerticalsText = {
				"-x": 	this.name+" -x",
				"x": 	this.name+" x",				
				"-y": 	this.name+" -y",
				"y": 	this.name+" y",
				"-z": 	this.name+" -z",				
				"z": 	this.name+" z",				
			}
			this.bladeLabelVerticals = {
				x: new Quat(),
				y: new Quat(),
				z: new Quat()
			}

			// Label Postion - Ray intersection Spehere			
			this.intersectEdgeSphere = new BoundingSphere(new Vec3(0,0,this.tz), 2.15);
			this.intersectEdgeSphereOffset = 1.395348837;

			// Create Material
			this.material = new Material({
				color:defaultColors[this.name] || defaultColors['blank']
				,depth: this.index
				,graphicsDevice: this.graphicsDevice
			});


			// Morphing
			this.morphing = this.meshMorphsIndex.reduce((acc,curr)=> (acc[curr.id]=0,acc),{}); // default is 0

			// Z transalation
			this.tz = -fixFloat(this.index/1000);

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
		
			if (opt_control !== undefined && this.hasControls) {
				// Via controls
				if (Array.isArray(opt_control)) {
					for (var i = 0; i < opt_control.length; i++) {
						this.controls.getControls().observers[opt_control[i]].observer.set('progress', coords[opt_control[i]]);
					};
				} else {
					this.controls.getControls().observers[opt_control].observer.set('progress', coords[opt_control]); 
				}
			} else {

				// Update Rotation
				this.rotation = { ...this.rotation, ...coords };					

				// Calculate		        
		        this.quads.y.setFromEulerAngles(0, this.rotation.y, 0);
		        this.quads.x.setFromEulerAngles(this.rotation.x, 0, 0);
		        this.quads.z.setFromEulerAngles(0, 0, this.rotation.z);
		        this.quads.f.setFromEulerAngles(0, 0, 0);
		        this.quads.f.mul(this.quads.y).mul(this.quads.x).mul(this.quads.z);

		        // Set Rotation
		        this.entity.setLocalRotation(this.quads.f);
		        
		        // Update Label Verticals
		        this.setLabelVerticals();
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

		/**
		 * [getBladeRotation description]
		 * @param  {[type]} opt_key [description]
		 * @return {[type]}         [description]
		 */
		getBladeRotation(opt_key) {
			return (opt_key!==undefined)?this.bladeRotation[opt_key]:this.bladeRotation;
			// return this.entity.getLocalRotation();
			// return this.entity.getLocalEulerAngles();
		}

		/**
		 * [getStateRotation description]
		 * @return {[type]} [description]
		 */
		getStateRotation() {
			return this.rotation;
		}

		/**
		 * [getStateMorphing description]
		 * @return {[type]} [description]
		 */
		getStateMorphing() {
			return this.morphing;
		}


		/**
		 * [updateMorphtarget description]
		 * @param  {[type]} index        [description]
		 * @param  {[type]} weight      [description]
		 * @param  {[type]} opt_control [description]
		 * @return {[type]}             [description]
		 */
		updateMorphtarget(index,weight,opt_control) {

			

			// Change Morph Weight		
			if (opt_control !== undefined && this.hasControls) {
				// Via controls
				this.controls.getControls().observers[opt_control].observer.set('progress', weight); 
			} else {

				// Update Morphing
				this.morphing[this.meshMorphsIndex.find( ({ idx }) => idx === index ).id] = weight;

				// Directly
				this.morphInstance.setWeight(index,weight);	
			}

		}

		/**
		 * [setDepth description]
		 * @param {[type]} d [description]
		 */
		setDepth(d) {
			// Set
				this.meshInstance.material.depthTest = this.meshInstance.material.depthWrite = d==="e"?true:false;
			
			// Update
				this.meshInstance.material.update();


		}

		/**
		 * [setOpacity description]
		 * @param {[type]} v [description]
		 */
		setOpacity(v) {
			// Set
				this.meshInstance.material.opacity = v===1?0.999:v;
				// this.meshInstance.material.alphaFade = v===1?0.999:v; // use when opacityFadesSpecular === false;			

			// Update
				this.meshInstance.material.update();

		}

		/**
		 * [translateBlade description]
		 * @param  {[type]} v [description]
		 * @return {[type]}   [description]
		 */
		translateBlade(v) {

			// Translate Entity
			const p = this.entity.getPosition();
			const s = Math.abs(v) < 1 ? (v<0?-1:1) : v;			
			this.entity.setPosition(p.x, p.y, -(fixFloat(this.index/1000)*s));

			// Translate Bounding Sphere
			this.intersectEdgeSphere.center.copy(this.entity.getPosition());
		}

		/**
		 * [getLabelPosition description]
		 * @return {[type]} [description]
		 */
		getLabelPosition() {		
			
			// Get Edge
			const edge = this.getLabelEdgePosition();
			if (edge === null) return null;

			// Offset Labels
			const offset = new Vec3(); 
			offset.copy(edge);
			offset.mulScalar(this.intersectEdgeSphereOffset);

			// Return offset point
			return offset;			

		}

		/**
		 * [getLabelEdgePosition description]
		 * @return {[type]} [description]
		 */
		getLabelEdgePosition() {		
			
			// Ray from entity center through meshInstance 
			const p = this.entity.getPosition();
			const c = this.meshInstance.aabb.center;
			const r = new Vec3();
			r.sub2(c, p);
			const ray = new Ray(p, r);
			// Point to receive intersection
			let point = new Vec3(0,0,0);
			// Sphere to intersect
			const interects = this.intersectEdgeSphere.intersectsRay(ray, point);
			// Return
			return (interects===true)?point:null;

		}

		/**
		 * [getLabelVerticals description]
		 * @param  {[type]} opt_axis [description]
		 * @return {[type]}          [description]
		 */
		getLabelVerticals(opt_axis) {
			return (opt_axis)?this.bladeLabelVerticals[opt_axis]:this.bladeLabelVerticals;
		}

		/**
		 * [setLabelVerticals description]
		 */
		setLabelVerticals() {

			// Intersection point for label
			const p = this.getLabelPosition();

			// X
			this.bladeLabelVerticals.x = new Vec3().copy(p);

			// Y
			const qz = new Mat4().setFromAxisAngle(this.entity.up, -90);			
			this.bladeLabelVerticals.y = qz.transformPoint(p);

			// Z
			const qy = new Mat4().setFromAxisAngle(this.entity.forward, -90);			
			this.bladeLabelVerticals.z = qy.transformPoint(p);

		}

		/**
		 * [setLabelText description]
		 * @param {[type]} s [description]
		 */
		setLabelText(s) {
			this.bladeLabelText = s;
		}

		/**
		 * [getLabelText description]
		 * @return {[type]} [description]
		 */
		getLabelText() {
			return this.bladeLabelText;
		}

		/**
		 * [setLabelVerticlasText description]
		 * @param {[type]} s            [description]
		 * @param {[type]} opt_vertical [description]
		 */
		setLabelVerticlasText(s, opt_vertical) {
			if (opt_vertical) {
				this.bladeLabelVerticalsText[opt_vertical] = s;
			} else {
				this.bladeLabelVerticalsText = s; // object
			}
		}

		/**
		 * [getLabelVerticlasText description]
		 * @param  {[type]} opt_vertical [description]
		 * @return {[type]}              [description]
		 */
		getLabelVerticlasText(opt_vertical) {
			return (opt_vertical)?this.bladeLabelVerticalsText[opt_vertical]:this.bladeLabelVerticalsText;
		}

		/**
		 * [setLabelEnabled description]
		 * @param {[type]} b [description]
		 */
		setLabelEnabled(type, b) {
			this.bladeLabelEnabled[type] = (b === true)
		}

		/**
		 * [getLabelEnabled description]
		 * @return {[type]} [description]
		 */
		getLabelEnabled(opt_type) {
			return (opt_type)?this.bladeLabelEnabled[opt_type]:this.bladeLabelEnabled;
		}


		// setCamarePosition(p) {
		// 	// Revert camera Y
		// 	p.y *=-1;		
		// 	this.cameraPosition = p;
		// }
		// getCameraPosition() {
		// 	return this.cameraPosition;
		// }
		// setCameraDirection(b) {
		// 	this.cameraDirection = b;			
		// }
		// getCameraDirection() {

		// 	// return this.cameraDirection;

		// 	const origin = this.getLabelPostion();
		// 	const ray = new Ray(origin, new Vec3(origin.x,origin.y,-20));
		// 	let point = new Vec3(0,0,0);
		// 	const interects = this.intersectOpacitySphere.intersectsRay(ray, point);
		// 	// 
		// 	// if (interects === true) {
		// 	// 	console.log(point);
		// 	// }
		// 	return interects;

		// 	return point;

		// 	// return this.cameraDirection;
		// }

		

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

			// TRANSPARENCY DEPTH PATCH
				
				//  WORKING when useLayers === false BUT doesn't work for tilted meshes
					if (this.useLayers !== true) {

						this.meshInstance.calculateSortDistance = function(meshInstance, cameraPosition, cameraForward) {
							// console.log(cameraPosition, cameraForward);
							// this.setCamarePosition(cameraForward);
							// this.setCameraDirection(cameraPosition.z);
							const z = this.entity.getPosition().z < 0 ? 1:-1;
							return cameraPosition.z>cameraForward.z? z*this.index:z*-this.index;
						}.bind(this);
					}
		
				// TBD				
					// this.meshInstance.calculateSortDistance = function(meshInstance, cameraPosition, cameraForward) {
					// 	//console.log(cameraPosition, cameraForward);
					// 	this.meshInstance.drawOrder = cameraPosition.z>cameraForward.z?-this.index:this.index;
					// 	return cameraPosition.z>cameraForward.z?this.index:-this.index;
					// }.bind(this);
				

			// Add morph instance
			this.meshInstance.morphInstance = this.morphInstance; 

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

			// PUSH in Z-dir so we stack blades

				this.entity.translate(0, 0, this.tz);

			// SET label verticals
				
				this.setLabelVerticals();
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