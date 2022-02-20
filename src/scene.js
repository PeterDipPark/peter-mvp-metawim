import {
			Color,
			Vec3,
			Entity
		} from 'playcanvas';


export default class Scene {


	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		/**
		 * [constructor description]
		 * @param  {...[type]} options.props [description]
		 * @return {[type]}                  [description]
		 */
		constructor() {

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

			// Create Light
			this.createLight();

			// Create Camera
			this.createCamera();
	    	

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		/**
		 * [setCameraView description]
		 * @param {[type]} opt_translation [description]
		 * @param {[type]} opt_lookat      [description]
		 */
		setCameraView(opt_translation, opt_lookat) {

			this.camera.translate(0, 0, 20);
	    	this.camera.lookAt(Vec3.ZERO);
	    	
		}

		getCamera() {
			return this.camera;
		}

		getLight() {
			return this.light
		}

	////////////////////////
	// METHODS
	////////////////////////


		/**
		 * [createLight description]
		 * @return {[type]} [description]
		 */
		createLight() {

	        this.light = new Entity();
	        this.light.name = "light";
	        this.light.addComponent("light", {
	            type: "omni", //"directional",
	            color: new Color(1, 1, 1),
	            castShadows: false,
	            // shadowBias: 0.2,
	            // shadowDistance: 25,
	            // normalOffsetBias: 0.05,
	            // shadowResolution: 2048,
	        });

	        // set the direction for our light
	        this.light.setLocalEulerAngles(45, 30, 0);	        

		}

		/**
		 * [createCamera description]
		 * @return {[type]} [description]
		 */
		createCamera() {

			// Create an Entity with a camera component
		    this.camera = new Entity();
		    this.camera.name = "camera";
		    this.camera.addComponent("camera", {
		        clearColor: new Color(0.2, 0.2, 0.2),
		    });

		}
}