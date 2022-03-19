import io from 'socket.io-client';
import {installStyles,getComputedStyle} from "./style";
import MetaWim from './metawim';

export default class AlgoWim {
	

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {

			// Name
			this.name = "AlgoWim";

			// Props
			const { 
				// DOM
				container
				,controls
				// Socket servers
				,pp 
				,bridge // TBD
				// Pie
				,pie

			} = props;	
			this.container = container;	
			this.controls = controls || null;	
			this.pp = pp || null;
			this.bridge = bridge || null;
			this.pie = pie || null;

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

			// All Sockets must be ready
			const notReady = Object.values(this.io).findIndex( t => t.ready === false && t.url !== null) !== -1;
			if (notReady === true) return;

			// Build View
			this.viewBuild();

		}

		viewBuild() {
			console.warn("viewInit");

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

				// PlayCanvas				
				const pcCanvas = document.createElement('canvas');
				pcCanvas.style.width = w;
				pcCanvas.style.height = h;
				pcCanvas.id = "pc";
				this.container.appendChild(pcCanvas);
				const app = new MetaWim({
					canvas: pcCanvas
					,ui: this.controls
					,pp: null // this.pp  // no need to PC socket
				});
				
				// const pcCanvasIframe = document.createElement('iframe');
				// pcCanvasIframe.style.width = w;
				// pcCanvasIframe.style.height = h;
				// pcCanvasIframe.id = "pc";
				// const html_string = "<html><head></head><body></body></html>";
				// pcCanvasIframe.src = "data:text/html;charset=utf-8," + escape(html_string);
				// this.container.appendChild(pcCanvasIframe);

				// const ppCanvasDocument = pcCanvasIframe.contentWindow.document;
				// const pcCanvas = ppCanvasDocument.createElement('canvas');
				// pcCanvas.style.width = "100%";
				// pcCanvas.style.height = "100vw";
				// pcCanvas.id = "pc";
				// ppCanvasDocument.body.appendChild(pcCanvas);
				// console.log(ppCanvasDocument.body);
				// pcCanvasIframe.contentWindow.app = new MetaWim({
				// 	canvas: pcCanvas
				// 	,ui: this.controls
				// 	,pp: null // this.pp  // no need to PC socket
				// });
				

				// Pass Click to ProtoPie
				// pcCanvas.addEventListener( "mousedown", function(e){
				// 	e.target.style.pointerEvents = "none";
				// 	setTimeout(function(){
				// 		this.style.pointerEvents = "auto";
				// 	}.bind(e.target), 200)
					
				console.info("ppIframe", ppIframe.contentWindow.document);
			 	
			 	ppIframe.contentWindow.document.domain = "http://192.168.1.13:9981";
			 	//    
			 	ppIframe.addEventListener( "click", function(e){
			 		console.warn("click Received", e);
			 	}, false);
			 	pcCanvas.addEventListener( "click", function(e){
					console.log("fake click to pp", e.pageX, e.pageY, e.offsetX, e.offsetY);
					var ev = this.contentWindow.document.createEvent("MouseEvent");
				    var el = this.contentWindow.document.elementFromPoint(x,y);
				    ev.initMouseEvent(
				        "click",
				        true /* bubble */, true /* cancelable */,
				        this.contentWindow, null,
				        e.offsetX, e.offsetY, 0, 0, /* coordinates */
				        false, false, false, false, /* modifier keys */
				        0 /*left*/, null
				    );
				    // var ev = new MouseEvent('click', {
				    //     'view': window,
				    //     'bubbles': true,
				    //     'cancelable': true,
				    //     'screenX': x,
				    //     'screenY': y
				    // });

				    // var el = document.elementFromPoint(x, y);
				    // console.log(el); //print element to console
				    // el.dispatchEvent(ev);
				    el.dispatchEvent(ev)
				 }.bind(ppIframe), false);

			// Test
			// setTimeout(function() {
			// 	console.log("Emit from AlgoWim");

			// 	this.io['pp'].socket.emit('ppMessage', { messageId: "ProtoPie", value: "Hi from AlgoWim!" } );

			// 	this.io['pp'].socket.emit('ppMessage', { messageId: "PlayCanvas", value: "Hi from AlgoWim!" } );


			// }.bind(this), 10000);
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