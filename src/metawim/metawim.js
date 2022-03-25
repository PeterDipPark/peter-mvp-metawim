// PC
import {
	Application,
	FILLMODE_NONE,
	FILLMODE_FILL_WINDOW,
	RESOLUTION_AUTO,
	Mouse,
	TouchDevice,
	Color,
	// TEXT test
			Entity,
			ELEMENTTYPE_TEXT,
			Vec2,
			Vec3,
			Vec4,
			SCALEMODE_BLEND,
			Layer,
			SORTMODE_MANUAL,
			ElementInput
} from 'playcanvas';

// TEMP
import * as pc from 'playcanvas';

// METAWIM
// import Router from './router';
import Blade from './blade';
import Scene from './scene';
import BladeControls from './bladecontrols';
import States from './states';
import { meshMorphs } from './model';
import { fixFloat, sortArrayByNumericValue, exportJson, importJson } from './utils';


// test
import CanvasLabels from './labels';


export default class MetaWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {
			
			// Super 
				const { canvas, ui, count, pp, algowimControls, onload } = props;			

			// Props
			
				// Onload callback (for algowimControls)
				this.onload = onload || null;

				// Use Layers (TRY to solve opacity issue)
				this.useLayers = false;

				// Canvas DOM
				this.canvas = canvas;

				// Dev Controls
				this.ui = ui || null;

				// Canvas context (see options at https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
				const gl = canvas.getContext("webgl2", {
					alpha: true
					,antialias: true
					,powerPreference: "high-performance"
					,premultipliedAlpha: true
				});
				// console.warn("gl",gl);
				// gl.alpha = true; // true;

				// App (see options at https://developer.playcanvas.com/en/api/pc.Application.html#Application)
				this.app = new Application(canvas, {
					mouse: new Mouse(canvas.parentElement || canvas)
					,touch: new TouchDevice(canvas.parentElement || canvas)
					,graphicsDeviceOptions: gl
					,elementInput: new ElementInput(canvas)
				});
				this.app.root.name = "MetaWim";				

				// Count of blades
				this.count = count || 16;

				// Rotation
				this.rotationOffset = 90; // default offset to correct 0 degrees state (to TOP)
				this.rotationStep = fixFloat(360/this.count);

				// Scene
				this.scene = new Scene({
					app: this.app
					,count: this.count
					,controls: this.ui !== null
					,useLayers: this.useLayers
					,algowimControls: algowimControls || null
				});
				this.app.scene.ambientLight = new Color(1, 1, 1);

				// Blades			
				this.blades = {};
				
				// Labels
				this.labels = new CanvasLabels({
					assets: this.app.assets
					,pixelRatio: this.app.graphicsDevice.maxPixelRatio
					,camera: this.scene.getCameraInstance()
				});

				// All (Blades) Controls
				this.meshMorphsIndex = meshMorphs;
				this.allcontrols = null;

				// States
				this.states = new States({
					controls: (this.ui !== null)
				});
				this.lastState = {};

				// Router - WebScoket - not needed (we are trigger states via algowimControls)
				// this.router = new Router({
				// 	pp: pp || null
				// })

			// Load Assets AND init app
			
				// Add to registry
					const assets_font = new pc.Asset("customfont", "font", {
					    url: "./assets/Roboto-Condensed-webfont.json"
					});
					this.app.assets.add(assets_font);

