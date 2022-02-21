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

import { htmlToDomFragment } from './utils';

export default class BladeControls {

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
				,meshMorphsIndex
				,bladeRotationOffset  
				,bladeRotation
			} = props;
			this.name = name;
			this.meshMorphsIndex = meshMorphsIndex || [];
			this.bladeRotationOffset = bladeRotationOffset || 0;
			this.bladeRotation = bladeRotation || {};


	    	// Controls
	    	this.controls = {
	    		ui: htmlToDomFragment("<div></div>")
	    		,observers: {}
	    	};

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

			// Create Controls
			this.createControls();

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		/**
		 * [getControls description]
		 * @return {[type]} [description]
		 */
		getControls(opt_key) {

			return opt_key ? this.controls[opt_key] : this.controls;

		}

	////////////////////////
	// METHODS
	////////////////////////

		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createControls() {

			// Add ALL
					
				// Array of observers 


				/*
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
				*/

				// Container
					const bladeContainer = document.createElement("DIV");

				// Blade name
					const bladeNameContainer = document.createElement("DIV");
					const bladeLabel = new Label({
						enabled: true,
						height: null,
						text: this.name.toUpperCase(),
						tabIndex:0,
						width:null
					});
					bladeNameContainer.appendChild(bladeLabel.dom);
					bladeLabel.dom.style.color = "#FF0000";
					bladeNameContainer.style.marginTop = bladeNameContainer.style.marginBottom = "15px";
					bladeContainer.appendChild(bladeNameContainer);

				// Morph Controls
					const morphContainer = document.createElement("DIV");
					const meshMorphs = this.meshMorphsIndex;
					for (var i = 0; i < meshMorphs.length; i++) {


						// TODO: Crate Evaluation Time Interpoltion 
						// https://docs.blender.org/manual/en/latest/animation/shape_keys/introduction.html#animation-shapekeys-relative-vs-absolute

						const bladeMorphLabelContainer = document.createElement("DIV");
						const label = new Label({
							enabled: true,
							height: null,
							text: "morph: "+meshMorphs[i].id,
							tabIndex:0,
							width:null
						});
						bladeMorphLabelContainer.appendChild(label.dom);
						morphContainer.appendChild(bladeMorphLabelContainer);

						// Slider
						const observer = new Observer({
							progress: 0
						});
						/*
						observer.on('progress:set', function(value) {
							// Change All blades morphTarget idx weight to value
							console.log("v", value);
							// for (let b in this.scope.blades) {
							// 	this.scope.blades[b].updateMorphtarget(this.idx,value);
							// }
							this.scope.updateMorphtarget.apply(this, [this.idx,value]);

						}.bind({
							scope: this,						
							idx: meshMorphs[i].idx
						}));
						*/ 
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
						slider.link(observer,'progress');
						morphContainer.appendChild(slider.dom);


						// Add
						this.controls.observers[meshMorphs[i].id] = {
							idx: meshMorphs[i].idx
							,observer: observer
							,type: "morph"
						};
					
					};				
					// Add Morphs to Blade Container
					bladeContainer.appendChild(morphContainer);

				// Rotation
					const rotationContainer = document.createElement("DIV");
					for (let d in this.bladeRotation) {

						const bladeRotationLabelContainer = document.createElement("DIV");
						const label = new Label({
							enabled: true,
							height: null,
							text: "rot: "+d,
							tabIndex:0,
							width:null
						});
						bladeRotationLabelContainer.appendChild(label.dom);
						rotationContainer.appendChild(bladeRotationLabelContainer);

						// Slider
						const observer = new Observer({
							progress: this.bladeRotation[d]
						});
						/*
						observer.on('progress:set', function(value) {
							// Change All blades morphTarget idx weight to value
							console.log("v", value);
							// for (let b in this.scope.blades) {
							// 	this.scope.blades[b].updateMorphtarget(this.idx,value);
							// }
							this.scope.updateMorphtarget.apply(this, [this.idx,value]);

						}.bind({
							scope: this,						
							idx: meshMorphs[i].idx
						}));
						*/ 
						const slider = new SliderInput({
						    enabled: true, 
							height: null,
							max: 360,
							min: 0,				
							binding: new BindingTwoWay(),
							pre: 0,
							value: this.bladeRotation[d],
							sliderMax: 360,
							sliderMin: 0,
							step: 0,
							tabIndex: 0,
							width: null
						});
						slider.link(observer,'progress');
						rotationContainer.appendChild(slider.dom);

						// Add
						this.controls.observers[d] = {
							idx: d
							,observer: observer
							,type: "rotation"
						};
					
					};				
					// Add Morphs to Blade Container
					bladeContainer.appendChild(rotationContainer);

				// Add Blader to UI DOM
					this.controls.ui.appendChild(bladeContainer);
	
		}

}