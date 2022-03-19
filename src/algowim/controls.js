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
				this.controls.observers[id].dom.style.pointerEvents = "none";
			}
		}

		/**
		 * [unlockControls description]
		 * @return {[type]} [description]
		 */
		unlockControls() {
			for (let id in this.controls.observers) {
				this.controls.observers[id].dom.style.pointerEvents = "auto";
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

			// Has container
				if (this.container === null) return;

			// Select Blade Controls

				// Button
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

		}
}