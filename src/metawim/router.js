import io from 'socket.io-client';

export default class Router {

	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		constructor({...props}) {

			// Name
			this.name = "PlayCanvas";

			// Props
			const { pp, bridge } = props;

			// View Ready
			this.viewReady = false;

			// Socket Target
			this.io = {
				pp : {
					ready: false,
					name: "ProtoPie Connect",
					url: pp || null,
					socket: null
				},
				bridge : {
					ready: false,
					name: "Bridge Server",
					url: bridge || null,
					socket: null
				},
			};

			// Init
			this.init();
		}

	////////////////////////
	// INITIALIZE
	////////////////////////
		
		init() {

			// Connect to Socket Servers
			this.connect();
		}

	////////////////////////
	// METHODS
	////////////////////////

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
			if (notReady === true || this.viewReady === true) return;

			// Build View
			this.viewBuild();

		}

		viewBuild() {
			console.warn("viewInit");

			// View is ready
				this.viewReady = true;
				
			// Test
				setTimeout(function() {
					console.log("Emit from PlayCanvas");

					this.io['pp'].socket.emit('ppMessage', { messageId: "ProtoPie", value: "Hi from PlayCanvas!" } );

					this.io['pp'].socket.emit('ppMessage', { messageId: "AlgoWim", value: "Hi from PlayCanvas!" } );

				}.bind(this), 10000);
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