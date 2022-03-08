const socket = io("http://localhost:42069", {
withCredentials: false,
});

const message  = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
	socket.emit('message', { data: message.value })
}

socket.on('message', ({ data }) => {
	handleNewMesage(data);
})

const handleNewMesage = (message) => {
	messages.appendChild(buildNewMessage(message));
}

const buildNewMessage = (message) => {
	const li = document.createElement("li");
	li.appendChild(document.createTextNode(messages));
	return li;
}
