// PC
import {
	Application,
	FILLMODE_NONE,
	RESOLUTION_AUTO
} from 'playcanvas';

// METAWIM
import Blade from './blade';
import Scene from './scene';
import { meshMorphs } from './model';
import { fixFloat, sortArrayByNumericValue } from './utils'
import BladeControls from './bladecontrols'

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
				this.rotationStep = fixFloat(360/this.count);

				// Scene
				this.scene = new Scene();
				this.scene.setCameraView(); // Default View

				// Blades			
				this.blades = {};
				
				// All Controls
				this.meshMorphsIndex = meshMorphs;
				this.allcontrols = null;


				
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
			let rot = 90; // shift to top
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
				});
				// Rotate
				blade.setRotation({z:0,y:0,x:rot});
				rot-=this.rotationStep;
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
				// ALL
					
					// Get observers
					const allobserver = this.allcontrols.getControls("observers");
					// Assign callback to all observer
    				for (let id in allobserver) {
    					allobserver[id].observer.on('progress:set', function(newValue, oldValue) {
							// Change Morph targets for all blades
							for (let b in this.scope.blades) {
								this.scope.blades[b].updateMorphtarget(this.idx,newValue, this.id);
							}
						}.bind({
							scope: this
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
								// Change Morph target
								this.scope.blades[b].updateMorphtarget(this.idx,newValue);
							}.bind({
								scope: this,						
								idx: observers[id].idx
							}));
	    				};
	    				// Add DOM
	    				this.ui.appendChild(this.blades[b].getControls("ui"));
	    			}
    		}

		}


}
