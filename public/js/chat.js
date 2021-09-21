const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8080/api/auth/' :
    'https://crs-restserver.herokuapp.com/api/auth/'

let user = null;
let socket = null;
let oldBtn = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogoud = document.querySelector('#btnLogoud');
const chatEmit = document.querySelector('#chatEmit');

// Validar token de localStorage
const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { login: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await socketConnect();
}

const socketConnect = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    /* socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets disconect');
    }); */

    socket.on('recibe-message', listMessages);

    socket.on('active-users', listUsers);

    socket.on('private-message', (payload) => {
        // TODO: evento recibido...
        console.log('Privado: ', payload);
    });
}

const listUsers = (users = []) => {
    let usersHTML = '';
    users.forEach(({ name, uid }) => {
        usersHTML += `
        <li>
        <p>
            <h5 class="text-success">${name}</h5>
            <span class="fs-6 text-muted">Id: ${uid}</span>
            <br>
            <button id="${uid}" onclick="whisperUser('${uid}', '${name}')" class="btn btn-success btn-sm mt-1">Susurrar</button>
        </p>
        </li>
        `;
    });

    ulUsers.innerHTML = usersHTML;
}

const whisperUser = (id, name) => {
    if (oldBtn === id) {
        const btnWhisperId = document.getElementById(id);
        btnWhisperId.classList.replace('btn-secondary', 'btn-success');
        btnWhisperId.disabled = true;
        txtUid.value = '';
        chatEmit.innerText = `Chat General`
        chatEmit.classList.replace('text-success', 'text-secondary');
    } else {
        if (oldBtn != null) {
            const btnWhisperOld = document.getElementById(oldBtn);
            btnWhisperOld.disabled = false;
            btnWhisperOld.classList.replace('btn-secondary', 'btn-success');
        }
        const btnWhisperId = document.getElementById(id);
        btnWhisperId.disabled = false;
        btnWhisperId.classList.replace('btn-success', 'btn-secondary');
        oldBtn = id;
        txtUid.value = id;
        chatEmit.innerText = `a ${name}`
        chatEmit.classList.replace('text-secondary', 'text-success');

    }
}

const listMessages = (messages = []) => {
    let messagesHTML = '';
    messages.forEach(({ name, message }) => {
        messagesHTML += `
        <li>
        <p>
            <span class="text-primary">${name}:</span>
            <span class="fs-6 text-muted">${message}</span>
        </p>
        </li>
        `;
    });

    ulMessages.innerHTML = messagesHTML;
    txtUid.style.color = "gray";
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;



    if (keyCode !== 13) {
        return;
    }
    if (message.length === 0) {
        return;
    }
    socket.emit('send-message', { message, uid });
    txtMessage.value = '';
})

const main = async () => {

    //Validar JWT
    await validateJWT();

}

main();


