import io from 'socket.io-client';
import {installStyles,getComputedStyle} from "./style";
import MetaWim from './metawim';
import Controls from './controls';


export default class AlgoWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {

			// Name
			this.name = "AlgoWim";

			// Props
			const { 
				// DEV
				dev
				// DOM
				,container
				// Socket servers
				,pp 
				,bridge // TBD
				// Pie
				,pie

			} = props;	
			this.container = container || document.body;
			this.dev = dev || false;	
			this.pp = pp || null;
			this.bridge = bridge || null;
			this.pie = pie || null;

			// View Ready
			this.viewReady = false;

			// Socket Clients
			this.io = {
				pp : {
					ready: false,
					name: "ProtoPie Connect",
					url: this.pp,
					socket: null
				},
				bridge : {
					ready: false,
					name: "Bridge Server",
					url: this.bridge,
					socket: null
				},
			};			

			// Has Socket
			this.hasSocket = Object.values(this.io).findIndex( t => t.url !== null) !== -1;

			// MetaWim (PC)
			this.metawim = null;

			// Init
			this.init();
		}

	////////////////////////
	// INITIALIZE
	////////////////////////
		
		init() {

			// Install Styles
			this.viewStyles();

			// Init View wo/ socket
			if (this.hasSocket === false) {
				this.viewInit();
				return;
			}

			// Connect to Socket Servers and Init View
			this.connect();
		}

	////////////////////////
	// METHODS
	////////////////////////

		viewStyles() {

			this.style = installStyles(`				
		        iframe#pp {
		        	display: inline-block;
		        	border: none;
		        	position: absolute;
	    			background-color: transparent;
	    			overflow: hidden;
	    			z-index: 0;
	    			top: 0px;
	    			left: 0px;

		        }
		        canvas#pc {
		        	/*clip-path: circle(265px);*/
		        	position: absolute;
		        	top: 0px;
	    			left: 0px;
		        	/*pointer-events: none;*/
		        	z-index: 1;
		        }		        
			`);

		}

		connect() {

			for (let c in this.io) {

				// Has URL
				if (this.io[c].url === null) continue;

				// Connect			
				this.io[c].socket = io(this.io[c].url, {
					'reconnectionDelay' : 1000, 
					'reconnectionAttempts' : 5,
					'transports': ['websocket'] //, 'polling'] - order matters, polling is more resource intensive
				});
				this.io[c].socket
					.on('connect_error', (err) => {
				      this.logClient('['+this.io[c].name+'] disconnected, error', err.toString());
				      this.viewStatus(false);
				    })
				    .on('connect_timeout', () => {
				      this.logClient('['+this.io[c].name+'] disconnected by timeout');
				      this.viewStatus(false);
				    })
				    .on('reconnect_failed', () => {
				      this.logClient('['+this.io[c].name+'] disconnected by retry_timeout');
				      this.viewStatus(false);
				    })
				    .on('reconnect_attempt', (count) => {
				      this.logClient('['+this.io[c].name+'] Retry to connect #'+count+'. Please make sure Socket Server is running on '+this.io[c].url+'');
				    })
				    .on('connect', async () => {
				      this.logClient('['+this.io[c].name+'] connected to', this.io[c].url);
				      this.viewStatus(true);

				      // Set Target Ready
				      this.io[c].ready = true;

				      // init view
				      this.viewInit();
				    })
				    .on('disconnect', (reason) => {
				    	if (reason === 'io server disconnect') {
							// the disconnection was initiated by the server, you need to reconnect manually
							this.logClient('['+this.io[c].name+'] disconnected by server. Reconnecting...');
							this.io[c].socket.connect();
						} else {
							this.logClient('['+this.io[c].name+'] disconnected');
							this.viewStatus(false);
						}
						
						})
					// Messages
					.on('ppMessage', (data) => {
						if (data.messageId === this.name) {
					    	this.logClient('['+this.io[c].name+'] Received message', data);
					    	this.viewUpdate(data)
						}
					})



			}
		  	
		}		

		viewStatus(b) {
			console.warn("viewStatus", b);
		}

		viewInit() {

			// All Sockets must be ready AND do not rebuild the view 
			const notReady = Object.values(this.io).findIndex( t => t.ready === false && t.url !== null) !== -1;
			if (notReady === true || this.viewReady === true) return;

			// Create  Controls			
			this.algowimControls = new Controls({});

			// Build View
			this.viewBuild();

		}

		viewBuild() {
			console.warn("viewBuild");
			
			// Set View ready
				this.viewReady = true;

			// Has container
				if (this.container === null) return;

			// Get Container Size
				const w = getComputedStyle(this.container, 'width');
				const h = getComputedStyle(this.container, 'height');

			// Create DOM

				// Make Sure Container is relative
				this.container.style.position = "relative";

				// ProtoPie
				const ppIframe = document.createElement('iframe');
				ppIframe.scrolling = "no"
				ppIframe.style.width = w;
				ppIframe.style.height = h;
				ppIframe.id = "pp";
				ppIframe.src = (this.pp!==null)?this.pp+"/"+this.pie:this.pie;
				this.container.appendChild(ppIframe);

				// PlayCanvas Dev UI
				const pcControls = this.dev === true ?  document.createElement('dev') : null;
				if (pcControls !== null) {
					pcControls.id = "pc-dev";
					const pcControlsStyle = installStyles(`				
				        #pc-dev {
							height: 100%;
							overflow-y: scroll;
							overflow-x: hidden;
							position: absolute;
							background-color: black;
							width: 220px;
							left: -220px;
							text-align: left;
							z-index: 10000;
							-webkit-transition: left 0.3s ease-out;
							-moz-transition: left 0.3s ease-out;
							-o-transition: left 0.3s ease-out;
							transition: left 0.3s ease-out;
						}
						#pc-dev input {
							width: 100% !important;
						}
						#pc-dev-toggle {
						    background-color: white;
							color: red;
						    border: none;
						    left: 6px;
						    top: 6px;
						    line-height: 1;
						    position: fixed;
						    /*width: 24px;*/
						    height: 24px;
						    border-radius: 12px;
						    z-index: 10001;
						    cursor: pointer;
						    -webkit-transition: left 0.3s ease-out;
							-moz-transition: left 0.3s ease-out;
							-o-transition: left 0.3s ease-out;
							transition: left 0.3s ease-out;
						}		        
					`);
					document.body.appendChild(pcControls);
					const pcControlsToggle = document.createElement("button");
					pcControlsToggle.id = "pc-dev-toggle";
					pcControlsToggle.innerHTML = "☰ DEV";
					pcControlsToggle.addEventListener( "click", function(e){
						const open = (this.style.left === "0px");
						this.style.left = open === true ? "-220px" : "0px";
						e.target.style.left = open === true ? "0px" : "226px";
					}.bind(pcControls), false);					
					document.body.appendChild(pcControlsToggle);

				}

				// PlayCanvas				
				const pcCanvas = document.createElement('canvas');
				pcCanvas.style.width = w;
				pcCanvas.style.height = h;
				pcCanvas.id = "pc";
				this.container.appendChild(pcCanvas);
				this.metawim = new MetaWim({
					canvas: pcCanvas
					,ui: pcControls
					,pp: null // this.pp  // no need to PC socket
					,algowimControls:this.algowimControls
				});
				

			// Create Controls
				
				this.viewControls();

			// Test
				
				// setTimeout(function() {
				// 	console.log("Emit from AlgoWim");

				// 	this.io['pp'].socket.emit('ppMessage', { messageId: "ProtoPie", value: "Hi from AlgoWim!" } );

				// 	this.io['pp'].socket.emit('ppMessage', { messageId: "PlayCanvas", value: "Hi from AlgoWim!" } );


				// }.bind(this), 10000);
				
		}

		viewControls() {			

			// Observe
			
				// Get Observers	
				const observers = this.algowimControls.getControls("observers");
				// Assign callback to all observer
				for (let id in observers) { 
					
					observers[id].observer.forEach(function(action) {
						observers[id].observer.on(action+':set', function(newValue, oldValue) {

							// Select Action
							switch(action) {
								case "pc-orbit-reset":
									// Reset MetaWim Orbit Camera to Initial State
									this.metawim.callAction(action, newValue, oldValue);
									break;
							}

						}.bind(this));
					}.bind(this));
				}
    				

		}

		viewUpdate(data) {
			console.warn("viewUpdate", data);
		}


	////////////////////////
	// HELPERS
	////////////////////////
	
		logClient(msg,opt_data) {		
			console.log("<"+this.name+"> -> ", msg, (opt_data||""));
		}

}