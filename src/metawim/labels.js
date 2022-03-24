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
			const { assets } = props;
			this.assets = assets;


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

			// Create Screen
			this.createScreen();

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		getScreen() {
			return this.screen;
		}

		getLabel(id) {

			return this.lables[id];
		}

	////////////////////////
	// METHODS
	////////////////////////
	
		createScreen() {

			this.screen = new Entity();
			this.screen.setLocalScale(0.01, 0.01, 0.01);
			this.screen.addComponent("screen", {
				referenceResolution: new Vec2(2000, 2500),
				screenSpace: true,
			});			

		}

		createLabel(id, string) {

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