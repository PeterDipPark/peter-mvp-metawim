// PC
import {
	Application,
	FILLMODE_NONE,
	FILLMODE_FILL_WINDOW,
	RESOLUTION_AUTO,
	Mouse,
	TouchDevice,
	Color,
} from 'playcanvas';

// METAWIM
// import Router from './router';
import Blade from './blade';
import Scene from './scene';
import BladeControls from './bladecontrols';
import States from './states';
import { meshMorphs } from './model';
import { fixFloat, sortArrayByNumericValue, exportJson, importJson } from './utils';

export default class MetaWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {
			
			// Super 
				const { canvas, ui, count, pp, algowimControls, onload } = props;			

			// Props
			
				// Onload callback
				this.onload = onload || null;

				// Use Layers (TRY to solve opacity issue)
				this.useLayers = false;

				// Canvas DOM
				this.canvas = canvas;

				// Dev Controls
				this.ui = ui || null;

				// Canvas context (see options at https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
				const gl = canvas.getContext("webgl2", {
					alpha: true
					,antialias: true
					,powerPreference: "high-performance"
					,premultipliedAlpha: true
				});
				// console.warn("gl",gl);
				// gl.alpha = true; // true;

				// App (see options at https://developer.playcanvas.com/en/api/pc.Application.html#Application)
				this.app = new Application(canvas, {
					mouse: new Mouse(canvas.parentElement || canvas)
					,touch: new TouchDevice(canvas.parentElement || canvas)
					,graphicsDeviceOptions: gl
				});
				this.app.root.name = "MetaWim";				

				// Count of blades
				this.count = count || 16;

				// Rotation
				this.rotationOffset = 90; // default offset to correct 0 degrees state (to TOP)
				this.rotationStep = fixFloat(360/this.count);

				// Scene
				this.scene = new Scene({
					app: this.app
					,count: this.count
					,controls: this.ui !== null
					,useLayers: this.useLayers
					,algowimControls: algowimControls || null
				});
				this.app.scene.ambientLight = new Color(1, 1, 1);

				// Blades			
				this.blades = {};
				
				// All (Blades) Controls
				this.meshMorphsIndex = meshMorphs;
				this.allcontrols = null;

				// States
				this.states = new States({
					controls: (this.ui !== null)
				});
				this.lastState = {};

				// Router
				// this.router = new Router({
				// 	pp: pp || null
				// })

			// Init
				this.init();

