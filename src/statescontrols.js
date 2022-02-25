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

export default class StatesControls {

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
				,states
				,bladeRotationOffset  
				,bladeRotation
			} = props;
			this.name = name;
			this.states = states || {};			

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


			// console.log("loop states and create controls", this.states);
			// return;

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
					const statesContainer = document.createElement("DIV");

				// States name
					const statesNameContainer = document.createElement("DIV");
					const statesLabel = new Label({
						enabled: true,
						height: null,
						text: this.name.toUpperCase(),
						tabIndex:0,
						width:null
					});
					statesNameContainer.appendChild(statesLabel.dom);
					statesLabel.dom.style.color = "#FF0000";
					statesNameContainer.style.marginTop = statesNameContainer.style.marginBottom = "15px";
					statesContainer.appendChild(statesNameContainer);

				// States Controls					
					const statesStateContainer = document.createElement("DIV");
					const states = this.states;
					// console.warn("populate controls for presetStates", states);
					// Loop add states
					for (let state in states) {


						// Label
						const stateLabelContainer = document.createElement("DIV");
						const stateLabel = new Label({
							enabled: true,
							height: null,
							text: "state: "+state,
							tabIndex:0,
							width:null
						});
						stateLabelContainer.appendChild(stateLabel.dom);
						statesStateContainer.appendChild(stateLabelContainer);

						// Slider
						/*
						const stateObserver = new Observer({
							progress: 0
						});						
						// observer.on('progress:set', function(value) {
						// 	// Change All blades morphTarget idx weight to value
						// 	console.log("v", value);
						// 	// for (let b in this.scope.blades) {
						// 	// 	this.scope.blades[b].updateMorphtarget(this.idx,value);
						// 	// }
						// 	this.scope.updateMorphtarget.apply(this, [this.idx,value]);

						// }.bind({
						// 	scope: this,						
						// 	idx: meshMorphs[i].idx
						// }));
						const stateSlider = new SliderInput({
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
						stateSlider.link(stateObserver,'progress');
						statesStateContainer.appendChild(stateSlider.dom);
						*/
						// Button
						const stateObserver = new Observer({progress: 1});
						// Observer Callback is set from the main class
						// stateObserver.on('progress:set', function(value) {
						// 	console.log("value 4", value);
						// }.bind(this));
						const stateButton = new Button({
							enabled: true,
							height: null,
							icon: "E401",
							size: "",
							tabIndex:0,
							text:"Run state",
							width:null
						});
						// Link observer
						stateButton.link(stateObserver,'progress');
						// Add button to state export container
						statesStateContainer.appendChild(stateButton.dom);
						// Add Export Container to States Container
						// statesContainer.appendChild(statesExportContainer);
						// Add Listener to Button
						stateButton.on('click', function(value) {
							// Dispatch event (toggle)
							const oldValue = stateObserver.get("progress");						
							stateObserver.set("progress", -1*oldValue);
						});

						// Add
						this.controls.observers[state] = {
							idx: state
							,observer: stateObserver
							,type: "state"
						};
					
					};
					//
					// Add State to States Container
					statesContainer.appendChild(statesStateContainer);

				// Current State Button
					
					// Label
					const statesExportLabelContainer = document.createElement("DIV");
					const statesExportLabel = new Label({
						enabled: true,
						height: null,
						text: "state: _current",
						tabIndex:0,
						width:null
					});
					statesExportLabelContainer.appendChild(statesExportLabel.dom);
					statesContainer.appendChild(statesExportLabelContainer);

					// Button
					const observerButton = new Observer({progress: 1});
					// Observer Callback is set from the main class
					// observerButton.on('progress:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const statesExportContainer = document.createElement("DIV");
					const exportButton = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						size: "",
						tabIndex:0,
						text:"Export to console",
						width:null
					});
					// Link observer
					exportButton.link(observerButton,'progress');
					// Add button to state export container
					statesExportContainer.appendChild(exportButton.dom);
					// Add Export Container to States Container
					statesContainer.appendChild(statesExportContainer);
					// Add Listener to Button
					exportButton.on('click', function(value) {
						// Dispatch event (toggle)
						const oldValue = observerButton.get("progress");						
						observerButton.set("progress", -1*oldValue);
					});

					// Add to Observers
					this.controls.observers["export"] = {
						idx: 0
						,observer: observerButton
						,type: "export"
					};

				// Add Blader to UI DOM
					this.controls.ui.appendChild(statesContainer);
	
		}

}