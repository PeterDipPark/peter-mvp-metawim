import {
			Color,
			Vec3,
			Entity
		} from 'playcanvas';

// Scripts
import CreateOrbitCamera from './orbitcamera';
import CreateMouseInput from './mouseinput';
import CreateTouchInput from './touchinput';
import SceneControls from "./scenecontrols";

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
			const { controls, app, count } = props;

			// Count
			this.count = count;

			// App
			this.app = app;

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

			// Create Light
			this.createLight();

			// Create Camera - DEPRECATED (use script oribitCamera)
			// this.createCamera();
			// this.scene.setCameraView(); // Default View
	    	
			// Create Scipts
			this.createScripts();

			// Create Controls
			this.createControls();
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

		resetCamera() {
			this.scripts.script.orbitCamera.fire('reset');
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
	            // range: 100,
	            // shadowBias: 0.2,
	            // shadowDistance: 25,
	            // normalOffsetBias: 0.05,
	            // shadowResolution: 2048,
	        });

	        // const worldLayer = this.app.scene.layers.getLayerByName("World");
	        // var layers = [worldLayer.id];

	        if ("use layers" === "no") {
	        	
	        	const layers = this.light.light.layers;
		        for (var i = 1; i < this.count+1; i++) {
		        	layers.push("blade"+i);
		        }
		        this.light.light.layers = layers;

		    }

	        // set the direction for our light - DEPRECATED (for directional light)
	        // this.light.setLocalEulerAngles(45, 30, 0);	        

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
				,defaultZoom: 20.1
				,canZoom: false
			}));
			// Mouse Input
			this.scripts.script.create("mouseInput", CreateMouseInput({
				app: this.app
			}));
			// Touch Input
			this.scripts.script.create("touchInput", CreateTouchInput({
				app: this.app
			}));
			

			
			// TEST RESET orbitCamera
			// setTimeout(function() {
			// 	console.log("fire...");
			// 	this.resetCamera();
			// }.bind(this), 5000);
			

		}


		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createControls() {

			// Has UI
			if (this.hasControls === true) {
			
				this.controls = new SceneControls({
					name: "scene"
					,camera: this.scripts.script.orbitCamera !== undefined
				});

			}

		}
}