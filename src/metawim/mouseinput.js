// PC
import * as pc from 'playcanvas';

const CreateMouseInput = ({...props}) => {

	// Props
	const { app, algowimControls } = props;

	// Mouse Input
	var MouseInput = pc.createScript('mouseInput', app);

	MouseInput.attributes.add('orbitSensitivity', {
	    type: 'number', 
	    default: 0.3, 
	    title: 'Orbit Sensitivity', 
	    description: 'How fast the camera moves around the orbit. Higher is faster'
	});

	MouseInput.attributes.add('distanceSensitivity', {
	    type: 'number', 
	    default: 0.15, 
	    title: 'Distance Sensitivity', 
	    description: 'How fast the camera moves in and out. Higher is faster'
	});

	MouseInput.attributes.add('algowimControls', {
	    type: 'object', 
	    default: algowimControls, 
	    title: 'AlgoWim Controls', 
	    description: 'Object to call to disable pointer-events for overlay DOM elements on move'
	});

	// initialize code called once per entity
	MouseInput.prototype.initialize = function() {	    

	    this.orbitCamera = this.entity.script.orbitCamera;

	    if (this.orbitCamera) {
	        var self = this;
	        
	        var onMouseOut = function (e) {
	           self.onMouseOut(e);
	        };

	        // CUSTOM
	        	// this.app.mouse._target.addEventListener('pointerdown', this.onMouseDown.bind(this), false);
	        	// this.app.mouse._target.addEventListener('pointerup', this.onMouseUp.bind(this), false);
	        	// console.log(this.app.mouse);

	        // ORIG
	        	this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
	        	this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);	        
	        	this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
	        	this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

	        // Listen to when the mouse travels out of the window
	        window.addEventListener('mouseout', onMouseOut, false);
	        
	        // Remove the listeners so if this entity is destroyed
	        this.on('destroy', function() {
	            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
	            this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
	            this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
	            this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

	            window.removeEventListener('mouseout', onMouseOut, false);
	        });
	    }
	    
	    // Disabling the context menu stops the browser displaying a menu when
	    // you right-click the page
	    this.app.mouse.disableContextMenu();
	  
	    this.lookButtonDown = false;
	    this.panButtonDown = false;
	    this.lastPoint = new pc.Vec2();
	};


	MouseInput.fromWorldPoint = new pc.Vec3();
	MouseInput.toWorldPoint = new pc.Vec3();
	MouseInput.worldDiff = new pc.Vec3();


	MouseInput.prototype.pan = function(screenPoint) {
	    var fromWorldPoint = MouseInput.fromWorldPoint;
	    var toWorldPoint = MouseInput.toWorldPoint;
	    var worldDiff = MouseInput.worldDiff;
	    
	    // For panning to work at any zoom level, we use screen point to world projection
	    // to work out how far we need to pan the pivotEntity in world space 
	    var camera = this.entity.camera;
	    var distance = this.orbitCamera.distance;
	    
	    camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
	    camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

	    worldDiff.sub2(toWorldPoint, fromWorldPoint);
	       
	    this.orbitCamera.pivotPoint.add(worldDiff);    
	};


	MouseInput.prototype.onMouseDown = function (event) {
		// console.log(event.event.target);
		

		// console.log("DOWN event.pointerId", event.pointerId);
		// this.app.mouse._target.onpointermove = this.onMouseMove.bind(this);
		// this.app.mouse._target.setPointerCapture(event.pointerId);


		// CUSTOM
		if (event.event.target.tagName!=="CANVAS") return;
		if (this.algowimControls !== null) {
			this.algowimControls.lockControls();
		}

		// BAU
	    switch (event.button) {
	        case pc.MOUSEBUTTON_LEFT: {
	            this.lookButtonDown = true;
	        } break;
	            
	        case pc.MOUSEBUTTON_MIDDLE: 
	        // case pc.MOUSEBUTTON_RIGHT: {
	        //     this.panButtonDown = true;
	        // } break;
	    }
	};


	MouseInput.prototype.onMouseUp = function (event) {

		// console.log("this.algowimControls", this.algowimControls);
		// console.log("UP event.pointerId", event.pointerId);
		// this.app.mouse._target.onpointermove = null;
		// this.app.mouse._target.releasePointerCapture(event.pointerId);
		
		// CUSTOM
		if (event.event.target.tagName!=="CANVAS") return;		
		if (this.algowimControls !== null) {
			this.algowimControls.unlockControls();
		}

		// BAU
	    switch (event.button) {
	        case pc.MOUSEBUTTON_LEFT: {
	            this.lookButtonDown = false;
	        } break;
	            
	        case pc.MOUSEBUTTON_MIDDLE: 
	        // case pc.MOUSEBUTTON_RIGHT: {
	        //     this.panButtonDown = false;            
	        // } break;
	    }
	};


	MouseInput.prototype.onMouseMove = function (event) {

		// console.log("MOVE event.pointerId", event);

	    var mouse = pc.app.mouse;
	    if (this.lookButtonDown) {
	        this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
	        this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
	    } else if (this.panButtonDown) {
	        this.pan(event);   
	    }
	    
	    this.lastPoint.set(event.x, event.y);

	    

	};


	MouseInput.prototype.onMouseWheel = function (event) {
	    this.orbitCamera.distance -= event.wheel * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
	    event.event.preventDefault();
	};


	MouseInput.prototype.onMouseOut = function (event) {

		// CUSTOM
		if (this.algowimControls !== null) {
			this.algowimControls.unlockControls();
		}

		// BAU
	    this.lookButtonDown = false;
	    this.panButtonDown = false;
	};

	return MouseInput;
}

export default CreateMouseInput;
