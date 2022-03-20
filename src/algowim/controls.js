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

export default class Controls {

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
			
			// Prefix
			this.prefix = "data-algowim";

	    	// Controls
	    	this.controls = {
	    		observers: {}
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

		/**
		 * [lockControls description]
		 * @return {[type]} [description]
		 */
		lockControls() {
			for (let id in this.controls.observers) {
				for (var i = this.controls.observers[id].dom.length - 1; i >= 0; i--) {
					this.controls.observers[id].dom[i].control_element.style.pointerEvents = "none";
				}
			}
		}

		/**
		 * [unlockControls description]
		 * @return {[type]} [description]
		 */
		unlockControls() {
			for (let id in this.controls.observers) {
				for (var i = this.controls.observers[id].dom.length - 1; i >= 0; i--) {
					this.controls.observers[id].dom[i].control_element.style.pointerEvents = "auto";
				}
			}
		}

	////////////////////////
	// METHODS
	////////////////////////

		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createControls() {			

			// Get All DOM by prefix
				const controls_elements = document.querySelectorAll("["+this.prefix+"]");
			

			// Loop DOM Controls
				let control_element, control_data, control_type, control_action, control_value;
				const control_observer_props = {};
				const control_observer_doms = [];
				for (let i = controls_elements.length - 1; i >= 0; i--) {
					// Get Porps from data attribute
						control_element = controls_elements[i];
						control_data = control_element.getAttribute(this.prefix).split(":");
						control_type = control_data[0];
						control_action = control_data[1];
						control_value = control_data[2];
					// Add to DOM
						control_observer_doms.push({
							control_element: control_element,
							control_type: control_type,
							control_action: control_action,
							control_value: control_value
						});
					// Create actions
						control_observer_props[control_action] = control_value;
				}
				// Create Observer
				const control_observer = new Observer(control_observer_props);
				// Assign listeners
				for (let i = control_observer_doms.length - 1; i >= 0; i--) {
					this.assignListeners({ ...control_observer_doms[i], control_observer: control_observer });
				}
				// Add
				this.controls.observers["algowimcontrols"] = {
					observer: control_observer
					,dom: control_observer_doms
				};

			// Select Blade Controls

				// Button
					/*
					const selectBladeObserver = new Observer({progress: 1});
					// Observer Callback is set from the main class
					// stateObserver.on('progress:set', function(value) {
					// 	console.log("value 4", value);
					// }.bind(this));
					const selectBladeButton = new Button({
						enabled: true,
						height: null,
						icon: "E401",
						size: "",
						tabIndex:0,
						text:"Select Blade",
						width:null
					});

					// temp
					selectBladeButton.dom.style.position = "absolute";
					selectBladeButton.dom.style.zIndex = 10;
					selectBladeButton.dom.style.top = "50%";

					// Link observer
					selectBladeButton.link(selectBladeObserver,'progress');
					// Add Listener to Button
					selectBladeButton.on('click', function(value) {
						console.log("selectblade click");
						// Dispatch event (toggle)
						const oldValue = selectBladeObserver.get("progress");						
						selectBladeObserver.set("progress", -1*oldValue);
					});

					// Add
					this.controls.observers["controls"] = {
						idx: 1
						,observer: selectBladeObserver
						,dom: selectBladeButton.dom
						,type: "selectblade"
					};
					*/

		}

		assignListeners({...props}) {

			// Props
			const { control_type, control_element, control_observer, control_action, control_value } = props;

			// Listener per Type
			switch(control_type) {
				case "button":
						control_element.addEventListener( "click", function(e) {
							const oldValue = this.get(control_action);
							this.set(control_action, -1*oldValue);
						}.bind(control_observer), false);
					break;					
			}

		}
}