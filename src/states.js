
import { presetStates } from './presets';
import StatesControls from "./statescontrols";
import { objectMap } from "./utils";

export default class States {

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
				controls
			} = props;

			// States
			this.states = objectMap(presetStates, function(v) { 
				return {
					preset: v 		// state values
					,time: 0		// time now (ms)
					,duration: 200 	// total (ms)
				}
			});

			// Create Controls
			this.hasControls = (controls === true);
			this.controls = null;

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


		setState(id, state) {

			this.states[id] = state;
		
		}

		getState(id) {

			return this.states[id];

		}

		/**
		 * [getControls description]
		 * @param  {[type]} opt_key [description]
		 * @return {[type]}         [description]
		 */
		getControls(opt_key) {
			return this.controls.getControls(opt_key);
		}

	////////////////////////
	// METHODS
	////////////////////////


		createControls() {

			// Has UI
			if (this.hasControls === true) {
			
				this.controls = new StatesControls({
					name: "states"
					,states: this.states
				});

			}

		}

}