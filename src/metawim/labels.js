// PC
import {
	Entity,
	ELEMENTTYPE_TEXT,
	ELEMENTTYPE_IMAGE,
	Vec2,
	Vec3,
	Vec4,
	SCALEMODE_BLEND,
	Layer,
	SORTMODE_MANUAL,
	ElementInput,
	Color
} from 'playcanvas';


export default class CanvasLabels {

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
				assets 
				,pixelRatio
				,camera
				,blades
			} = props;
			this.assets = assets;
			this.pixelRatio = pixelRatio;
			this.cameraInstance = camera;
			this.camera = camera.entity.camera;
			this.blades = blades;


			// Objects
			this.screen = null;
			this.lables = {}
			
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

			// Create Reference Camera so we can worldToSpace coords
			this.createReferenceCamera();

			// Create Screen
			this.createScreen();

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		getReferenceCamera() {
			return this.referenceCamera;
		}

		getScreen() {
			return this.screen;
		}

		getLabel(id) {

			return this.lables[id];
		}

		setOpacity(id, d, p) {

			//console.log(d,p);
			this.getLabel(id).frame.element.opacity = d===true?0:1;

			// const v = 
			// if (direction === true && position.z < -1 || direction === false && position.z > -1) {
			// 	console.log("hide", direction);	
			// 	lbl.setOpacity("test", 0);
			// } else {
			// 	lbl.setOpacity("test", 0.8);
			// }

			// this.getLabel(id).frame.element.opacity = v;
		}

		setPositions() {
			this.setPosition(Object.values(this.blades));
		}

		setPosition(objects) {

			for (let i = objects.length - 1; i >= 0; i--) {
				
				// Get Vec3 screen position
				const screenPos = this.camera.worldToScreen(objects[i].getLabelPostion(), this.screen.screen);

				// Take pixel ration into account
				screenPos.x *= this.pixelRatio;
	        	screenPos.y *= this.pixelRatio;

	        	// account for screen scaling
	        	const scale = this.screen.screen.scale;

	        	// invert the y position
	        	screenPos.y = this.screen.screen.resolution.y - screenPos.y;

	        	// New Postion
	        	const entityPos = new Vec3(
		            screenPos.x / scale,
		           	screenPos.y / scale,
		            screenPos.z / scale
		        );

		        // Move
		        this.getLabel(objects[i].name).frame.setLocalPosition(entityPos);

			}

	    }

	    setPositionCallback() {
	    	this.setPositions();
	    }

	////////////////////////
	// METHODS
	////////////////////////
	
		createReferenceCamera() {

			this.referenceCamera = new Entity();
			this.referenceCamera.addComponent("camera", {
		        clearColorBuffer: false
				,clearDepthBuffer: true
				,priority:2
		    });
		    this.referenceCamera.camera.layers = [];
		    this.referenceCamera.translate(0, 0, 20.2);
			// this.referenceCamera.lookAt(Vec3.ZERO);
			

		}
	
		createScreen() {

			this.screen = new Entity();
			this.screen.setLocalScale(0.01, 0.01, 0.01);
			this.screen.addComponent("screen", {
				referenceResolution: new Vec2(2000, 2500),
				screenSpace: true,
			});			


		}

		createLabels() {
			// Lables
			for (let b in this.blades) {
				this.createLabel(this.blades[b], this.blades[b].name);
			}
			// Set Camera Callback
			this.cameraInstance.setLabelsCallback(this.setPositionCallback, this)
		}

		createLabel(object, string) {

			// ID
				const id = object.name;

			// Background
				const frame = new Entity();
		        frame.addComponent("element", {
		            pivot: new Vec2(0.5, 0.5), // CENTER: new Vec2(0.5, 0.5), // ORIG: new Vec2(0.5, 0),
		            anchor:  new Vec4(0, 0, 0, 0), // CENTER: new Vec4(0.5, 0.5, 0.5, 0.5), // ORIG: new Vec4(0, 0, 0, 0),
		            width: 70,
		            height: 20,
		            opacity: 0.8,
		            color: new Color(0.113725490196078, 0.56078431372549, 0.8, 1),
		            type: ELEMENTTYPE_IMAGE,
		        });
	        	this.screen.addChild(frame);

	        // Text
	        	const text = new Entity();
		        text.addComponent("element", {
		            pivot: new Vec2(0.5, 0.5),
		            anchor: new Vec4(0, 0.4, 1, 0.55),
		            margin: new Vec4(0, 0, 0, 0),
		            fontAsset: this.assets.find("customfont").id,
		            fontSize: 14,
		            text: `${string}`,
		            autoWidth: false,
        			autoHeight: false,
        			enableMarkup: true,
		            type: ELEMENTTYPE_TEXT,
		        });
		        frame.addChild(text);
		    
		    // Resize frame to match text width
		        frame.element.width = text.element.textWidth + 10;

        	// Add to object
		        this.lables[id] = {
		        	frame: frame,
		        	text: text
		        }
		}

	
}