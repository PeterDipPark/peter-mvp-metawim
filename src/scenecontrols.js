// PCUI
import { 
	Button,
	BindingTwoWay,
	Label
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
					const statesContainer = document.createElement("DIV");

				// Scene Controls name
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

				// Scene Controls					
					const statesStateContainer = document.createElement("DIV");

					// Camera
					if (this.camera!==false) {

						// Label
						const stateLabelContainer = document.createElement("DIV");
						const stateLabel = new Label({
							enabled: true,
							height: null,
							text: "orbit camera",
							tabIndex:0,
							width:null
						});
						stateLabelContainer.appendChild(stateLabel.dom);
						statesStateContainer.appendChild(stateLabelContainer);

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
							text:"Reset",
							width:null
						});
						// Link observer
						stateButton.link(stateObserver,'progress');
						// Add button to state export container
						statesStateContainer.appendChild(stateButton.dom);
						// Add Export Container to States Container
						// Add Listener to Button
						stateButton.on('click', function(value) {
							// Dispatch event (toggle)
							const oldValue = stateObserver.get("progress");						
							stateObserver.set("progress", -1*oldValue);
						});

						// Add
						this.controls.observers["camera"] = {
							idx: "camera"
							,observer: stateObserver
							,type: "camera"
						};
					
					}
					
					// Add State to States Container
					statesContainer.appendChild(statesStateContainer);

				// Add Scene Controls to UI DOM
					this.controls.ui.appendChild(statesContainer);
	
		}


}