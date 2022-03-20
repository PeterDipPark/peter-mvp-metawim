// PCUI
import { 
	Button,
	BindingTwoWay,
	Label,
	SelectInput,
	SliderInput,
} from '@playcanvas/pcui';
import { 
	Observer
} from '@playcanvas/observer';

import { htmlToDomFragment } from './utils';

export default class SceneControls {

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
				,camera
			} = props;
			this.name = name;
			this.camera = camera || false;			

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
					const sceneContainer = document.createElement("DIV");

				// // UI Controls name
				// 	const uiNameContainer = document.createElement("DIV");
				// 	const uiLabel = new Label({
				// 		enabled: true,
				// 		height: null,
				// 		text: "DEV CONTROLS",
				// 		tabIndex:0,
				// 		width:null
				// 	});
				// 	uiNameContainer.appendChild(uiLabel.dom);
				// 	uiLabel.dom.style.color = "#2c393c";
				// 	// uiNameContainer.style.paddingLeft = "30px";
				// 	uiNameContainer.style.marginTop = "5px";
				// 	sceneContainer.appendChild(uiNameContainer);


				// Scene Controls name
					const sceneNameContainer = document.createElement("DIV");
					const sceneLabel = new Label({
						enabled: true,
						height: null,
						text: this.name.toUpperCase(),
						tabIndex:0,
						width:null
					});
					sceneNameContainer.appendChild(sceneLabel.dom);
					sceneLabel.dom.style.color = "#FF0000";
					sceneNameContainer.style.marginTop = sceneNameContainer.style.marginBottom = "15px";
					sceneContainer.appendChild(sceneNameContainer);

				// Scene Controls					
					const sceneStateContainer = document.createElement("DIV");

					// Camera
						if (this.camera!==false) {

							// Reset Orbit
								
								// Label
								const resetLabelContainer = document.createElement("DIV");
								const resetLabel = new Label({
									enabled: true,
									height: null,
									text: "camera orbit",
									tabIndex:0,
									width:null
								});
								resetLabelContainer.appendChild(resetLabel.dom);
								sceneStateContainer.appendChild(resetLabelContainer);

								// Button
								const resetObserver = new Observer({progress: 1});
								// Observer Callback is set from the main class
								// stateObserver.on('progress:set', function(value) {
								// 	console.log("value 4", value);
								// }.bind(this));
								const resetButton = new Button({
									enabled: true,
									height: null,
									icon: "E401",
									size: "",
									tabIndex:0,
									text:"Reset",
									width:null
								});
								// Link observer
								resetButton.link(resetObserver,'progress');
								// Add button to state export container
								sceneStateContainer.appendChild(resetButton.dom);
								// Add Listener to Button
								resetButton.on('click', function(value) {
									// Dispatch event (toggle)
									const oldValue = resetObserver.get("progress");						
									resetObserver.set("progress", -1*oldValue);
								});

								// Add
								this.controls.observers["resetcamera"] = {
									idx: "reset"
									,observer: resetObserver
									,type: "camera"
								};

							// Projection
								
								// Label
								const projectionLabelContainer = document.createElement("DIV");
								const projectionLabel = new Label({
									enabled: true,
									height: null,
									text: "camera projection",
									tabIndex:0,
									width:null
								});
								projectionLabelContainer.appendChild(projectionLabel.dom);
								sceneStateContainer.appendChild(projectionLabelContainer);

								// Button
								const projectionObserver = new Observer({progress: "o"});
								// Observer Callback is set from the main class
								// stateObserver.on('progress:set', function(value) {
								// 	console.log("value 4", value);
								// }.bind(this));
								const projectionButton = new SelectInput({
									enabled: true,
									height: null,
									icon: "E401",
									size: "",
									tabIndex:0,
									value: "o",
									width: null,
									options: [ {v:"o",t:"Orthographic"}, {v:"p",t:"Perspective"} ]
								});
								// Link observer
								projectionButton.link(projectionObserver,'progress');
								// Add button to state export container
								sceneStateContainer.appendChild(projectionButton.dom);
								// Add Listener to Button
								projectionButton.on('change', function(value) {
									// Dispatch event
									projectionObserver.set("progress", value);
								});

								// Add
								this.controls.observers["projectioncamera"] = {
									idx: "projection"
									,observer: projectionObserver
									,type: "camera"
								};
						
						}

						// Material Depth							
							
							// Label
							const materialdepthLabelContainer = document.createElement("DIV");
							const materialdepthLabel = new Label({
								enabled: true,
								height: null,
								text: "material depth",
								tabIndex:0,
								width:null
							});
							materialdepthLabelContainer.appendChild(materialdepthLabel.dom);
							sceneStateContainer.appendChild(materialdepthLabelContainer);

							// Button
							const materialdepthObserver = new Observer({progress: "e"});
							// Observer Callback is set from the main class
							// stateObserver.on('progress:set', function(value) {
							// 	console.log("value 4", value);
							// }.bind(this));
							const materialdepthButton = new SelectInput({
								enabled: true,
								height: null,
								icon: "E401",
								size: "",
								tabIndex:0,
								value: "e",
								width: null,
								options: [ {v:"e",t:"enabled"},{v:"d",t:"disabled"}]
							});
							// Link observer
							materialdepthButton.link(materialdepthObserver,'progress');
							// Add button to state export container
							sceneStateContainer.appendChild(materialdepthButton.dom);
							// Add Listener to Button
							materialdepthButton.on('change', function(value) {
								// Dispatch event
								materialdepthObserver.set("progress", value);
							});

							// Add
							this.controls.observers["depthmaterial"] = {
								idx: "depth"
								,observer: materialdepthObserver
								,type: "material"
							};

						// Opacity - Blades
							
							// Label
							const opacitybladesLabelContainer = document.createElement("DIV");
							const opacitybladesLabel = new Label({
								enabled: true,
								height: null,
								text: "opacity blades",
								tabIndex:0,
								width:null
							});
							opacitybladesLabelContainer.appendChild(opacitybladesLabel.dom);
							sceneStateContainer.appendChild(opacitybladesLabelContainer);

							// Button
							const opacitybladesObserver = new Observer({progress: 1});
							// Observer Callback is set from the main class
							// stateObserver.on('progress:set', function(value) {
							// 	console.log("value 4", value);
							// }.bind(this));							

							const opacitybladesSlider = new SliderInput({
							    enabled: true, 
								height: null,
								max: 1,
								min: 0,				
								binding: new BindingTwoWay(),
								pre: 0,
								value: 1,
								sliderMax: 1,
								sliderMin: 0,
								step: 0,
								tabIndex: 0,
								width: null
							});
							opacitybladesSlider.link(opacitybladesObserver,'progress');
							sceneStateContainer.appendChild(opacitybladesSlider.dom);

							// Add
							this.controls.observers["bladesopacity"] = {
								idx: "blades"
								,observer: opacitybladesObserver
								,type: "opacity"
							};
					
						// Opacity - Canvas
							
							// Label
							const opacitycanvasLabelContainer = document.createElement("DIV");
							const opacitycanvasLabel = new Label({
								enabled: true,
								height: null,
								text: "opacity canvas",
								tabIndex:0,
								width:null
							});
							opacitycanvasLabelContainer.appendChild(opacitycanvasLabel.dom);
							sceneStateContainer.appendChild(opacitycanvasLabelContainer);

							// Button
							const opacitycanvasObserver = new Observer({progress: 1});
							// Observer Callback is set from the main class
							// stateObserver.on('progress:set', function(value) {
							// 	console.log("value 4", value);
							// }.bind(this));							

							const opacitycanvasSlider = new SliderInput({
							    enabled: true, 
								height: null,
								max: 1,
								min: 0,				
								binding: new BindingTwoWay(),
								pre: 0,
								value: 1,
								sliderMax: 1,
								sliderMin: 0,
								step: 0,
								tabIndex: 0,
								width: null
							});
							opacitycanvasSlider.link(opacitycanvasObserver,'progress');
							sceneStateContainer.appendChild(opacitycanvasSlider.dom);

							// Add
							this.controls.observers["canvasopacity"] = {
								idx: "canvas"
								,observer: opacitycanvasObserver
								,type: "opacity"
							};

						// Separate - Blades
							
							// Label
							const separatebladesLabelContainer = document.createElement("DIV");
							const separatebladesLabel = new Label({
								enabled: true,
								height: null,
								text: "separate blades",
								tabIndex:0,
								width:null
							});
							separatebladesLabelContainer.appendChild(separatebladesLabel.dom);
							sceneStateContainer.appendChild(separatebladesLabelContainer);

							// Button
							const separatebladesObserver = new Observer({progress: 0});
							// Observer Callback is set from the main class
							// stateObserver.on('progress:set', function(value) {
							// 	console.log("value 4", value);
							// }.bind(this));							

							const separatebladesSlider = new SliderInput({
							    enabled: true, 
								height: null,
								max: 100,
								min: -100,				
								binding: new BindingTwoWay(),
								pre: 0,
								value: 0,
								sliderMax: 100,
								sliderMin: -100,
								step: 0,
								tabIndex: 0,
								width: null
							});
							separatebladesSlider.link(separatebladesObserver,'progress');
							sceneStateContainer.appendChild(separatebladesSlider.dom);

							// Add
							this.controls.observers["bladesseparate"] = {
								idx: "blades"
								,observer: separatebladesObserver
								,type: "separate"
							};

					// Add State to States Container
					sceneContainer.appendChild(sceneStateContainer);

				// Add Scene Controls to UI DOM
					this.controls.ui.appendChild(sceneContainer);
	
		}


}