let socket = null;
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
		const res = await fetch(
			'http://localhost:3000/api/auth/login',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			}
		);
		const data = await res.json();
		if (res.ok && data.success) {
			const { token, user } = data.data;
			localStorage.setItem('token', token);
			currentName = user.name;

			initSocket(token);
			showRooms();
		} else {
			alert(data.message);
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

async function register() {
	const name = document.getElementById('register-name').value.trim();
	const email = document.getElementById('register-email').value.trim();
	const password = document
		.getElementById('register-password')
		.value.trim();

	if (!name || !email || !password)
		return alert('Completa todos los campos');

	try {
		const res = await fetch(
			'http://localhost:3000/api/auth/register',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			}
		);
		const data = await res.json();
		if (res.ok && data.success) {
			const { token, user } = response.data;
			localStorage.setItem('token', token);
			currentName = user.name;

			initSocket(data.token);
			showRooms();
		} else {
			for (i = 0; i < data.errors.length; i++) {
				if (data.errors[i].path === 'email') {
					alert(data.errors[i].msg);
					return;
				} else if (data.errors[i].path === 'name') {
					alert('The name is too long');
					return;
				}
			}
			alert(data.message || 'Error al registrarse');
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

// frontend/script.js (solo la función initSocket actualizada)
function initSocket(token) {
    socket = io({
        auth: { token }
    });

    socket.on('connect_error', err => {
        console.error('Error de conexión de socket:', err.message);
    });

    socket.on('loadMessages', messages => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = ''; // Limpiar mensajes existentes
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.username === currentName ? 'sent' : 'received'}`;
            div.textContent = `${msg.username}: ${msg.message}`;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll al final al cargar
    });

    socket.on('message', msg => {
        const messagesDiv = document.getElementById('messages');
        const div = document.createElement('div');
        div.className = `message ${msg.username === currentName ? 'sent' : 'received'}`;
        div.textContent = `${msg.username}: ${msg.message}`;
        messagesDiv.appendChild(div);
        // Scroll suave solo si el usuario está cerca del final
        requestAnimationFrame(() => {
            const isNearBottom = messagesDiv.scrollHeight - messagesDiv.scrollTop - messagesDiv.clientHeight < 100;
            if (isNearBottom) {
                messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
            }
        });
    });

    socket.on('notification', msg => {
        const messagesDiv = document.getElementById('messages');
        const div = document.createElement('div');
        div.className = 'message notification';
        div.textContent = msg;
        messagesDiv.appendChild(div);
        // Scroll suave solo si el usuario está cerca del final
        requestAnimationFrame(() => {
            const isNearBottom = messagesDiv.scrollHeight - messagesDiv.scrollTop - messagesDiv.clientHeight < 100;
            if (isNearBottom) {
                messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
            }
        });
    });
}

async function fetchRooms() {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			alert('No hay token, por favor inicia sesión');
			showAuth();
			return;
		}

		const res = await fetch('http://localhost:3000/api/room', {
			headers: { Authorization: `Bearer ${token}` }
		});
		const data = await res.json();
		if (res.ok && data.success) {
			const rooms = data.rooms;
			const roomsList = document.getElementById('rooms-list');
			roomsList.innerHTML = '';
			rooms.forEach(room => {
				const li = document.createElement('li');
				const span = document.createElement('span');
				span.textContent = room.name;
				span.onclick = () =>
					showChat(room._id, room.name);
				li.appendChild(span);
				const decoded = JSON.parse(
					atob(token.split('.')[1])
				);
				if (decoded.id === room.createdBy) {
					const deleteBtn =
						document.createElement(
							'button'
						);
					deleteBtn.textContent = 'Eliminar';
					deleteBtn.onclick = () =>
						deleteRoom(room._id);
					li.appendChild(deleteBtn);
				}
				roomsList.appendChild(li);
			});
		} else {
			alert(data.message || 'Error al cargar salas');
		}
	} catch (error) {
		alert('Error de conexión al cargar salas: ' + error.message);
	}
}

async function createRoom() {
	const name = document.getElementById('new-room-name').value.trim();
	if (!name) return alert('Ingresa un nombre para la sala');

	try {
		const res = await fetch('http://localhost:3000/api/room', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({ name })
		});
		const data = await res.json();
		if (res.ok && data.success) {
			cancelNewRoom();
			fetchRooms();
			showChat(data.room._id, data.room.name);
		} else {
			alert(data.message || 'Error al crear sala');
		}
	} catch (error) {
		alert('Error de conexión');
	}
}

async function deleteRoom(roomId) {
	if (!confirm('¿Estás seguro de eliminar esta sala?')) return;
	try {
		const res = await fetch(
			`http://localhost:3000/api/room/${roomId}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}
		);
		const data = await res.json();
		if (res.ok && data.success) {
			fetchRooms();
		} else {
			alert(data.message || 'Error al eliminar sala');
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

if (localStorage.getItem('token')) {
	const token = localStorage.getItem('token');
	console.log('Token al cargar página:', token);
	try {
		// Decodificar el token para obtener el nombre del usuario
		const decoded = JSON.parse(atob(token.split('.')[1]));
		currentName = decoded.name || localStorage.getItem('currentName') || '';
		if (!currentName) {
			throw new Error('Nombre de usuario no encontrado en el token');
		}
		// Verificar token con GET /api/room
		fetch('http://localhost:3000/api/room', {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => {
				if (res.ok) return res.json();
				throw new Error('Token inválido');
			})
			.then(data => {
				console.log('Respuesta GET /api/room:', data);
				if (data.success) {
					localStorage.setItem('currentName', currentName); // Persistir nombre
					initSocket(token);
					// Restaurar sala si existe
					const savedRoomId = localStorage.getItem('currentRoomId');
					const savedRoomName = localStorage.getItem('currentRoomName');
					if (savedRoomId && savedRoomName) {
						showChat(savedRoomId, savedRoomName);
					} else {
						showRooms();
					}
				} else {
					throw new Error(data.message || 'Error al verificar token');
				}
			})
			.catch(error => {
				console.error('Error al verificar token:', error);
				localStorage.removeItem('token');
				localStorage.removeItem('currentName');
				localStorage.removeItem('currentRoomId');
				localStorage.removeItem('currentRoomName');
				alert(error.message || 'Sesión inválida, por favor inicia sesión');
				showAuth();
			});
	} catch (error) {
		console.error('Error al decodificar token:', error);
		localStorage.removeItem('token');
		localStorage.removeItem('currentName');
		localStorage.removeItem('currentRoomId');
		localStorage.removeItem('currentRoomName');
		alert('Token corrupto, por favor inicia sesión');
		showAuth();
	}
} else {
	showAuth();
}