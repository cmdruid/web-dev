
/** Method Index. **/
export const methods = {
    addNotification,
    setupSocketListeners,
    sendMessage,
    joinRoom,
    addMessage
};

/** Append a notification message in the UI. **/
function addNotification (message) {
    const timestamp = new Date().toLocaleTimeString();
    this.notifications.push({ message, timestamp });
};

/** Setup socket.io event listeners. **/
function setupSocketListeners () {

    // Automatically join default room on connect.
    this.socket.on('disconnect', () => {
        this.addNotification('Connected To Server.');
        this.joinRoom();
    });

    // Notify user when they lose connection to socket.
    this.socket.on('disconnect', () => this.addNotification('Lost connection to socket!'));

    // Display messages when received.
    this.socket.on('MESSAGE', (message) => {
        this.addMessage(message);
    });
};

/** Send the current draft message. **/
function sendMessage () {

    // Don't send a blank message!
    if (!this.draft || this.draft === '') { return; }

    const message = this.draft;

    // Reset the UI input text, add message and emit.
    this.draft = '';
    this.addMessage(message);
    this.socket.emit('MESSAGE', message);
}

/** Join the chat room. **/
function joinRoom () { this.socket.emit('JOIN'); }

/** Add message to UI. **/
function addMessage (message) { this.messages.push(message); }