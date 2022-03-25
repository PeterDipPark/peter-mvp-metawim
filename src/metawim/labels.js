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
			} = props;
			this.assets = assets;
			this.pixelRatio = pixelRatio;
			this.cameraInstance = camera;
			this.camera = null;

			// Screen
			this.screen = null;

			// Labels
			this.labels = {}
			
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

			// Create Reference Camera so we can worldToSpace coords - DO WE NEED THIS
			this.createReferenceCamera();

			// Create Screen
			this.createScreen();

		}

	////////////////////////
	// START (updates)
	////////////////////////

		
		/**
		 * [start description]
		 * @return {[type]} [description]
		 */
		start() {
			// Must go after pc.app.start()

			// Set Camera component
			this.camera = this.cameraInstance.entity.camera || null;			

			// Hook Camera			
			this.hookCamera();
			

		}
	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		getReferenceCamera() {
			return this.referenceCamera;
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

		/**
		 * [getScreen description]
		 * @return {[type]} [description]
		 */
		getScreen() {
			return this.screen;
		}

		/**
		 * [getLabel description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getLabel(id) {

			return this.labels[id];
		}		

		/**
		 * [updateCallback description]
		 */
		updateCallback() {
	    	this.updateLabels();
	    }

	    /**
	     * [updateLabel description]
	     * @param  {[type]} objects [description]
	     * @return {[type]}         [description]
	     */
		updateLabels() {

			try {
				for (let id in this.labels)	{

					// Get Label Postions
					const labelPos = this.labels[id].object.getLabelPostion();

					// No intersection
					if (labelPos === null) return;

					// Get Vec3 screen position
					const screenPos = this.camera.worldToScreen(this.labels[id].object.getLabelPostion(), this.screen.screen);

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

			        // Update Postion
			        this.updateLabelPosition(id, entityPos);

			        // Update Text
			        this.updateLabelText(id);

				}
			} catch(error) {
				console.error("updateLabels failed", error);
			}

	    }

	    /**
	     * [updateLabelPosition description]
	     * @param  {[type]} id       [description]
	     * @param  {[type]} position [description]
	     * @return {[type]}          [description]
	     */
	    updateLabelPosition(id, position) {
	    	const label = this.getLabel(id);
	    	label.frame.setLocalPosition(position);
	    }

	    /**
	     * [updateLabelText description]
	     * @param  {[type]} id [description]
	     * @return {[type]}    [description]
	     */
	    updateLabelText(id) {
	    	
	    	const label = this.getLabel(id);
	    	const labelText = label.object.getLabelText();
		    if (labelText!==label.text.element.text) {
		        // Set new text
		        label.text.element.text = labelText;
		        // Resize frame to match text width
		    	label.frame.element.width = label.text.element.textWidth + 10;
		    }	    	
	    }

	    
	////////////////////////
	// METHODS
	////////////////////////
	
		// ??? - do we need front facing reference camera
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

		/**
		 * [hookCamera description]
		 * @return {[type]} [description]
		 */
		hookCamera() {

			// Set Camera Callback (call on camera update)
			this.cameraInstance.setLabelsCallback(this.updateCallback, this);

		}
	
		/**
		 * [createScreen description]
		 * @return {[type]} [description]
		 */
		createScreen() {

			this.screen = new Entity();
			this.screen.setLocalScale(0.01, 0.01, 0.01);
			this.screen.addComponent("screen", {
				referenceResolution: new Vec2(2000, 2500),
				screenSpace: true,
			});			


		}

		/**
		 * [createLabels description]
		 * @return {[type]} [description]
		 */
		createLabels(objects) {

			try {
				// Convert Object to Array
				let arrayOfNewObjects = objects;
				if (Array.isArray(arrayOfNewObjects) === false) {
					arrayOfNewObjects = Object.values(arrayOfNewObjects);
				}

				// Create labels
				for (let i = arrayOfNewObjects.length - 1; i >= 0; i--) {
					this.createLabel(arrayOfNewObjects[i]);
				}

			} catch(error) {
				console.error("Failed to createLabels");
			}
			
		}

		/**
		 * [createLabel description]
		 * @param  {[type]} object [description]
		 * @param  {[type]} string [description]
		 * @return {[type]}        [description]
		 */
		createLabel(object) {

			// ID
				const id = object.name;

			// Text
				const string = object.getLabelText();

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
		        this.labels[id] = {
		        	frame: frame,
		        	text: text,
		        	object: object
		        }
		}

	
}