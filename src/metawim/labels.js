// PC
import {
	Entity,
	ELEMENTTYPE_TEXT,
	ELEMENTTYPE_IMAGE,
	Vec2,
	Vec3,
	Vec4,
	Quat,
	Layer,
	SORTMODE_MANUAL,
	Color,
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
				,layers
				,app
			} = props;
			this.assets = assets;
			this.pixelRatio = pixelRatio;
			this.cameraInstance = camera;
			this.camera = null;
			this.layers = layers;
			this.app = app;

			// Name
			this.name = "bladelables";

			// Layer for lables
			this.layer = null;

			// Labels Line layer
			this.labelsLineLayer = this.layers.getLayerByName("World");
			this.labelsLineInfoColor = new Color(0.113725490196078, 0.56078431372549, 0.8, 0.8);
			this.labelsLineAxisColor = new Color(0, 0, 0, 0.3);

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

			// Create Top most layer
			this.createLayer();

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
			

			// Test 
			setTimeout(function() {
				 this.labels['blade1'].object.setLabelEnabled("axis", true);
				 console.log(this.labels['blade1'].object.getLabelEnabled("axis"))
			}.bind(this), 5000);

		}
	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
		
		/**
		 * [getReferenceCamera description]
		 * @return {[type]} [description]
		 */
		getReferenceCamera() {
			return this.referenceCamera;
		}

		setOpacity(id, d, p) {

			//console.log(d,p);
			this.getLabel(id).info.frame.element.opacity = d===true?0:1;

			// const v = 
			// if (direction === true && position.z < -1 || direction === false && position.z > -1) {
			// 	console.log("hide", direction);	
			// 	lbl.setOpacity("test", 0);
			// } else {
			// 	lbl.setOpacity("test", 0.8);
			// }

			// this.getLabel(id).info.frame.element.opacity = v;
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
					
					// Is Enabled
						// Update
						this.labels[id].info.frame.enabled = this.labels[id].object.getLabelEnabled("info");
						this.labels[id].axis.frame.enabled = this.labels[id].object.getLabelEnabled("axis");
						// Check						
						if (this.labels[id].object.getLabelEnabled("info") === false && this.labels[id].object.getLabelEnabled("axis") === false) continue;

						

					// Get Label Postions
					const labelPos = this.labels[id].object.getLabelPosition();

					// No intersection
					if (labelPos === null) return;

					// Get Vec3 screen position
					const screenPos = this.camera.worldToScreen(labelPos, this.screen.screen);

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

			        // Update Line
			  //       const start = this.labels[id].object.getLabelEdgePosition();					
					// this.app.drawLine(start,labelPos, this.labelsLineInfoColor, false, this.labelsLineLayer);
					this.updateLabelLine(id, labelPos);

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
	    	
	    	// Label 
	    	const label = this.getLabel(id);

	    	// Info
	    	if (label.object.getLabelEnabled("info") === true) {
	    		label.info.frame.setLocalPosition(position);
	    	}

	    	// Axis
	    	if (label.object.getLabelEnabled("axis") === true) {
	    		label.axis.frame.setLocalPosition(position);
	    	}
	    }

	    /**
	     * [updateLabelText description]
	     * @param  {[type]} id [description]
	     * @return {[type]}    [description]
	     */
	    updateLabelText(id) {
	    	
	    	const label = this.getLabel(id);
	    	const labelText = label.object.getLabelText();

	    	// Info
	    	if (label.object.getLabelEnabled("info") === true) {
			    if (labelText!==label.info.text.element.text) {
			        // Set new text
			        label.info.text.element.text = labelText;
			        // Resize frame to match text width
			    	label.info.frame.element.width = label.info.text.element.textWidth + 10;
			    	label.info.frame.element.height = label.info.text.element.textHeight + 5;
			    }	
			}

			// Axis
	    	if (label.object.getLabelEnabled("axis") === true) {
			    if (labelText!==label.axis.text.element.text) {
			        // Set new text
			        label.axis.text.element.text = labelText;
			        // Resize frame to match text width
			    	label.axis.frame.element.width = label.axis.text.element.textWidth + 10;
			    	label.axis.frame.element.height = label.axis.text.element.textHeight + 5;
			    }	
			}
	    }

	    updateLabelLine(id, position) {
	    	
	    	// Label 
	    	const label = this.getLabel(id);

	    	// Line points
	    	let start, end;

	    	// Info
	    	 	if (label.object.getLabelEnabled("info") === true) {

	    	 		// Get Start
	    	 		start = label.object.getLabelEdgePosition();
	    			// Draw
	    			this.app.drawLine(start,position, this.labelsLineInfoColor, false, this.labelsLineLayer);

	    	 	}

	    	// Axis 
	    		if (label.object.getLabelEnabled("axis") === true) {

	    			// Get Start
						start = new Vec3();
						start.copy(position);
						start.mulScalar(-0.75);
		    		// Get End
						end = new Vec3();
						end.copy(position);
						end.mulScalar(0.75);

	    			// Draw X
	    				this.app.drawLine(start,end, this.labelsLineAxisColor, false, this.labelsLineLayer);

	    			// Draw Y
		    // 			const quads_y = {	
						// 	x: new Quat()
						// 	,y: new Quat()
						// 	,z: new Quat()
						// 	,f: new Quat()
						// };
						// const rotation_y = {
						// 	x: 0,
						// 	y: 90,
						// 	z: 0
						// }
						// quads_y.y.setFromEulerAngles(0, rotation_y.y, 0);
				  //       quads_y.x.setFromEulerAngles(rotation_y.x, 0, 0);
				  //       quads_y.z.setFromEulerAngles(0, 0, rotation_y.z);
				  //       quads_y.f.setFromEulerAngles(0, 0, 0);
				  //       quads_y.f.mul(quads_y.y).mul(quads_y.x).mul(quads_y.z);	    			
						const qy = new Quat().setFromEulerAngles(0, 90, 0);
						// const start_y = quads_y.f.transformVector(start);
						// const end_y = quads_y.f.transformVector(end);
						const start_y = qy.transformVector(start);
						const end_y = qy.transformVector(end);
		    			this.app.drawLine(start_y,end_y, this.labelsLineAxisColor, false, this.labelsLineLayer);

		    		// Draw Z
		    // 			const quads_z = {	
						// 	x: new Quat()
						// 	,y: new Quat()
						// 	,z: new Quat()
						// 	,f: new Quat()
						// };
						// const rotation_z = {
						// 	x: 0,
						// 	y: 0,
						// 	z: 90
						// }
						// quads_z.y.setFromEulerAngles(0, rotation_z.y, 0);
				  //       quads_z.x.setFromEulerAngles(rotation_z.x, 0, 0);
				  //       quads_z.z.setFromEulerAngles(0, 0, rotation_z.z);
				  //       quads_z.f.setFromEulerAngles(0, 0, 0);
				  //       quads_z.f.mul(quads_z.y).mul(quads_z.x).mul(quads_z.z);
	    				const qz = new Quat().setFromEulerAngles(0, 0, 90);
						// const start_z = quads_z.f.transformVector(start);
						// const end_z = quads_z.f.transformVector(end);
						const start_z = qz.transformVector(start);
						const end_z = qz.transformVector(end);
	    				this.app.drawLine(start_z,end_z, this.labelsLineAxisColor, false, this.labelsLineLayer);

	    		}

	    }
	    
	////////////////////////
	// METHODS
	////////////////////////

		/**
		 * [createLayer description]
		 * @return {[type]} [description]
		 */
		createLayer() {

    		const uiLayer = this.layers.getLayerByName("UI");
    		const idx = this.layers.getTransparentIndex(uiLayer);
			this.layer = new Layer();
			this.layer.id = this.layer.name = this.name;
			this.layer.opaqueSortMode = SORTMODE_MANUAL;
			this.layer.transparentSortMode = SORTMODE_MANUAL;
			this.layer.passThrough = true;
			this.layer.clearDepthBuffer = true;
			this.layers.insert(this.layer, idx+1);

		}

		/**
		 * [createReferenceCamera description]
		 * @return {[type]} [description]
		 */
		createReferenceCamera() {

			this.referenceCamera = new Entity();
			this.referenceCamera.addComponent("camera", {
		        clearColorBuffer: false
				,clearDepthBuffer: true
				,priority:10
		    });
		    this.referenceCamera.camera.layers = [this.layer.id];
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

			// Group - TBD
				// See: https://playcanvas.github.io/#/user-interface/layout-group
			
			// Info
			
				// Background
					const frameInfo = new Entity();
			        frameInfo.addComponent("element", {
			            pivot: new Vec2(0.5, 0.5), // CENTER: new Vec2(0.5, 0.5), // ORIG: new Vec2(0.5, 0),
			            anchor:  new Vec4(0, 0, 0, 0), // CENTER: new Vec4(0.5, 0.5, 0.5, 0.5), // ORIG: new Vec4(0, 0, 0, 0),
			            width: 70,
			            height: 20,
			            opacity: 1,
			            color: new Color(0.113725490196078, 0.56078431372549, 0.8, 1),
			            type: ELEMENTTYPE_IMAGE,
			            layers: [this.layer.id]
			        });
		        	this.screen.addChild(frameInfo);

		        // Text
		        	const textInfo = new Entity();
			        textInfo.addComponent("element", {
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
			            layers: [this.layer.id]
			        });
			        frameInfo.addChild(textInfo);

			    // Resize frame to match text width
			        frameInfo.element.width = textInfo.element.textWidth + 10;
			        frameInfo.element.height = textInfo.element.textHeight + 5;

			// Axis
			
				// Background
					const frameAxis = new Entity();
			        frameAxis.addComponent("element", {
			            pivot: new Vec2(0.5, 0.5), // CENTER: new Vec2(0.5, 0.5), // ORIG: new Vec2(0.5, 0),
			            anchor:  new Vec4(0, 0, 0, 0), // CENTER: new Vec4(0.5, 0.5, 0.5, 0.5), // ORIG: new Vec4(0, 0, 0, 0),
			            width: 70,
			            height: 20,
			            opacity: 1,
			            color: new Color(0.113725490196078, 0.56078431372549, 0.8, 1),
			            type: ELEMENTTYPE_IMAGE,
			            layers: [this.layer.id]
			        });
		        	this.screen.addChild(frameAxis);

		        // Text
		        	const textAxis = new Entity();
			        textAxis.addComponent("element", {
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
			            layers: [this.layer.id]
			        });
			        frameAxis.addChild(textAxis);

			    // Resize frame to match text width
			        frameAxis.element.width = textAxis.element.textWidth + 10;
			        frameAxis.element.height = textAxis.element.textHeight + 5;



        	// Add to object
		        this.labels[id] = {
		        	info: {
						frame: frameInfo,
						text: textInfo,
					},
					axis: {
						frame: frameAxis,
						text: textAxis,
					},
		        	object: object
		        }
		}

	
}