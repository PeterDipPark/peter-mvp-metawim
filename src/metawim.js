// PC
import {
	Application,
	FILLMODE_NONE,
	RESOLUTION_AUTO
} from 'playcanvas';

// PCUI
import { 
	SliderInput,
	Button,
	BindingTwoWay,
	Label
} from '@playcanvas/pcui';
import { 
	Observer
} from '@playcanvas/observer';

// METAWIM
import Blade from './blade';
import Scene from './scene';
import { htmlToDomFragment } from './utils';
import { meshMorphs } from './model';

export default class MetaWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {
			
			// Super 
				const { canvas, ui } = props;

			// Props 
				
				// Controls
				this.ui = ui;

				// App
				this.app = new Application(canvas, {});
				this.app.root.name = "MetaWim";				

				// Scene
				this.scene = new Scene();
				this.scene.setCameraView(); // Default View

				// Blades
				this.blades = {};
				this.observers = {};
				this.observer = null;
				this.animation = true;

	    	// Listeners
	    		this.morphWeight = 0;

            	this.morphTarget = 0;

            	
            	if (this.animation) {
	    			this.app.on("update", this.update, this);
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
			this.createBlades(16);


			

			// TOD0:
			
				/*
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
		    	

	    	// Add Baldes
	    		for (let b in this.blades) {
	    			this.app.root.addChild(this.blades[b].getEntity());
	    		}


	    	// Add Controls
	    		this.createControls();

	    	// Start App
	    		this.app.start();


	    	// Test
	    		// setTimeout(function () {
	    		// 	// this.blades['blade16'].updateMorphtarget(0,1);
	    		// 	this.app.off();
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

		createBlades(n) {

			let blade, name;
			let rot = 0;
			for (var i = n; i >= 1; i--) {
				// Name
				name = "blade"+(i);
				// Create
				blade = new Blade({
					name: name,
					graphicsDevice: this.app.graphicsDevice
				});
				// Rotate
				blade.setRotation({z:0,y:0,x:rot});
				rot-=22.5;
				// Add 
				this.blades[name] = blade;				
				
			};

		}


		createControls() {

			// Add ALL
					
					// Array of observers 
					this.observer = [];

					// Get Morph Targets Length
					const morphTargetsCount = 9;

					// Container
					const bladeUi = htmlToDomFragment("<div style=\"display: flex;\"></div>");

					// Toggle play/pause
					// const observerButton = new Observer({click: true});
					// observerButton.on('click:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const button = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						// click: function(e){ console.log("e",e);}.bind(this),
						// binding: new BindingTwoWay(),
						size: "",
						tabIndex:0,
						text:"Pause",
						width:null
					});
					// button.link(observerButton,'click');
					// bladeUi.appendChild(button.dom);
					this.ui.appendChild(button.dom);

					if (button.dom.addEventListener) {
						button.dom.addEventListener("click", function(e) {
							e.stopPropagation();
							e.preventDefault();
							if (this.animation === false)  {
								this.app.on("update", this.update, this);								
								this.animation = true;
								button.text = "Pause";
							} else {
								this.app.off();
								this.animation = false
								button.text = "Play";
							}							
						}.bind(this), false);
					} else {
						button.dom.attachEvent('click', function(e) {
							e.stopPropagation();
							e.preventDefault();
							if (this.animation === false)  {
								this.app.on("update", this.update, this);
								this.animation = true;
								button.text = "Pause";
							} else {
								this.app.off();
								this.animation = false
								button.text = "Play";
							}
						}.bind(this));
					}


					// Create Controls
					const sort = [];
					// for (var i = morphTargetsCount - 1; i >= 0; i--) {
					// for (var i = 0; i < morphTargetsCount; i++) {
					for (var i = 0; i < meshMorphs.length; i++) {

						// Container
						const container = document.createElement("DIV");

						// TODO: Crate Evaluation Time Interpoltion 
						// https://docs.blender.org/manual/en/latest/animation/shape_keys/introduction.html#animation-shapekeys-relative-vs-absolute

						// Label
						// let text, key;						
						// switch(i) {
						// 	case 0:
						// 		text = "m_Cutout_Left (10)"; 			// 10
						// 		key = 1;
						// 		break;
						// 	case 1:
						// 		text = "m_CoreDefault_Tip_S (50)";		// 50
						// 		key = 5;
						// 		break;
						// 	case 2:
						// 		text = "m_Cutout_Center (20)";			// 20
						// 		key = 2;
						// 		break;
						// 	case 3:
						// 		text = "m_CoreSmall_Tip_L (80)";			// 80
						// 		key = 8;
						// 		break;
						// 	case 4:
						// 		text = "m_Cutout_Right (30)";			// 30
						// 		key = 3;
						// 		break;
						// 	case 5:
						// 		text = "m_Cutout_Stepped (40)";			// 40
						// 		key = 4;
						// 		break;
						// 	case 6:
						// 		text = "m_CoreLarge_Tip_S (70)";			// 70
						// 		key = 7;
						// 		break;
						// 	case 7:
						// 		text = "m_CoreLarge_Tip_L (60)";			// 60
						// 		key = 6;
						// 		break;
						// 	case 8:
						// 		text = "m_CoreSmall_Tip_S (90)";			// 90
						// 		key = 9;
						// 		break;
						// 	default:
						// 		text = "?";
						// 		break;
						// }
						const label = new Label({
							enabled: true,
							height: null,
							text: meshMorphs[i].id,
							tabIndex:0,
							width:null
						});
						container.appendChild(label.dom);

						// Slider
						const observer = new Observer({progress: 0});
						observer.on('progress:set', function(value) {
							// Change All blades morphTarget idx weight to value
							for (let b in this.scope.blades) {
								this.scope.blades[b].updateMorphtarget(this.idx,value);
							}
						}.bind({
							scope: this,
							idx: meshMorphs[i].idx
						}));
						const slider = new SliderInput({
						    enabled: true, 
							height: null,
							max: 1,
							min: 0,				
							binding: new BindingTwoWay(),
							pre: 0,
							sliderMax: 1,
							sliderMin: 0,
							step: 0,
							tabIndex: 0,
							width: null
						});
						slider.link(observer,'progress' );
						container.appendChild(slider.dom);

						// Add to Container
						bladeUi.appendChild(container);

						// Add
						this.observer.push(observer);
					
					};

					// const ctrl = sort.sort((a, b) => (a.key > b.key) ? -1 : 1); // DESC: 1 : -1 // ASC: -1 : 1
					// for (var i = ctrl.length - 1; i >= 0; i--) {
					// 	bladeUi.appendChild(ctrl[i].dom);
					// };
					this.ui.appendChild(bladeUi);

			// Add INDIVIDUAL
				
				/*
				tstlp:
				for (let b in this.blades) {

					// Array of observers 
					this.observers[b] = [];

					// Get Morph Targets Length
					const morphTargetsCount = this.blades[b].getMorphTargetsCount();

					// Container
					const bladeUi = htmlToDomFragment("<div></div>");

					// Create Controls
					for (var i = morphTargetsCount - 1; i >= 0; i--) {

						const observer = new Observer({progress: 0});
						observer.on('progress:set', function(value) {
							console.log("value 4", value);
						});
						const slider = new SliderInput({
						    enabled: true, 
							height: null,
							max: 1,
							min: 0,				
							binding: new BindingTwoWay(),
							pre: 0,
							sliderMax: 1,
							sliderMin: 0,
							step: 0,
							tabIndex: 0,
							width: null
						});
						slider.link(observer,'progress' );
						bladeUi.appendChild(slider.dom);

						// Add
						this.observers[b].push(observer);
					
					};

					this.ui.appendChild(bladeUi);

					break tstlp;

				}
				*/


			// TEST
				// const observer = new Observer({progress: 0});
				// observer.on('progress:set', function(value) {
				// 	console.log("value 4", value);
				// });
				// const linkWeight = { observer, path: 'progress' };
				// const sliderTest = new SliderInput({
				//     enabled: true, 
				// 	height: null,
				// 	max: 1,
				// 	min: 0,				
				// 	binding: new BindingTwoWay(),
				// 	pre: 0,
				// 	sliderMax: 1,
				// 	sliderMin: 0,
				// 	step: 0,
				// 	tabIndex: 0,
				// 	width: null
				// });
				// sliderTest.link(observer,'progress' );

				// this.ui.appendChild(sliderTest.dom);

				// setTimeout(function() {
				// 	observer.set('progress', 0.5);
				// }, 5000);
		}


}
