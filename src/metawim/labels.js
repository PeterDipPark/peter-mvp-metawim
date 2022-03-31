// PC
import {
	Entity,
	ELEMENTTYPE_TEXT,
	ELEMENTTYPE_IMAGE,
	Vec2,
	Vec3,
	Vec4,
	Quat,
	Mat4,
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
			this.labelsFrameInfoColor = new Color(0.113725490196078, 0.56078431372549, 0.8, 1);
			this.labelsLineInfoColor = new Color(0.113725490196078, 0.56078431372549, 0.8, 0.8);
			this.labelsFrameAxisColor = new Color(0, 0, 0, 1); //new Color(0.701960784313725, 0.701960784313725, 0.701960784313725, 1);
			this.labelsLineAxisColor = new Color(0, 0, 0, 0.3);
			this.labelsLineAxisInset = 0.87;

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
			// setTimeout(function() {
			// 	 this.labels['blade1'].object.setLabelEnabled("axis", true);
			// 	 // this.labels['blade2'].object.setLabelEnabled("axis", true);
			// 	 // console.log(this.labels['blade1'].object.getLabelEnabled("axis"))
			// 	 console.log(this.labels['blade1']);
			// }.bind(this), 2000);

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
						for (let a in this.labels[id].axis) {
							this.labels[id].axis[a].frame.enabled = this.labels[id].object.getLabelEnabled("axis"); 
						}
						// Check						
						if (this.labels[id].object.getLabelEnabled("info") === false && this.labels[id].object.getLabelEnabled("axis") === false) continue;

						
					// Get Label Postions
					const labelPos = this.labels[id].object.getLabelVerticals("x");

					// No intersection
					if (labelPos === null) continue;

					// account for screen scaling
			        const scale = this.screen.screen.scale;

					// Info
					if (this.labels[id].object.getLabelEnabled("info") === true) {

						// Get Vec3 screen position
						const screenPos = this.camera.worldToScreen(labelPos, this.screen.screen);

						// Take pixel ration into account
						screenPos.x *= this.pixelRatio;
			        	screenPos.y *= this.pixelRatio;			        	

			        	// invert the y position
			        	screenPos.y = this.screen.screen.resolution.y - screenPos.y;

			        	// New Postion
			        	const entityPos = new Vec3(
				            screenPos.x / scale,
				           	screenPos.y / scale,
				            screenPos.z / scale
				        );

				        // Update Postion
				        this.updateLabelPosition("info", id, entityPos);

			    	}	

			    	// Axis
					if (this.labels[id].object.getLabelEnabled("axis") === true) {

						let axisPosition;	    		
			    		for (let a in this.labels[id].axis) {
			    						    			
			    			// Reset
			    			axisPosition = null;

			    			// Calc
			    			switch(a) {
			    				case "x":	
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("x"));
									axisPosition.mulScalar(this.labelsLineAxisInset);
			    					break;
			    				case "-x":
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("x"));
									axisPosition.mulScalar(-this.labelsLineAxisInset);
			    					break;
			    				case "y":	
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("y"));
									axisPosition.mulScalar(this.labelsLineAxisInset);
			    					break;
			    				case "-y":
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("y"));
									axisPosition.mulScalar(-this.labelsLineAxisInset);
			    					break;
			    				case "z":	
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("z"));
									axisPosition.mulScalar(this.labelsLineAxisInset);
			    					break;
			    				case "-z":
			    					axisPosition = new Vec3();
									axisPosition.copy(this.labels[id].object.getLabelVerticals("z"));
									axisPosition.mulScalar(-this.labelsLineAxisInset);
			    					break;
			    			}

			    			// Set
			    			if (axisPosition !== null) {
				    			// Get Vec3 screen position
								const screenPos = this.camera.worldToScreen(axisPosition, this.screen.screen);

								// Take pixel ration into account
								screenPos.x *= this.pixelRatio;
					        	screenPos.y *= this.pixelRatio;			        	

					        	// invert the y position
					        	screenPos.y = this.screen.screen.resolution.y - screenPos.y;

					        	// New Postion
					        	const entityPos = new Vec3(
						            screenPos.x / scale,
						           	screenPos.y / scale,
						            screenPos.z / scale
						        );

						        // Update Postion
						        this.updateLabelPosition(a, id, entityPos);
					        }			
			    		}
					}

			        // Update Text
			        this.updateLabelText(id);

			        // Update Line
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
	    updateLabelPosition(type, id, position) {
	    	
	    	// Label 
	    	const label = this.getLabel(id);

	    	// Info
	    	if (type === "info" && label.object.getLabelEnabled("info") === true) {
	    		label.info.frame.setLocalPosition(position);
	    	}

	    	// Axis
	    	if (type !== "info" && label.object.getLabelEnabled("axis") === true) {
	    		label.axis[type].frame.setLocalPosition(position);	    		
	    	}
	    }

	    /**
	     * [updateLabelText description]
	     * @param  {[type]} id [description]
	     * @return {[type]}    [description]
	     */
	    updateLabelText(id) {
	    	
	    	// Label
	    	const label = this.getLabel(id);	    	

	    	// Info
	    	if (label.object.getLabelEnabled("info") === true) {

	    		const labelText = label.object.getLabelText();

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

	    		const verticalText = label.object.getLabelVerticlasText();

	    		for (let a in label.axis) {
	    			if (verticalText[a]!==label.axis[a].text.element.text) {
			        	// Set new text
			        	label.axis[a].text.element.text = verticalText[a];
			        	// Resize frame to match text width
			    		label.axis[a].frame.element.width = label.axis[a].text.element.textWidth + 10;
			    		label.axis[a].frame.element.height = label.axis[a].text.element.textHeight + 5;
			    	}	
	    		}

			}
	    }

	    /**
	     * [updateLabelLine description]
	     * @param  {[type]} id       [description]
	     * @param  {[type]} position [description]
	     * @return {[type]}          [description]
	     */
	    updateLabelLine(id, position) {
	    	
	    	// Label 
	    	const label = this.getLabel(id);

	    	// Line points
	    	let vertical, start, end;

	    	// Info
	    	 	if (label.object.getLabelEnabled("info") === true) {

	    	 		// Get Start
	    	 		start = label.object.getLabelEdgePosition();
	    			// Draw
	    			this.app.drawLine(start,position, this.labelsLineInfoColor, false, this.labelsLineLayer);

	    	 	}

	    	// Axis 
	    		if (label.object.getLabelEnabled("axis") === true) {

	    			// X
	    			
		    			// Get Start
							start = new Vec3();
							start.copy(position);
							start.mulScalar(-0.75);
			    		// Get End
							end = new Vec3();
							end.copy(position);
							end.mulScalar(0.75);
		    			// Draw	    			
		    				this.app.drawLine(start,end, this.labelsLineAxisColor, false, this.labelsLineLayer);

	    			// Y

	    				// Get Vertical
	    					vertical = label.object.getLabelVerticals("y");
	    				// Get Start
							start = new Vec3();
							start.copy(vertical);
							start.mulScalar(-0.75);
			    		// Get End
							end = new Vec3();
							end.copy(vertical);
							end.mulScalar(0.75);
						// Draw							
			    			this.app.drawLine(start,end, this.labelsLineAxisColor, false, this.labelsLineLayer);

		    		// Z
		    			
		    			// Get Vertical
	    					vertical = label.object.getLabelVerticals("z");
		    			// Get Start
							start = new Vec3();
							start.copy(vertical);
							start.mulScalar(-0.75);
			    		// Get End
							end = new Vec3();
							end.copy(vertical);
							end.mulScalar(0.75);
						// Draw
	    					this.app.drawLine(start,end, this.labelsLineAxisColor, false, this.labelsLineLayer);

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
				const stringLabel = object.getLabelText();
				const stringAxis = object.getLabelVerticlasText();

			// Group - TBD
				// See: https://playcanvas.github.io/#/user-interface/layout-group
						

			// Axis
			
				const axis = {}

				for (let a in stringAxis) {

					// Background
						const frameAxis = new Entity();
				        frameAxis.addComponent("element", {
				            pivot: new Vec2(0.5, 0.5), // CENTER: new Vec2(0.5, 0.5), // ORIG: new Vec2(0.5, 0),
				            anchor:  new Vec4(0, 0, 0, 0), // CENTER: new Vec4(0.5, 0.5, 0.5, 0.5), // ORIG: new Vec4(0, 0, 0, 0),
				            width: 70,
				            height: 20,
				            opacity: 1,
				            color: this.labelsFrameAxisColor,
				            type: ELEMENTTYPE_IMAGE,
				            layers: [this.layer.id]
				        });
			        	frameAxis.enabled = object.getLabelEnabled("axis");
			        	this.screen.addChild(frameAxis);

			        	

			        // Text
			        	const textAxis = new Entity();
				        textAxis.addComponent("element", {
				            pivot: new Vec2(0.5, 0.5),
				            anchor: new Vec4(0, 0.4, 1, 0.55),
				            margin: new Vec4(0, 0, 0, 0),
				            fontAsset: this.assets.find("customfont").id,
				            fontSize: 14,
				            text: `${stringAxis[a]}`,
				            autoWidth: false,
		        			autoHeight: false,
		        			enableMarkup: false,
				            type: ELEMENTTYPE_TEXT,
				            layers: [this.layer.id]
				        });
				        frameAxis.addChild(textAxis);

				    // Resize frame to match text width
				        frameAxis.element.width = textAxis.element.textWidth + 10;
				        frameAxis.element.height = textAxis.element.textHeight + 5;

				    // Add
				    	
				    	axis[a] = {
				    		frame: frameAxis,
				    		text: textAxis
				    	};
				}

			// Info
			
				// Background
					const frameInfo = new Entity();
			        frameInfo.addComponent("element", {
			            pivot: new Vec2(0.5, 0.5), // CENTER: new Vec2(0.5, 0.5), // ORIG: new Vec2(0.5, 0),
			            anchor:  new Vec4(0, 0, 0, 0), // CENTER: new Vec4(0.5, 0.5, 0.5, 0.5), // ORIG: new Vec4(0, 0, 0, 0),
			            width: 70,
			            height: 20,
			            opacity: 1,
			            color: this.labelsFrameInfoColor,
			            type: ELEMENTTYPE_IMAGE,
			            layers: [this.layer.id]
			        });
			        frameInfo.enabled = object.getLabelEnabled("info");
		        	this.screen.addChild(frameInfo);

		        // Text
		        	const textInfo = new Entity();
			        textInfo.addComponent("element", {
			            pivot: new Vec2(0.5, 0.5),
			            anchor: new Vec4(0, 0.4, 1, 0.55),
			            margin: new Vec4(0, 0, 0, 0),
			            fontAsset: this.assets.find("customfont").id,
			            fontSize: 14,
			            text: `${stringLabel}`,
			            autoWidth: false,
	        			autoHeight: false,
	        			enableMarkup: false,
			            type: ELEMENTTYPE_TEXT,
			            layers: [this.layer.id]
			        });
			        frameInfo.addChild(textInfo);

			    // Resize frame to match text width
			        frameInfo.element.width = textInfo.element.textWidth + 10;
			        frameInfo.element.height = textInfo.element.textHeight + 5;

        	// Add to object
		        this.labels[id] = {
		        	info: {
						frame: frameInfo,
						text: textInfo,
					},
					axis: axis,
		        	object: object
		        }
		}

	
}