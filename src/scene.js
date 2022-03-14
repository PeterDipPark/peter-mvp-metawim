import {
			Color,
			Vec3,
			Entity
		} from 'playcanvas';

// Scripts
import CreateOrbitCamera from './orbitcamera';
import CreateMouseInput from './mouseinput';
import CreateTouchInput from './touchinput';

export default class Scene {


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
			const { app, count } = props;

			// Count
			this.count = count;

			// App
			this.app = app;

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

			// Create Camera - DEPRECATED (use script oribitCamera)
			// this.createCamera();
			// this.scene.setCameraView(); // Default View
	    	
			// Create Scipts
			this.createScripts();
		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		/**
		 * [setCameraView description] - DEPRECATED (use script oribitCamera)
		 * @param {[type]} opt_translation [description]
		 * @param {[type]} opt_lookat      [description]
		 */
		// setCameraView(opt_translation, opt_lookat) {

		// 	this.camera.translate(0, 0, 20);
		// 	this.camera.lookAt(Vec3.ZERO);

		// }

		getCamera() {
			// DEPRECATED (use script oribitCamera)
				// return this.camera;
			// SCRIPT camera
				return this.scripts.script.orbitCamera.entity;
		}

		getLight() {
			return this.light
		}

		getScripts() {			
			return this.scripts;
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
		 * [createCamera description] - DEPRECATED (use script oribitCamera)
		 * @return {[type]} [description]
		 */
		// createCamera() {

		// 	// Create an Entity with a camera component
		// 	this.camera = new Entity();
		// 	this.camera.name = "camera";
		// 	this.camera.addComponent("camera", {
		// 		clearColor: new Color(0.2, 0.2, 0.2),
		// 	});

		// }


		createScripts() {			
				
			// Scripts
			this.scripts = new Entity();
			this.scripts.name = "scripts";
			this.scripts.addComponent("script");
			// Orbit Camera
			this.scripts.script.create("orbitCamera", CreateOrbitCamera({
				app: this.app
				,count: this.count
				,defaultZoom: 20
				,canZoom: true
			}));
			// Mouse Input
			this.scripts.script.create("mouseInput", CreateMouseInput({
				app: this.app
			}));
			// Touch Input
			this.scripts.script.create("touchInput", CreateTouchInput({
				app: this.app
			}));
			
		}
}