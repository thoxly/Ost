document.addEventListener('DOMContentLoaded', (event) => {
    const registrationForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const showRegisterFormButton = document.getElementById('showRegisterForm');
    const showLoginFormButton = document.getElementById('showLoginForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            if (data.password !== data.confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    const errorText = await response.text();
                    alert('Ошибка при регистрации: ' + errorText);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при регистрации');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.setItem('token', responseData.token);
                    window.location.href = '/company.html';
                } else {
                    const errorText = await response.text();
                    alert('Ошибка при входе: ' + errorText);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при входе');
            }
        });
    }

    if (showRegisterFormButton) {
        showRegisterFormButton.addEventListener('click', function () {
            document.getElementById('registerFormContainer').style.display = 'block';
            document.getElementById('loginForm').style.display = 'none';
        });
    }

    if (showLoginFormButton) {
        showLoginFormButton.addEventListener('click', function () {
            document.getElementById('registerFormContainer').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
    }
});

function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    if (passwordField) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
    }
}