				// Load
					const assetsToLoad = [
					    this.app.assets.find("customfont")
					];
					let assetscount = 0;
					assetsToLoad.forEach(function (assetToLoad) {
					    assetToLoad.ready(function (asset) {
					        assetscount++;
					        if (assetscount === assetsToLoad.length) {
					            // Init
								this.init();
					        }
					    }.bind(this));
					    this.app.assets.load(assetToLoad);
					}.bind(this));
			
			

	        
		}


	////////////////////////
	// INITIALIZE
	////////////////////////
	
		/**
		 * [init description]
		 * @return {[type]} [description]
		 */
		init() {			
			
			// Setup Canvas
			this.setupCanvas();

	    	// Create Blades
			this.createBlades();

			// Create Labels
			this.createLabels();

			// Create All Controls
			this.createAllControls();

			// Start
			this.start();

			// TOD0:
			
				/*
					- controls
					- reorder blades
					- test button for action (will simulated socket calls)
					- fx class				
					- scoket listner


				 */
			
				//console.log("this.app.root",this.app.root);
		}


		start() {


			// Add Light
				this.app.root.addChild(this.scene.getLight());

			// Add Camera - DEPRECATED (use script oribitCamera)
				// this.app.root.addChild(this.scene.getCamera());			
		    
		    // Add Scripts			    	
		    	this.app.root.addChild(this.scene.getScripts());		    

	    	// Add Blades
	    		this.addBlades();

	    	// Add Controls
	    		this.addControls();
	    
	    	// Start App
	    		this.app.start();

	    	// Append Lables (must go after app.start)
	    		this.appendLabels();

	    	// Onload (for algowimControls)
	    	
	    		if (this.onload !== null) {
	    			this.onload("pc");	    			
	    		}

	    }

	////////////////////////
	// DEV TEST
	////////////////////////

		devTest() {

	    	// Listeners
    			// this.app.on("update", this.update, th
	    		
	    		

	    	// Test
	    		
	    		// var worldLayer = this.app.scene.layers.getLayerByName('World');
    			// // worldLayer.clearDepthBuffer = true;
    			// worldLayer.enabled = false;

    			// var depthLayer = this.app.scene.layers.getLayerByName('Depth');	    	
    			// depthLayer.clearDepthBuffer = true;
    			// depthLayer.enabled = false;
    			
	    		// setTimeout(function () {
	    		// 	this.blades['blade16'].updateMorphtarget(0,1, 'm_Cutout_Left');
	    		// 	// this.app.off();
	    		// }.bind(this), 2000);
				
				// console.log("this.app.scene.layers", this.app.scene.layers);
				// console.log("this.app", this.app);

				// CAMERA and MESHES MATERIAL
					// console.warn(this.scene.getCamera());
					// for (let b in this.blades) {
					// 	console.log(this.blades[b].meshInstance.material);
					// }
					// console.warn(this.scene);
				

				// TEXT
					// console.log("----------------------------");
					// console.log("root", this.app.root);
					// console.log("layers", this.app.scene.layers);
					// console.log("----------------------------");					 
/*					

					const lbl = new CanvasLabels({
						assets: this.app.assets
						,pixelRatio: this.app.graphicsDevice.maxPixelRatio
						,camera: this.scene.getCameraInstance()
						// ,blades: this.blades

					})
					// const b1 = this.blades['blade1'].getEntity();
					this.app.root.addChild(lbl.getScreen());
					// this.app.root.addChild(lbl.getReferenceCamera());

					// for (let b in this.blades) {
					// 	lbl.createLabel(this.blades[b], this.blades[b].name+" label");
					// }
					lbl.createLabels(this.blades);

*/
					// const scripts = new Entity();
					// scripts.name = "fontsloader";
					// scripts.addComponent("script");
					// scripts.script.create("canvasFontHelper", CreateFonts({}));
					// this.app.root.addChild(scripts);	


					// console.warn("font asset", scripts.script.canvasFontHelper);


// ASETS FONTS - https://forum.playcanvas.com/t/setting-up-font-by-script/14989
// var asset = new pc.Asset("customfont", "font", {
//     url: "./assets/Roboto-Condensed-webfont.json"
// });
// this.app.assets.add(asset);

// console.log("customfont", this.app.assets.find("customfont"));

// var assetsToLoad = [
//     this.app.assets.find("customfont")
// ];
// var count = 0;
// assetsToLoad.forEach(function (assetToLoad) {
//     assetToLoad.ready(function (asset) {
//         count++;
//         if (count === assetsToLoad.length) {
//             // done
//             console.log("customfont loaded", this.app.assets.find("customfont"));
//         }
//     }.bind(this));
//     this.app.assets.load(assetToLoad);
// }.bind(this));



					const worldLayer = this.app.scene.layers.getLayerByName("World");
					const idx = this.app.scene.layers.getTransparentIndex(worldLayer);
					const textlayer = new Layer();
					textlayer.id = textlayer.name = "text";
					// textlayer.opaqueSortMode = SORTMODE_MANUAL; //SORTMODE_MATERIALMESH; //SORTMODE_MANUAL;	
					// textlayer.transparentSortMode = SORTMODE_MANUAL;
					// this.layer.passThrough = true;
					// this.layer.clearDepthBuffer = true;
					// this.layer.shaderPass = SHADER_DEPTH;
					this.app.scene.layers.insert(textlayer, idx+1);

					// Create a 2D screen
				    const layerscreen = new Entity();
				    layerscreen.id = layerscreen.name = "text";
				    layerscreen.addComponent("screen", {
				        referenceResolution: new Vec2(200, 100),
				        scaleBlend: 0.5,
				        scaleMode: SCALEMODE_BLEND,
				        screenSpace: false,
				    });
				    layerscreen.screen.layers = [textlayer.id];
				    this.app.root.addChild(layerscreen);

				     // Basic Text
					    // const textBasic = new Entity();
					    // // textBasic.setLocalPosition(0, 200, 0);
					    // textBasic.addComponent("element", {
					    //     pivot: new Vec2(0.5, 0.5),
					    //     anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
					    //     // fontAsset: assets.font.id,
					    //     // font: 'custom', //assets.font.id,
					    //     fontAsset: this.app.assets.find("customfont").id,
					    //     fontSize: 42,
					    //     text: 'There are seven colors in the rainbow: [color="#ff0000"]red[/color], [color="#ffa500"]orange[/color], [color="#ffff00"]yellow[/color], [color="#00ff00"]green[/color], [color="#0000ff"]blue[/color], [color="#4b0082"]indigo[/color] and [color="#7f00ff"]violet[/color].',
					    //     type: ELEMENTTYPE_TEXT,
					    // });				    	
					    // layerscreen.addChild(textBasic);
					    // textBasic.element.layers = [textlayer.id];
				    	// // this.app.root.addChild(textBasic);

				    // create box entity
					    // const box = new Entity("cube");
					    // box.id = box.name = "text";
					    // box.addComponent("render", {
					    //     type: "box",
					    // });
					    // box.render.layers = [textlayer.id];
				    	// this.app.root.addChild(box);
				    	

				    	



				    	// const sphere = new Entity("sphere");
					    // sphere.id = sphere.name = "sphere";
					    // sphere.addComponent("render", {
					    //     type: "sphere",
					    // });
					    // sphere.render.layers = [textlayer.id];
				    	// this.app.root.addChild(sphere);
				    	// console.log("sphere", sphere);
				    	// sphere.render.material.opacity = 0.4;

					const camera = new Entity();
				    camera.addComponent("camera", {
				        // clearColor: new Color(30 / 255, 30 / 255, 30 / 255),
				        clearColorBuffer: false
						,clearDepthBuffer: true //true
						,priority:2
				    });
					camera.camera.layers = [textlayer.id];
				    this.app.root.addChild(camera);		


				    const light = new Entity();
			        light.name = "light";
			        light.addComponent("light", {
			            type: "omni", //"directional",
			            color: new Color(1, 1, 1),
			            castShadows: false,
			        });
					light.light.layers = [textlayer.id];


				    // console.log("text camera layers", camera.camera.layers);
				 

				   	camera.translate(0, 0, 20);
					camera.lookAt(Vec3.ZERO);

				    

				// TEST 2 - https://playcanvas.github.io/#/user-interface/world-to-screen
				
					// Create a 2D screen
				    const screen = new Entity();
				    screen.setLocalScale(0.01, 0.01, 0.01);
				    screen.addComponent("screen", {
				        referenceResolution: new Vec2(2000, 2500),
				        screenSpace: true,
				    });

				    this.app.root.addChild(screen);


				    // const name = new Entity();
			     //    name.addComponent("element", {
			     //        pivot: new Vec2(0.5, 0.5),
			     //        anchor: new Vec4(0, 0.4, 1, 1),
			     //        margin: new Vec4(0, 0, 0, 0),
			     //        fontAsset: self.app.assets.find("customfont").id,
			     //        fontSize: 20,
			     //        text: `Player `,
			     //        useInput: true,
			     //        type: ELEMENTTYPE_TEXT,
			     //    });

			     //    screen.addChild(name);

//////////////
	
	var self = this;
			        /**
     * Converts a coordinate in world space into a screen's space.
     *
     * @param {pc.Vec3} worldPosition - the Vec3 representing the world-space coordinate.
     * @param {pc.CameraComponent} camera - the Camera.
     * @param {pc.ScreenComponent} screen - the Screen
     * @returns {pc.Vec3} a Vec3 of the input worldPosition relative to the camera and screen. The Z coordinate represents the depth,
     * and negative numbers signal that the worldPosition is behind the camera.
     */
    function worldToScreenSpace(worldPosition, camera, screen) {
        const screenPos = camera.worldToScreen(worldPosition);

        // take pixel ratio into account
        const pixelRatio = self.app.graphicsDevice.maxPixelRatio;
        screenPos.x *= pixelRatio;
        screenPos.y *= pixelRatio;

        // account for screen scaling
        // @ts-ignore engine-tsd
        const scale = screen.scale;

       	// console.warn("screen wt/ esolution", screen);

        // invert the y position
        screenPos.y = screen.resolution.y - screenPos.y;

        // put that into a Vec3
        return new pc.Vec3(
            screenPos.x / scale,
            screenPos.y / scale,
            screenPos.z / scale
        );
    }

    function createPlayer(id, startingAngle, speed, radius) {
        // Create a capsule entity to represent a player in the 3d world
        const entity = new pc.Entity();
        entity.setLocalScale(new pc.Vec3(0.5, 0.5, 0.5));
        entity.addComponent("render", {
            type: "capsule",
        });

        self.app.root.addChild(entity);

        // update the player position every frame with some mock logic
        // normally, this would be taking inputs, running physics simulation, etc
        let angle = startingAngle;
        const height = 0.5;
        self.app.on("update", function (dt) {
            angle += dt * speed;
            if (angle > 360) {
                angle -= 360;
            }
            entity.setLocalPosition(
                radius * Math.sin(angle * pc.math.DEG_TO_RAD),
                height,
                radius * Math.cos(angle * pc.math.DEG_TO_RAD)
            );
            entity.setLocalEulerAngles(0, angle + 90, 0);
        });

        // Create a text element that will hover the player's head
        const playerInfo = new pc.Entity();
        playerInfo.addComponent("element", {
            pivot: new pc.Vec2(0.5, 0),
            anchor: new pc.Vec4(0, 0, 0, 0),
            width: 70,
            height: 20,
            opacity: 0.8,
            color: new pc.Color(0.113725490196078, 0.56078431372549, 0.8, 1),
            type: pc.ELEMENTTYPE_IMAGE,
        });

        screen.addChild(playerInfo);

        const name = new pc.Entity();
        name.name = "textelement";
        name.addComponent("element", {
            pivot: new pc.Vec2(0.5, 0.5),
            anchor: new pc.Vec4(0, 0.4, 1, 0.55),
            margin: new pc.Vec4(0, 0, 0, 0),
            // font: 'custom', //assets.font.id,
            fontAsset: self.app.assets.find("customfont").id,
            fontSize: 14,
            text: `Blade ${id}`,
            useInput: true,
            type: pc.ELEMENTTYPE_TEXT,
        });

        playerInfo.addChild(name);

        /*
        name.addComponent("button", {
            imageEntity: name,
        });

        name.button.on("click", function (e) {
            const color = new pc.Color(
                Math.random(),
                Math.random(),
                Math.random()
            );
            name.element.color = color;
            entity.render.material.setParameter("material_diffuse", [
                color.r,
                color.g,
                color.b,
            ]);
        });
        playerInfo.addChild(name);

        const healthBar = new pc.Entity();
        healthBar.addComponent("element", {
            pivot: new pc.Vec2(0.5, 0),
            anchor: new pc.Vec4(0, 0, 1, 0.4),
            margin: new pc.Vec4(0, 0, 0, 0),
            color: new pc.Color(0.2, 0.6, 0.2, 1),
            opacity: 1,
            type: pc.ELEMENTTYPE_IMAGE,
        });

        playerInfo.addChild(healthBar);

        */
       
        // console.log("blade1 entity",self.blades['blade1']);
        const b1 = self.blades['blade1'].getEntity();
        const b1label = lbl.getLabel('test').frame;
       
        // update the player text's position to always hover the player
        self.app.on("update", function () {
            // get the desired world position
            const worldPosition = entity.getPosition(); // b1.getPosition(); // entity.getPosition(); // 
            worldPosition.y += 0.6; // slightly above the player's head

            // convert to screen position
            const screenPosition = worldToScreenSpace(
                worldPosition,
                camera.camera, //self.scene.getCamera().camera, // camera.camera, //
                screen.screen // lbl.getScreen() // screen.screen //
            );

            if (screenPosition.z > 0) {
                // if world position is in front of the camera, show it
                playerInfo.enabled = true;

                // set the UI position
                playerInfo.setLocalPosition(screenPosition);

            } else {
                // if world position is actually *behind* the camera, hide the UI
                playerInfo.enabled = false;
            }
        });


    }

    // createPlayer(1, 135, 30, 1.5);


    // update the player text's position to always hover the player
			        // self.app.on("update", function () {
			        //     // get the desired world position
			        //     const worldPosition = entity.getPosition(); // b1.getPosition(); // entity.getPosition(); // 
			        //     worldPosition.y += 0.6; // slightly above the player's head

			        //     // convert to screen position
			        //     const screenPosition = worldToScreenSpace(
			        //         worldPosition,
			        //         camera.camera, //self.scene.getCamera().camera, // camera.camera, //
			        //         screen.screen // lbl.getScreen() // screen.screen //
			        //     );

			        //     if (screenPosition.z > 0) {
			        //         // if world position is in front of the camera, show it
			        //         playerInfo.enabled = true;

			        //         // set the UI position
			        //         playerInfo.setLocalPosition(screenPosition);

			        //         b1label.setLocalPosition(screenPosition);

			        //     } else {
			        //         // if world position is actually *behind* the camera, hide the UI
			        //         playerInfo.enabled = false;
			        //     }
			        // });
	
	


	
	// const b1label = lbl.getLabel('test').frame; // entity to reposition
	// const b1 = self.blades['blade1'].getEntity(); // anchor entity		
	// const sc = lbl.getScreen();	// screen component
	// const oc = self.scene.getCamera().camera; //lbl.getReferenceCamera().camera; // self.scene.getCamera().camera // camera component

	// console.log("b1label",b1label);

	// function newpos(position, direction, camera, gd, screen) {
 //        const screenPos = camera.worldToScreen(position, screen);

 //        // take pixel ratio into account
 //        const pixelRatio = gd.maxPixelRatio;
 //        screenPos.x *= pixelRatio;
 //        screenPos.y *= pixelRatio;

 //        // account for screen scaling
 //        // @ts-ignore engine-tsd
 //        const scale = screen.screen.scale;

 //        // invert the y position
 //        screenPos.y = screen.screen.resolution.y - screenPos.y;

 //        // put that into a Vec3
 //        // if (position.z < 0) {
 //        // 	console.log("hide", direction);
 //        // }
 //        // console.log(direction);
 //        lbl.setOpacity("test", direction, position.z);
 //        // if (direction === true && position.z < -1 || direction === false && position.z > -1) {
 //        // 	console.log("hide", direction);	
 //        // 	lbl.setOpacity("test", 0);
 //        // } else {
 //        // 	lbl.setOpacity("test", 0.8);
 //        // }

 //        return new Vec3(
 //            screenPos.x / scale,
 //           	screenPos.y / scale,
 //            screenPos.z / scale
 //        );
 //    }


    

    self.app.on("update", function () {
	    
		// const newposforlabel = newpos(self.blades['blade1'].getLabelPostion(), self.blades['blade1'].getCameraDirection(), oc, self.app.graphicsDevice, sc); // get new position from blade camera		
		// b1label.setLocalPosition(newposforlabel); // set entity new position
		
		// lbl.setPosition([self.blades['blade1']]);
		// lbl.setPositions();
		
	});
	// self.app.off();

    // console.log("b1 position", b1.getPosition());
    // console.log("b1 screen position", newpos(b1.getPosition(), self.blades['blade1'].getCameraDirection(), oc, self.app.graphicsDevice, sc));
    // console.log("b1 camera position", self.blades['blade1'].getCameraPosition());
    // console.log("b1 camera screen position", newpos(self.blades['blade1'].getCameraPosition(), self.blades['blade1'].getCameraDirection(), oc, self.app.graphicsDevice, sc));

    // for (let b in this.blades) {
    // 	console.warn(b, this.blades[b].meshInstance);
    // 	console.warn("\t", b, this.blades[b].entity.getPosition()); 
    // 	console.warn("\t", b, this.blades[b].rotation);

    // 	// const wt = this.blades[b].entity.getWorldTransform();
    // }

	//console.warn(newposforlabel);

/////////////


		}


	////////////////////////
	// CALLBACKS
	////////////////////////
	
		/**
		 * Canvas update
		 * @param  {[type]} dt [description]
		 * @return {[type]}    [description]
		 */
		update(dt) {

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		callAction(action,newValue,oldValue) {

			switch(action) {
				case "pc-orbit-reset":
					// Reset MetaWim Orbit Camera to Initial State
					this.scene.resetCamera();
					break;
			}

		}

	////////////////////////
	// METHODS
	////////////////////////
	
		/**
		 * [setupCanvas description]
		 * @return {[type]} [description]
		 */
		setupCanvas() {

			this.app.setCanvasFillMode(FILLMODE_NONE); // https://developer.playcanvas.com/en/api/pc.Application.html#fillMode
			//this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
	    	this.app.setCanvasResolution(RESOLUTION_AUTO);

		}

		/**
		 * [createBlades description]
		 * @param  {[type]} n [description]
		 * @return {[type]}   [description]
		 */
		createBlades() {

			let blade, name;
			let rot = 0; //this.rotationOffset; // shift to top
			// for (var i = this.count; i >= 1; i--) {
			for (var i = 1; i <= this.count; i++) {
				//rotationStep
				// Name
				name = "blade"+(i);
				// Create
				blade = new Blade({
					name: name
					,index: i
					,layers: this.app.scene.layers
					,graphicsDevice: this.app.graphicsDevice
					,controls: this.ui !== null
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationStep: this.rotationStep
					,bladeRotationOffset: this.rotationOffset
					,bladeRotation: {x:0,y:0,z:rot}
					,useLayers: this.useLayers
				});
				// Rotate
				// rot-=this.rotationStep;
				rot+=this.rotationStep;
				// Add 
				this.blades[name] = blade;				
				
			};

		}


		/**
		 * [createLabels description]
		 * @return {[type]} [description]
		 */
		createLabels() {
			
		}


		/**
		 * [createControls description]
		 * @return {[type]} [description]
		 */
		createAllControls() {

			// Has UI
			if (this.ui !== null) {
			
				this.allcontrols = new BladeControls({
					name: "all"
					,meshMorphsIndex: this.meshMorphsIndex
					,bladeRotationOffset: this.rotationOffset
					,bladeRotation: {x:0,y:0,z:0}
				});

			}

		}

		/**
		 * [addBlades description]
		 */
		addBlades() {

			for (let b in this.blades) {
    			// Blade Entity
    			this.app.root.addChild(this.blades[b].getEntity());
    		}

		}

		/**
		 * [appendLabels description]
		 */
		appendLabels() {

			// Add Labels Screen
			this.app.root.addChild(this.labels.getScreen());

			this.labels.createLabels(this.blades);
			
			// Start updates
			this.labels.start();

		}

		/**
		 * [addControls description]
		 */
		addControls() {

			if (this.ui !== null) {
				
				// SCENE
				
					// Get observers
					const sceneobserver = this.scene.getControls("observers");
					// Assign callback to all observer
    				for (let id in sceneobserver) {
    					sceneobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
								case "camera":

									switch(this.idx) {
										case "reset":
											// Reset Orbit
											// this.scope.scene.resetCamera();
											this.scope.callAction("pc-orbit-reset");
											break;
										case "projection":
											// Change projection											
											this.scope.scene.setProjection(newValue);
											break;
									}

									break;
								case "material":

									switch(this.idx) {
										case "depth":
											// Change material depth write
											for (let b in this.scope.blades) {
												this.scope.blades[b].setDepth(newValue);
											}
											break;
									}

									break;

								case "opacity":

									switch(this.idx) {
										case "blades":
											// Change material opacity
											for (let b in this.scope.blades) {
												this.scope.blades[b].setOpacity(newValue);
											}
											break;
										case "canvas":
											// Change canvas opacity
											this.scope.canvas.style.opacity = newValue;											
											break;
									}

									break;

								case "separate":

									switch(this.idx) {
										case "blades":
											// Change material depth write
											for (let b in this.scope.blades) {
												this.scope.blades[b].translateBlade(newValue);
											}
											break;
									}

									break;

    						}    						
						}.bind({
							scope: this
							,type: sceneobserver[id].type
							,idx: sceneobserver[id].idx
							,id: id
						}));
    				};
					// Add DOM
    				this.ui.appendChild(this.scene.getControls("ui"));



				// STATES				

					// Get observers
					const statesobserver = this.states.getControls("observers");
					// Assign callback to all observer
    				for (let id in statesobserver) {
    					statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
    							case "append":
									// Add current state
									this.scope.addCurrentState()
									break;
								case "import":
									// Import from file
									this.scope.addImportState()
									break;
								case "state":
									// Setup 
									this.scope.setupStateCallback(this.idx);
									break;
    						}    						
						}.bind({
							scope: this
							,type: statesobserver[id].type
							,idx: statesobserver[id].idx
							,id: id
						}));
    				};
					// Add DOM
    				this.ui.appendChild(this.states.getControls("ui"));

				// ALL
					
					// Get observers
					const allobserver = this.allcontrols.getControls("observers");
					// Assign callback to all observer
    				for (let id in allobserver) {
    					allobserver[id].observer.on('progress:set', function(newValue, oldValue) {
    						// Mutate
    						switch(this.type) {
    							case "morph":
									// Change Morph targets for all blades
									for (let b in this.scope.blades) {
										this.scope.blades[b].updateMorphtarget(this.idx,newValue, this.id);
									}
									break;
								case "rotation":
    								// Rotate All
    								for (let b in this.scope.blades) {
										const rot = fixFloat((this.scope.blades[b].getBladeRotation(this.idx) + newValue) % 360); // from entity
										// const rot = fixFloat((this.scope.blades[b].getRotation(this.idx) + newValue) % 360); // from blade object
    									this.scope.blades[b].setRotation({[this.idx]:rot}, this.id);
									}
									break;
    						}
						}.bind({
							scope: this
							,type: allobserver[id].type
							,idx: allobserver[id].idx
							,id: id
						}));
    				};
    				// Add DOM
    				this.ui.appendChild(this.allcontrols.getControls("ui"));

				// INDIVIDUAL
					
					// Sort
					const keys = sortArrayByNumericValue(Object.keys(this.blades).map(v => parseInt(v.replace('blade',''))), "DESC");				
					// Loop
					for (var i = keys.length - 1; i >= 0; i--) {
	    				// Key
	    				const b = "blade"+keys[i].toString();
	    				// Get observers
	    				const observers = this.blades[b].getControls("observers");
	    				// Assign callback to all observers
	    				for (let id in observers) {
	    					observers[id].observer.on('progress:set', function(newValue, oldValue) {
	    						// Mutate
	    						switch(this.type) {
	    							case "morph":
	    								// Change Morph target
										this.scope.blades[b].updateMorphtarget(this.idx,newValue);
										break;
									case "rotation":
	    								// Rotate Blade
    									this.scope.blades[b].setRotation({[this.idx]:newValue});
										break;
	    						}
							}.bind({
								scope: this								
								,type: observers[id].type
								,idx: observers[id].idx
							}));
	    				};
	    				// Add DOM
	    				this.ui.appendChild(this.blades[b].getControls("ui"));
	    			}
    		
	    		// Add to parent
	    		// if (window.self !== window.top) {
	    		// 	window.top.document.body.appendChild(this.ui);
	    		// }
    		}

		}

		/**
		 * [getCurrentState description]
		 * @return {[type]} [description]
		 */
		getCurrentState() {

			const currentState = {}; 
			for (let b in this.blades) {
				const rotation = this.blades[b].getStateRotation();
				const morphing = this.blades[b].getStateMorphing();
				currentState[b] = { 
					morphing: {...{}, ...morphing }
					,rotation: {...{}, ...rotation }
				}; 
			}
			
			return currentState;

		}

		/**
		 * [addCurrentState description]
		 */
		addCurrentState() {

			// Get State
			const currentState = {}; 
			for (let b in this.blades) {
				const rotation = this.blades[b].getStateRotation();
				const morphing = this.blades[b].getStateMorphing();
				currentState[b] = { 
					morphing: {...{}, ...morphing }
					,rotation: {...{}, ...rotation }
				}; 
			}

			// Append New State
			const name = "_"+Math.floor(new Date().getTime() / 1000);
			this.states.setState(name, currentState);

			// Attache Observer
			const statesobserver = this.states.getControls("observers");
			const id = name;
			statesobserver[id].observer.on('tojson:set', function(newValue, oldValue) {				
				this.scope.exportState(this.id);
			}.bind({
				scope: this
				,id: id
			}));
			statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
				// Mutate
				switch(this.type) {
					case "state":
						// Setup
						this.scope.setupStateCallback(this.idx);
						break;
				}    						
			}.bind({
				scope: this
				,type: statesobserver[id].type
				,idx: statesobserver[id].idx
				,id: id
			}));

		}

		/**
		 * [addImportState description]
		 */
		async addImportState() {

			// Load
			const importState = await importJson();
			const name = importState.name.replace(".json","");
			const currentState = Object.values(importState.data)[0].preset;

			// Append New State
			this.states.setState(name, currentState);

			// Attache Observer
			const statesobserver = this.states.getControls("observers");
			const id = name;
			statesobserver[id].observer.on('tojson:set', function(newValue, oldValue) {				
				this.scope.exportState(this.id);
			}.bind({
				scope: this
				,id: id
			}));
			statesobserver[id].observer.on('progress:set', function(newValue, oldValue) {
				// Mutate
				switch(this.type) {
					case "state":
						// Setup
						this.scope.setupStateCallback(this.idx);
						break;
				}    						
			}.bind({
				scope: this
				,type: statesobserver[id].type
				,idx: statesobserver[id].idx
				,id: id
			}));

		}

		/**
		 * [exportState description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		exportState(id) {

			// Get State
				const state = this.states.getState(id); 

			// Export to JSON
				console.info("Copy the object to some key (e.g.: "+id+") of the presetStates object in the ./presets module\n", state);
				exportJson(id,{[id]:state});

		}


		setupStateCallback(idx) {

			// Stop Other updates
			this.app.off("update");
			// Get current state
			const currentState = this.getCurrentState();
			
			// Get target state
			const state = this.states.getState(idx);		

			// Set New updates
			this.app.on("update", function(dt) {
				try {
					// Update run time
					this.time = Math.min(fixFloat(this.time+(dt*1000)),this.state.duration);
					// Apply changes
					// console.log("run time", this.time);
					const value = (this.time/this.state.duration);
					for (let presetBlade in this.state.preset) {
						for (let presetType in this.state.preset[presetBlade]) {
							switch(presetType) {
								case "morphing":
									// set
									for (let presetKey in this.state.preset[presetBlade][presetType]) {
										const currentWeight = this.origin[presetBlade].morphing[presetKey]; 
										const targetWeight = this.state.preset[presetBlade][presetType][presetKey];
										
										// get different
										let diffWeight= (fixFloat(targetWeight-currentWeight)); 
										// clock wise / closest path
										// if (diffWeight===0) {
										// 	// match
										// 	//console.warn('blade proportion positive', presetBlade, targetWeight, currentWeight);
										// 	diffWeight = targetWeight; //(fixFloat(targetWeight-(1+currentWeight))); 
										// }

										const propWeight = fixFloat(value*diffWeight);
										const weight = fixFloat((currentWeight + propWeight)); // % 1); this is invalid because at 1 it resets to 0

										this.scope.blades[presetBlade].updateMorphtarget(presetKey,weight,presetKey);

									}
									break;
								case "rotation":
									// keys
									const coords = {};
									// get
									for (let presetKey in this.state.preset[presetBlade][presetType]) {
										const currentRot = this.origin[presetBlade].rotation[presetKey]; 
										const targetRot = this.state.preset[presetBlade][presetType][presetKey];
										
										// get different
										let diffRot = (fixFloat(targetRot-currentRot)); 
										// correct
										if (diffRot>0) {
											// clock wise / closest path
											//console.warn('blade proportion positive', presetBlade, targetRot, currentRot);
											diffRot = (fixFloat(targetRot-(360+currentRot))); 
										} 

										const propRot = fixFloat(value*diffRot);
										const rot = fixFloat((currentRot + propRot) % 360);

										// update
										coords[presetKey] = rot;

									}
									// set
									this.scope.blades[presetBlade].setRotation(coords, Object.keys(coords)); // from blade object
									break;
							}
						}
					}											
					// Stop
					if (this.time>=this.state.duration) {
						this.scope.app.off("update");
					}
				} catch(error) {
					console.warn("state timer error", error);
					this.scope.app.off("update");	
				}
			}, {
				scope: this
				,time: 0 //state.time
				,state: state
				,origin: currentState								
			});
		}


}