			// Start
				this.start();

	        
		}


	////////////////////////
	// INITIALIZE
	////////////////////////
	
		/**
		 * [init description]
		 * @return {[type]} [description]
		 */
		init() {			
			
			// Setup Canvas
			this.setupCanvas();

	    	// Create Blades
			this.createBlades();			

			// Create All Controls
			this.createAllControls();


			// TOD0:
			
				/*
					- controls
					- reorder blades
					- test button for action (will simulated socket calls)
					- fx class				
					- scoket listner


				 */
			
				//console.log("this.app.root",this.app.root);
		}


		start() {


			// Add Light
				this.app.root.addChild(this.scene.getLight());

			// Add Camera - DEPRECATED (use script oribitCamera)
				// this.app.root.addChild(this.scene.getCamera());			
		    
		    // Add Scripts			    	
		    	this.app.root.addChild(this.scene.getScripts());		    

	    	// Add Blades
	    		this.addBlades();
	    
	    	// Add Controls
	    		this.addControls();
	    
	    	// Start App
	    		this.app.start();

	    	// Onload
	    	
	    		if (this.onload !== null) {
	    			this.onload("pc");	    			
	    		}
	    		
	    	// Listeners
    			// this.app.on("update", this.update, th
	    		
	    		

	    	// Test
	    		
	    		// var worldLayer = this.app.scene.layers.getLayerByName('World');
    			// // worldLayer.clearDepthBuffer = true;
    			// worldLayer.enabled = false;

    			// var depthLayer = this.app.scene.layers.getLayerByName('Depth');	    	
    			// depthLayer.clearDepthBuffer = true;
    			// depthLayer.enabled = false;
    			
	    		// setTimeout(function () {
	    		// 	this.blades['blade16'].updateMorphtarget(0,1, 'm_Cutout_Left');
	    		// 	// this.app.off();
	    		// }.bind(this), 2000);
				
				// console.log("this.app.scene.layers", this.app.scene.layers);
				// console.log("this.app", this.app);

				// CAMERA and MESHES MATERIAL
					// console.warn(this.scene.getCamera());
					// for (let b in this.blades) {
					// 	console.log(this.blades[b].meshInstance.material);
					// }
					// console.warn(this.scene);
				
				
		}

	////////////////////////
	// CALLBACKS
	////////////////////////
	
		/**
		 * Canvas update
		 * @param  {[type]} dt [description]
		 * @return {[type]}    [description]
		 */
		update(dt) {

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		callAction(action,newValue,oldValue) {

			switch(action) {
				case "pc-orbit-reset":
					// Reset MetaWim Orbit Camera to Initial State
					this.scene.resetCamera();
					break;
			}

		}

	////////////////////////
	// METHODS
	////////////////////////
	
		/**
		 * [setupCanvas description]
		 * @return {[type]} [description]
		 */
		setupCanvas() {

			this.app.setCanvasFillMode(FILLMODE_NONE); // https://developer.playcanvas.com/en/api/pc.Application.html#fillMode
			//this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
	    	this.app.setCanvasResolution(RESOLUTION_AUTO);

		}

		/**
		 * [createBlades description]
		 * @param  {[type]} n [description]
		 * @return {[type]}   [description]
		 */
		createBlades() {

			let blade, name;
			let rot = 0; //this.rotationOffset; // shift to top
			// for (var i = this.count; i >= 1; i--) {
			for (var i = 1; i <= this.count; i++) {
				//rotationStep
				// Name
				name = "blade"+(i);
				// Create
				blade = new Blade({
					name: name
					,index: i
					,layers: this.app.scene.layers
					,graphicsDevice: this.app.graphicsDevice
					,controls: this.ui !== null
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationStep: this.rotationStep
					,bladeRotationOffset: this.rotationOffset
					,bladeRotation: {x:0,y:0,z:rot}
					,useLayers: this.useLayers
				});
				// Rotate
				// rot-=this.rotationStep;
				rot+=this.rotationStep;
				// Add 
				this.blades[name] = blade;				
				
			};

		}

		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createAllControls() {

			// Has UI
			if (this.ui !== null) {
			
				this.allcontrols = new BladeControls({
					name: "all"
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationOffset: this.rotationOffset
					,bladeRotation: {x:0,y:0,z:0}
				});

			}

		}

		/**
		 * [addBlades description]
		 */
		addBlades() {

			for (let b in this.blades) {
    			// Blade Entity
    			this.app.root.addChild(this.blades[b].getEntity());
    		}

		}

		/**
		 * [addControls description]
		 */
		addControls() {

			if (this.ui !== null) {
				
				// SCENE
				
					// Get observers
					const sceneobserver = this.scene.getControls("observers");
					// Assign callback to all observer
    				for (let id in sceneobserver) {
    					sceneobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
								case "camera":

									switch(this.idx) {
										case "reset":
											// Reset Orbit
											// this.scope.scene.resetCamera();
											this.scope.callAction("pc-orbit-reset");
											break;
										case "projection":
											// Change projection											
											this.scope.scene.setProjection(newValue);
											break;
									}

									break;
								case "material":

									switch(this.idx) {
										case "depth":
											// Change material depth write
											for (let b in this.scope.blades) {
												this.scope.blades[b].setDepth(newValue);
											}
											break;
									}

									break;

								case "opacity":

									switch(this.idx) {
										case "blades":
											// Change material opacity
											for (let b in this.scope.blades) {
												this.scope.blades[b].setOpacity(newValue);
											}
											break;
										case "canvas":
											// Change canvas opacity
											this.scope.canvas.style.opacity = newValue;											
											break;
									}

									break;

								case "separate":

									switch(this.idx) {
										case "blades":
											// Change material depth write
											for (let b in this.scope.blades) {
												this.scope.blades[b].translateBlade(newValue);
											}
											break;
									}

									break;

    						}    						
						}.bind({
							scope: this
							,type: sceneobserver[id].type
							,idx: sceneobserver[id].idx
							,id: id
						}));
    				};
					// Add DOM
    				this.ui.appendChild(this.scene.getControls("ui"));



				// STATES				

					// Get observers
					const statesobserver = this.states.getControls("observers");
					// Assign callback to all observer
    				for (let id in statesobserver) {
    					statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
    							case "append":
									// Add current state
									this.scope.addCurrentState()
									break;
								case "import":
									// Import from file
									this.scope.addImportState()
									break;
								case "state":
									// Setup 
									this.scope.setupStateCallback(this.idx);
									break;
    						}    						
						}.bind({
							scope: this
							,type: statesobserver[id].type
							,idx: statesobserver[id].idx
							,id: id
						}));
    				};
					// Add DOM
    				this.ui.appendChild(this.states.getControls("ui"));

				// ALL
					
					// Get observers
					const allobserver = this.allcontrols.getControls("observers");
					// Assign callback to all observer
    				for (let id in allobserver) {
    					allobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
    							case "morph":
									// Change Morph targets for all blades
									for (let b in this.scope.blades) {
										this.scope.blades[b].updateMorphtarget(this.idx,newValue, this.id);
									}
									break;
								case "rotation":
    								// Rotate All
    								for (let b in this.scope.blades) {
										const rot = fixFloat((this.scope.blades[b].getBladeRotation(this.idx) + newValue) % 360); // from entity
										// const rot = fixFloat((this.scope.blades[b].getRotation(this.idx) + newValue) % 360); // from blade object
    									this.scope.blades[b].setRotation({[this.idx]:rot}, this.id);
									}
									break;
    						}
						}.bind({
							scope: this
							,type: allobserver[id].type
							,idx: allobserver[id].idx
							,id: id
						}));
    				};
    				// Add DOM
    				this.ui.appendChild(this.allcontrols.getControls("ui"));

				// INDIVIDUAL
					
					// Sort
					const keys = sortArrayByNumericValue(Object.keys(this.blades).map(v => parseInt(v.replace('blade',''))), "DESC");				
					// Loop
					for (var i = keys.length - 1; i >= 0; i--) {
	    				// Key
	    				const b = "blade"+keys[i].toString();
	    				// Get observers
	    				const observers = this.blades[b].getControls("observers");
	    				// Assign callback to all observers
	    				for (let id in observers) {
	    					observers[id].observer.on('progress:set', function(newValue, oldValue) {
	    						// Mutate
	    						switch(this.type) {
	    							case "morph":
	    								// Change Morph target
										this.scope.blades[b].updateMorphtarget(this.idx,newValue);
										break;
									case "rotation":
	    								// Rotate Blade
    									this.scope.blades[b].setRotation({[this.idx]:newValue});
										break;
	    						}
							}.bind({
								scope: this								
								,type: observers[id].type
								,idx: observers[id].idx
							}));
	    				};
	    				// Add DOM
	    				this.ui.appendChild(this.blades[b].getControls("ui"));
	    			}
    		
	    		// Add to parent
	    		// if (window.self !== window.top) {
	    		// 	window.top.document.body.appendChild(this.ui);
	    		// }
    		}

		}

		/**
		 * [getCurrentState description]
		 * @return {[type]} [description]
		 */
		getCurrentState() {

			const currentState = {}; 
			for (let b in this.blades) {
				const rotation = this.blades[b].getStateRotation();
				const morphing = this.blades[b].getStateMorphing();
				currentState[b] = { 
					morphing: {...{}, ...morphing }
					,rotation: {...{}, ...rotation }
				}; 
			}
			
			return currentState;

		}

		/**
		 * [addCurrentState description]
		 */
		addCurrentState() {

			// Get State
			const currentState = {}; 
			for (let b in this.blades) {
				const rotation = this.blades[b].getStateRotation();
				const morphing = this.blades[b].getStateMorphing();
				currentState[b] = { 
					morphing: {...{}, ...morphing }
					,rotation: {...{}, ...rotation }
				}; 
			}

			// Append New State
			const name = "_"+Math.floor(new Date().getTime() / 1000);
			this.states.setState(name, currentState);

			// Attache Observer
			const statesobserver = this.states.getControls("observers");
			const id = name;
			statesobserver[id].observer.on('tojson:set', function(newValue, oldValue) {				
				this.scope.exportState(this.id);
			}.bind({
				scope: this
				,id: id
			}));
			statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
				// Mutate
				switch(this.type) {
					case "state":
						// Setup
						this.scope.setupStateCallback(this.idx);
						break;
				}    						
			}.bind({
				scope: this
				,type: statesobserver[id].type
				,idx: statesobserver[id].idx
				,id: id
			}));

		}

		/**
		 * [addImportState description]
		 */
		async addImportState() {

			// Load
			const importState = await importJson();
			const name = importState.name.replace(".json","");
			const currentState = Object.values(importState.data)[0].preset;

			// Append New State
			this.states.setState(name, currentState);

			// Attache Observer
			const statesobserver = this.states.getControls("observers");
			const id = name;
			statesobserver[id].observer.on('tojson:set', function(newValue, oldValue) {				
				this.scope.exportState(this.id);
			}.bind({
				scope: this
				,id: id
			}));
			statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
				// Mutate
				switch(this.type) {
					case "state":
						// Setup
						this.scope.setupStateCallback(this.idx);
						break;
				}    						
			}.bind({
				scope: this
				,type: statesobserver[id].type
				,idx: statesobserver[id].idx
				,id: id
			}));

		}

		/**
		 * [exportState description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		exportState(id) {

			// Get State
				const state = this.states.getState(id); 

			// Export to JSON
				console.info("Copy the object to some key (e.g.: "+id+") of the presetStates object in the ./presets module\n", state);
				exportJson(id,{[id]:state});

		}


		setupStateCallback(idx) {

			// Stop Other updates
			this.app.off();
			// Get current state
			const currentState = this.getCurrentState();
			
			// Get target state
			const state = this.states.getState(idx);		

			// Set New updates
			this.app.on("update", function(dt) {
				try {
					// Update run time
					this.time = Math.min(fixFloat(this.time+(dt*1000)),this.state.duration);
					// Apply changes
					// console.log("run time", this.time);
					const value = (this.time/this.state.duration);
					for (let presetBlade in this.state.preset) {
						for (let presetType in this.state.preset[presetBlade]) {
							switch(presetType) {
								case "morphing":
									// set
									for (let presetKey in this.state.preset[presetBlade][presetType]) {
										const currentWeight = this.origin[presetBlade].morphing[presetKey]; 
										const targetWeight = this.state.preset[presetBlade][presetType][presetKey];
										
										// get different
										let diffWeight= (fixFloat(targetWeight-currentWeight)); 
										// clock wise / closest path
										// if (diffWeight===0) {
										// 	// match
										// 	//console.warn('blade proportion positive', presetBlade, targetWeight, currentWeight);
										// 	diffWeight = targetWeight; //(fixFloat(targetWeight-(1+currentWeight))); 
										// }

										const propWeight = fixFloat(value*diffWeight);
										const weight = fixFloat((currentWeight + propWeight)); // % 1); this is invalid because at 1 it resets to 0

										this.scope.blades[presetBlade].updateMorphtarget(presetKey,weight,presetKey);

									}
									break;
								case "rotation":
									// keys
									const coords = {};
									// get
									for (let presetKey in this.state.preset[presetBlade][presetType]) {
										const currentRot = this.origin[presetBlade].rotation[presetKey]; 
										const targetRot = this.state.preset[presetBlade][presetType][presetKey];
										
										// get different
										let diffRot = (fixFloat(targetRot-currentRot)); 
										// correct
										if (diffRot>0) {
											// clock wise / closest path
											//console.warn('blade proportion positive', presetBlade, targetRot, currentRot);
											diffRot = (fixFloat(targetRot-(360+currentRot))); 
										} 

										const propRot = fixFloat(value*diffRot);
										const rot = fixFloat((currentRot + propRot) % 360);

										// update
										coords[presetKey] = rot;

									}
									// set
									this.scope.blades[presetBlade].setRotation(coords, Object.keys(coords)); // from blade object
									break;
							}
						}
					}											
					// Stop
					if (this.time>=this.state.duration) {
						this.scope.app.off();
					}
				} catch(error) {
					console.warn("state timer error", error);
					this.scope.app.off();	
				}
			}, {
				scope: this
				,time: 0 //state.time
				,state: state
				,origin: currentState								
			});
		}


}
