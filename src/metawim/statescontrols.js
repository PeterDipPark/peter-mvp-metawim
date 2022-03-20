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

			// Add ALL
								
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
							text: "preset state: "+state,
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
							text:"Run",
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
						text: "new state:",
						tabIndex:0,
						width:null
					});
					statesExportLabelContainer.appendChild(statesExportLabel.dom);
					statesExportLabel.dom.style.color = "#00FF00";
					statesExportLabelContainer.style.marginTop = "15px";
					statesContainer.appendChild(statesExportLabelContainer);

					// Button
					const observerExportButton = new Observer({progress: 1});
					// Observer Callback is set from the main class
					// observerExportButton.on('progress:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const statesExportContainer = document.createElement("DIV");
					const exportButton = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						size: "",
						tabIndex:0,
						text:"Add current",
						width:null
					});
					// Link observer
					exportButton.link(observerExportButton,'progress');
					// Add button to state export container
					statesExportContainer.style.marginBottom = "15px";
					statesExportContainer.appendChild(exportButton.dom);
					// Add Export Container to States Container
					statesContainer.appendChild(statesExportContainer);
					// Add Listener to Button
					exportButton.on('click', function(value) {
						// Dispatch event (toggle)
						const oldValue = observerExportButton.get("progress");						
						observerExportButton.set("progress", -1*oldValue);
					});

					// Add to Observers
					this.controls.observers["append"] = {
						idx: 0
						,observer: observerExportButton
						,type: "append"
					};

				// Load State Button
					
					// Label
					const statesImportLabelContainer = document.createElement("DIV");
					const statesImportLabel = new Label({
						enabled: true,
						height: null,
						text: "load state:",
						tabIndex:0,
						width:null
					});
					statesImportLabelContainer.appendChild(statesImportLabel.dom);
					statesImportLabel.dom.style.color = "#00FF00";
					statesImportLabelContainer.style.marginTop = "15px";
					statesContainer.appendChild(statesImportLabelContainer);

					// Button
					const observerImportButton = new Observer({progress: 1});
					// Observer Callback is set from the main class
					// observerImportButton.on('progress:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const statesImportContainer = document.createElement("DIV");
					const importButton = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						size: "",
						tabIndex:0,
						text:"Import",
						width:null
					});
					// Link observer
					importButton.link(observerImportButton,'progress');
					// Add button to state export container
					statesImportContainer.style.marginBottom = "15px";
					statesImportContainer.appendChild(importButton.dom);
					// Add Export Container to States Container
					statesContainer.appendChild(statesImportContainer);
					// Add Listener to Button
					importButton.on('click', function(value) {
						// Dispatch event (toggle)
						const oldValue = observerImportButton.get("progress");						
						observerImportButton.set("progress", -1*oldValue);
					});

					// Add to Observers
					this.controls.observers["import"] = {
						idx: 0
						,observer: observerImportButton
						,type: "import"
					};

				// Add Blader to UI DOM
					this.controls.ui.appendChild(statesContainer);
	
		}

		/**
		 * [addStateControl description]
		 * @param {[type]} state [description]
		 */
		addStateControl(state) {

			// Container
				const stateContainer = document.createElement("DIV");

			// State Control				
				const stateStateContainer = document.createElement("DIV");

				// Label
					const stateLabelContainer = document.createElement("DIV");
					const stateLabel = new Label({
						enabled: true,
						height: null,
						text: "new state: "+state,
						tabIndex:0,
						width:null
					});
					stateLabelContainer.appendChild(stateLabel.dom);
					stateStateContainer.appendChild(stateLabelContainer);

				// Observer
					const stateObserver = new Observer({progress: 1, tojson: 1});

				// Run Button					
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
						text:"Run",
						width:null
					});
					// Link observer
					stateButton.link(stateObserver,'progress');
					// Add button to state export container
					stateStateContainer.appendChild(stateButton.dom);
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
				
				// Export
					// Observer Callback is set from the main class
					// stateObserver.on('tojson:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const exportButton = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						size: "",
						tabIndex:0,
						text:"Export",
						width:null
					});
					// Link observer
					exportButton.link(stateObserver,'tojson');
					// Add button to state export container
					stateStateContainer.appendChild(exportButton.dom);
					// Add Listener to Button
					exportButton.on('click', function(value) {
						// Dispatch event (toggle)
						const oldValue = stateObserver.get("tojson");
						stateObserver.set("tojson", -1*oldValue);
					});

					// Add
					this.controls.observers[state] = {
						idx: state
						,observer: stateObserver
						,type: "state"
					};

				// Add State to States Container
				stateContainer.appendChild(stateStateContainer);


			// Add new state container to UI DOM
				this.controls.ui.appendChild(stateContainer);
		}

}