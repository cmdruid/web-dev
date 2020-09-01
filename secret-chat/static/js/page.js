/** The core Vue instance controlling the UI */

const vm = new Vue ({
    el: '#vue-instance',

    data () {
      	return {
        	cryptWorker: null,
        	socket: null,
        	originPublicKey: null,
        	destinationPublicKey: null,
        	messages: [],
        	notifications: [],
        	currentRoom: null,
        	pendingRoom: Math.floor(Math.random() * 1000000),
        	draft: ''
      	}
    },

	methods: {
	
		/** Append a notification message in the UI. **/
		addNotification (message) {
			const timestamp = new Date().toLocaleTimeString();
			this.notifications.push({ message, timestamp });
			this.autoscroll(this.$refs.notificationContainer);
		},
		
		/** Setup socket.io event listeners. **/
		setupSocketListeners () {
		
			// Automatically join default room on connect.
			this.socket.on('connect', () => {
				this.addNotification('Connected To Server.');
				this.joinRoom();
			});
		
			// Notify user when they lose connection to socket.
			this.socket.on('disconnect', () => this.addNotification('Lost connection to socket!'));

			// Notify user when they lose connection to socket.
			this.socket.on('reconnecting', () => this.addNotification('Attempting to reconnect...'));
		
			// Decrypt and display messages when received.
			this.socket.on('MESSAGE', async (message) => {
				// Decrypt messages that include a user's public key.
				if (message.recipient === this.originPublicKey) {
					message.text = await this.getWebWorkerResponse('decrypt', message.text);
					this.addMessage(message);
				}
			});

			// When another user joins the room, send them your key.
			this.socket.on('NEW_CONNECTION', () => {
				this.addNotification('Another user joined the room.');
				this.sendPublicKey();
			});

			// Broadcast your public key when joining a new room.
			this.socket.on('ROOM_JOINED', (newRoom) => {
				this.currentRoom = newRoom;
				this.addNotification(`Joined Room - ${this.currentRoom}`);
				this.sendPublicKey();
			});

			// Save public key when received.
			this.socket.on('PUBLIC_KEY', (key) => {
				this.addNotification(`Public Key Received - ${this.getKeySnippet(key)}`);
				this.destinationPublicKey = key;
			});

			// Clear destination public key if other user leaves the room.
			this.socket.on('USER_DISCONNCETED', () => {
				this.notify(`User Disconnected - ${this.getKeySnippet(this.destinationPublicKey)}`);
				this.destinationPublicKey = null;
			});

			// Notify the user if the room they are joining is full.
			this.socket.on('ROOM_FULL', () => {
				this.addNotification(`Cannot join ${this.pendingRoom}, room is full!`);

				// Join a random room as a fall-back.
				this.pendingRoom = Math.floor(Math.random() * 1000000);
				this.joinRoom();
			})

			// Notify room when someone is rejected from joining.
			this.socket.on('INTRUSION_ATTEMPT', () => {
				this.addNotification('Another user attempted to join the room!');
			})
		},
		
		/** Send the current draft message. **/
		async sendMessage () {
		
			// Don't send a blank message!
			if (!this.draft || this.draft === '') { return; }
		
			let message = Immutable.Map({
				text: this.draft,
				recipient: this.destinationPublicKey,
				sender: this.originPublicKey
			})
		
			// Reset the UI input text.
			this.draft = '';

			// Add the (unencrypted) message to sender's local UI.
			this.addMessage(message.toObject());

			if (this.destinationPublicKey) {
				// Encrypt message with the public key of the other user.
				const request       = [ message.get('text'), this.destinationPublicKey ],
				      encryptedText = await this.getWebWorkerResponse('encrypt', request),
					  encryptedMsg  = message.set('text', encryptedText);
					  
				// Emit the encrypted message.
				this.socket.emit('MESSAGE', encryptedMsg.toObject());
			}
		},
		
		/** Join the chat room. **/
		joinRoom () {
			if (this.pendingRoom !== this.currentRoom && this.originPublicKey) {
				this.addNotification(`Connecting to Rooom - ${this.pendingRoom}`);

				// Reset the state of the room.
				this.messages = [];
				this.destinationPublicKey = null;

				// Emit room join request.
				this.socket.emit('JOIN', this.pendingRoom)
			}
		},
		
		/** Add message to UI. **/
		addMessage (message) {
			this.messages.push(message);
			this.autoscroll(this.$refs.chatContainer);
		},

		/** Emit the public key to all users in the chatroom. */
		sendPublicKey () {
			if (this.originPublicKey) {
				this.socket.emit('PUBLIC_KEY', this.originPublicKey);
			}
		},

		/** Get key snippet for displaying to chat room. */
		getKeySnippet (key) { return key.slice(400, 416) },

		/** Post a message to the web worker and return a promise. **/
		getWebWorkerResponse (messageType, messagePayload) {
			return new Promise((resolve, reject) => {

				// Generate a random message id for the event call.
				const messageId = Math.floor(Math.random() * 100000);

				// Post message to the web worker.
				this.cryptWorker.postMessage([messageType, messageId].concat(messagePayload));

				// Create a handler for the web worker message event.
				const handler = function (e) {
					// Match the message with the messageId.
					if (e.data[0] === messageId) {
						// Remove the event listener after being called.
						e.currentTarget.removeEventListener(e.type, handler);

						// Resolve the promise with the message payload.'
						resolve(e.data[1]);
					}
				}

				// Assign the handler to the web worker 'message' event.
				this.cryptWorker.addEventListener('message', handler);
			})
		},

		/** Always auto-scroll DOM element to bottom. */
		autoscroll (element) {
			if (element) { element.scrollTop = element.scrollHeight }
		}
	},

    async created () {
		this.addNotification('Welcome! Generating a new keypair now.');

		/** Initialize the web-worker thread. */
		this.cryptWorker = new Worker('static/js/crypto-worker.js');

		/** Generate a key-pair and join the default room. */
		this.originPublicKey = await this.getWebWorkerResponse('generate-keys');
		this.addNotification(`Keypair Generated - ${this.getKeySnippet(this.originPublicKey)}`)

      	/** Initialize socket.io for client. **/
		this.socket = io('https://secret-channels.herokuapp.com');
      	this.setupSocketListeners();
    }
})


