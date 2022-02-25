// PC
import {
	Application,
	FILLMODE_NONE,
	RESOLUTION_AUTO
} from 'playcanvas';

// METAWIM
import Blade from './blade';
import Scene from './scene';
import BladeControls from './bladecontrols';
import States from './states';
import { meshMorphs } from './model';
import { fixFloat, sortArrayByNumericValue } from './utils';


export default class MetaWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {
			
			// Super 
				const { canvas, ui, count } = props;

			// Props 
				
				// Controls
				this.ui = ui || null;

				// App
				this.app = new Application(canvas, {});
				this.app.root.name = "MetaWim";				

				// Count of blades
				this.count = count || 16;

				// Rotation
				this.rotationOffset = 90; // default offset to correct 0 degrees state (to TOP)
				this.rotationStep = fixFloat(360/this.count);

				// Scene
				this.scene = new Scene();
				this.scene.setCameraView(); // Default View

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

				// Temp

					// Animation
									
						this.animation = true;
						this.morphWeight = 0;
		            	this.morphTarget = 0;

			    	// Listeners					  
		            	
		            	if (this.animation) {
			    			//this.app.on("update", this.update, this);
			    		}
	    		

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

			// Add Camera
				this.app.root.addChild(this.scene.getCamera());			
		    	

	    	// Add Blades
	    		this.addBlades();
	    
	    	// Add Controls
	    		this.addControls();
	    
	    	// Start App
	    		this.app.start();


	    	// Test
	    		// setTimeout(function () {
	    		// 	this.blades['blade16'].updateMorphtarget(0,1, 'm_Cutout_Left');
	    		// 	// this.app.off();
	    		// }.bind(this), 2000);

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

			let mw;

			// Change morph weight
            if (this.morphWeight<100) {
                this.morphWeight++;

                if (this.morphTarget === meshMorphs.length-1) {
                	this.morphTarget = 0;
                }

                mw = Math.min(Math.max(this.morphWeight/100, 0), 1);

                // DIRECTLY 
					// for (let b in this.blades) {
					// 	this.blades[b].updateMorphtarget(this.morphTarget,mw);
					// 	// controls
					// 	if (this.observers[b] && this.observers[b][this.morphTarget]) {
					// 		this.observers[b][this.morphTarget].set('progress', mw);
					// 	}
					// }
				// THROUGH CONTROLS
					this.observer[this.morphTarget].set('progress', mw);

            } else if (this.morphWeight<=200) {
                this.morphWeight++;

                mw = Math.min(Math.max((200-this.morphWeight)/100, 0), 1);

                // DIRECTLY 
					// for (let b in this.blades) {
					// 	this.blades[b].updateMorphtarget(this.morphTarget,mw);
					// 	// controls
					// 	if (this.observers[b] && this.observers[b][this.morphTarget]) {
					// 		this.observers[b][this.morphTarget].set('progress', mw);
					// 	}
					// }

				// THROUGH CONTROLS
					this.observer[this.morphTarget].set('progress', mw);

            } else {

                this.morphWeight = 0;   

                this.morphTarget++;
            }

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	


	////////////////////////
	// METHODS
	////////////////////////
	
		/**
		 * [setupCanvas description]
		 * @return {[type]} [description]
		 */
		setupCanvas() {

			this.app.setCanvasFillMode(FILLMODE_NONE); // https://developer.playcanvas.com/en/api/pc.Application.html#fillMode
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
					,graphicsDevice: this.app.graphicsDevice
					,controls: this.ui !== null
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationStep: this.rotationStep
					,bladeRotationOffset: this.rotationOffset
					,bladeRotation: {x:0,y:0,z:rot}
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
				
					

				// STATES				

					// Get observers
					const statesobserver = this.states.getControls("observers");
					// Assign callback to all observer
    				for (let id in statesobserver) {
    					statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
    							case "export":
									// Export state to console
									this.scope.exportState()
									break;
								case "state":
									// Stop Other updates
									this.scope.app.off();
									// Current State
									const currentState = this.scope.getCurrentState();
									// Apply state
									const state = this.scope.states.getState(this.idx);
									//console.log("change state ["+this.idx+"]", state, newValue);
									
									// Set New updates
									this.scope.app.on("update", function(dt) {
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

																// update
																// if (propWeight!==0) {
																// 	console.log("presetKey", presetKey ,"currentWeight", currentWeight, "diffWeight", diffWeight, "propWeight", propWeight, "weight", weight);
																// }

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
															this.scope.blades[presetBlade].setRotation(coords, Object.keys(coords));
															break;
													}
												}
											}											
											// Stop
											if (this.time>=this.state.duration) {
												//console.warn("stop within");
												this.scope.app.off();
											}
										} catch(error) {
											console.warn("state timer error", error);
											this.scope.app.off();	
										}
									}, {
										scope: this.scope
										,time: 0 //state.time
										,state: state
										,origin: currentState								
									});
						    		
									// Change States
									/*
									for (let presetBlade in state.preset) {
										for (let presetType in state.preset[presetBlade]) {
											switch(presetType) {
												case "morphing":

													break;
												case "rotation":
													// keys
													for (let presetKey in state.preset[presetBlade][presetType]) {
														// const currentRot = this.scope.blades[presetBlade].getBladeRotation(presetKey);
														const currentRot = this.scope.blades[presetBlade].getRotation(presetKey);
														const targetRot = state.preset[presetBlade][presetType][presetKey];
														const diffRot = (fixFloat(targetRot-currentRot)); // Math.abs ?


														const propRot = fixFloat(newValue*diffRot);
														const rot = fixFloat((currentRot + propRot) % 360);

														if (presetKey === "x") {
															console.log("currentRot", currentRot, "diffRot", diffRot, "propRot", propRot, "rot", rot);
														}

														this.scope.blades[presetBlade].setRotation({[presetKey]:rot}, presetKey);

														// const value = fixFloat(newValue*state.preset[presetBlade][presetType][presetKey]);
														// console.log("rot", presetBlade, {[presetKey]:value});
														// this.scope.blades[presetBlade].setRotation({[presetKey]:value});
													}
													break;
											}
										}
									}
									*/
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
										// if (this.idx === "x") {
										// 	console.log("currentRot:" +this.scope.blades[b].getRotation(this.idx));
										// }
										const rot = fixFloat((this.scope.blades[b].getBladeRotation(this.idx) + newValue) % 360);
										// const rot = fixFloat((this.scope.blades[b].getRotation(this.idx) + newValue) % 360);
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
    		}

		}

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

		exportState() {

			const currentState = {}; 
			for (let b in this.blades) {
				const rotation = this.blades[b].getStateRotation();
				const morphing = this.blades[b].getStateMorphing();
				currentState[b] = { 
					morphing: {...{}, ...morphing }
					,rotation: {...{}, ...rotation }
				}; 
			}
			
			console.info("Copy the object to some key of the presetStates object in the ./presets module\n", currentState);

		}


}
