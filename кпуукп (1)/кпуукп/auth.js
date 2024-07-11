document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const toggleRegister = document.getElementById('toggle-register');
    const toggleLogin = document.getElementById('toggle-login');

    toggleRegister.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    toggleLogin.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        if (username && password) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            alert('Регистрация успешна!');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    });

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    });
});
