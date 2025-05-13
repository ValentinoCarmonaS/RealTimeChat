// frontend/script.js
const socket = io({ auth: { token: localStorage.getItem('token') } });
let currentName = '';
let currentRoomId = '';

function showLogin() {
	document.getElementById('login-form').style.display = 'block';
	document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
	document.getElementById('login-form').style.display = 'none';
	document.getElementById('register-form').style.display = 'block';
}

function showAuth() {
	document.getElementById('auth-section').style.display = 'block';
	document.getElementById('rooms-section').style.display = 'none';
	document.getElementById('chat-section').style.display = 'none';
}

function showRooms() {
	document.getElementById('auth-section').style.display = 'none';
	document.getElementById('rooms-section').style.display = 'block';
	document.getElementById('chat-section').style.display = 'none';
	fetchRooms();
}

function showChat(roomId, roomName) {
	currentRoomId = roomId;
	document.getElementById('chat-room-name').textContent = roomName;
	document.getElementById('auth-section').style.display = 'none';
	document.getElementById('rooms-section').style.display = 'none';
	document.getElementById('chat-section').style.display = 'block';
	document.getElementById('messages').innerHTML = '';
	socket.emit('join', { username: currentName, roomId });
}

function showNewRoomForm() {
	document.getElementById('new-room-form').style.display = 'block';
}

function cancelNewRoom() {
	document.getElementById('new-room-form').style.display = 'none';
	document.getElementById('new-room-name').value = '';
}

async function login() {
	const email = document.getElementById('login-email').value.trim();
	const password = document.getElementById('login-password').value.trim();

	if (!email || !password) return alert('Completa todos los campos');

	try {
		const res = await fetch('http://localhost:3000/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem('token', data.token);
			currentName = data.name; // Asumimos que el backend devuelve el nombre
			socket.auth.token = data.token;
			showRooms();
		} else {
			alert(data.error || 'Error al iniciar sesión');
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

async function register() {
	const name = document.getElementById('register-name').value.trim();
	const email = document.getElementById('register-email').value.trim();
	const password = document.getElementById('register-password').value.trim();

	if (!name || !email || !password) return alert('Completa todos los campos');

	try {
		const res = await fetch('http://localhost:3000/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password }),
		});
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem('token', data.token);
			currentName = name;
			socket.auth.token = data.token;
			showRooms();
		} else {
			alert(data.error || 'Error al registrarse');
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

async function fetchRooms() {
	try {
		const res = await fetch('http://localhost:3000/api/rooms', {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		});
		const rooms = await res.json();
		const roomsList = document.getElementById('rooms-list');
		roomsList.innerHTML = '';
		rooms.forEach(room => {
			const li = document.createElement('li');
			li.textContent = room.name;
			li.onclick = () => showChat(room._id, room.name);
			roomsList.appendChild(li);
		});
	} catch (error) {
		alert('Error al cargar salas');
	}
}

async function createRoom() {
	const name = document.getElementById('new-room-name').value.trim();
	if (!name) return alert('Ingresa un nombre para la sala');

	try {
		const res = await fetch('http://localhost:3000/api/rooms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({ name }),
		});
		const room = await res.json();
		if (res.ok) {
			cancelNewRoom();
			fetchRooms();
			showChat(room._id, room.name);
		} else {
			alert(room.error || 'Error al crear sala');
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

function backToRooms() {
	currentRoomId = '';
	document.getElementById('messages').innerHTML = '';
	showRooms();
}

function sendMessage() {
	const message = document.getElementById('message-input').value.trim();
	if (message) {
		socket.emit('sendMessage', message);
		document.getElementById('message-input').value = '';
	}
}

socket.on('loadMessages', messages => {
	const messagesDiv = document.getElementById('messages');
	messages.forEach(msg => {
		const div = document.createElement('div');
		div.className = `message ${msg.username === currentName ? 'sent' : 'received'}`;
		div.textContent = `${msg.username}: ${msg.message}`;
		messagesDiv.appendChild(div);
	});
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('message', msg => {
	const messagesDiv = document.getElementById('messages');
	const div = document.createElement('div');
	div.className = `message ${msg.username === currentName ? 'sent' : 'received'}`;
	div.textContent = `${msg.username}: ${msg.message}`;
	messagesDiv.appendChild(div);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('notification', msg => {
	const messagesDiv = document.getElementById('messages');
	const div = document.createElement('div');
	div.className = 'message notification';
	div.textContent = msg;
	messagesDiv.appendChild(div);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Verificar si hay token al cargar
if (localStorage.getItem('token')) {
	fetch('http://localhost:3000/api/auth/verify', {
		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	})
		.then(res => {
			if (res.ok) return res.json();
			throw new Error('Token inválido');
		})
		.then(data => {
			currentName = data.name; // Asumimos que el backend devuelve el nombre
			showRooms();
		})
		.catch(() => {
			localStorage.removeItem('token');
			showAuth();
		});
} else {
	showAuth();
}