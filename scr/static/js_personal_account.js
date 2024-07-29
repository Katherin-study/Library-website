document.addEventListener('DOMContentLoaded', function () {
    const debtsGallery = document.getElementById('debts_gallery');
    const checkButton = document.getElementById('check');
    const nameInput = document.getElementById('name');
    let responseData = null;

    function fetchData(firstName, middleName, lastName) {
        const data = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName
        };

        fetch('/api/personal_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            responseData = data;
            renderDebts();
        })
        .catch(error => {
            console.error('Error:', error);
            renderError('Ошибка соединения с сервером');
        });
    }

    function getDaysText(days) {
        const lastDigit = days % 10;
        if (days >= 11 && days <= 19) {
            return 'дней';
        }
        switch (lastDigit) {
            case 1:
                return 'день';
            case 2:
            case 3:
            case 4:
                return 'дня';
            default:
                return 'дней';
        }
    }

    function renderDebts() {
        debtsGallery.querySelectorAll('.debt').forEach(debt => debt.remove());

        if (responseData) {
            if (responseData.status === 'success') {
                if (responseData.debts.length > 0) {
                    responseData.debts.forEach(debt => {
                        let debtElement = document.createElement('div');
                        debtElement.classList.add('debt');

                        let debtInfoElement = document.createElement('p');
                        debtInfoElement.textContent = `${debt.author} "${debt.name}" просрочена на ${debt.overdueDays} ${getDaysText(debt.overdueDays)}`;

                        debtElement.appendChild(debtInfoElement);
                        debtsGallery.appendChild(debtElement);
                    });
                } else {
                    renderError('Задолженности не найдены');
                }
            } else if (responseData.status === 'no_debts') {
                renderError('Задолженности не найдены');
            } else if (responseData.status === 'not_found') {
                renderError('Пользователь не найден');
            } else {
                renderError(responseData.message || 'Неизвестная ошибка');
            }
        } else {
            renderError('Неизвестная ошибка');
        }
    }

    function renderError(message) {
        let errorElement = document.createElement('p');
        errorElement.classList.add('debt');
        errorElement.textContent = message;
        debtsGallery.appendChild(errorElement);
    }

    checkButton.addEventListener('click', function () {
        const fullName = nameInput.value.trim();
        const nameParts = fullName.split(' ');
        if (nameParts.length > 0) {
            firstName = nameParts[0];
        }
        if (nameParts.length > 1) {
            lastName = nameParts[1];
        }
        if (nameParts.length > 2) {
            middleName = nameParts.slice(2).join(' ');
        }
        fetchData(firstName, lastName, middleName);
    });

    var adminEnterButton = document.getElementById('admin');
    if (adminEnterButton){
        adminEnterButton.addEventListener('click', blurScreen);
    }

    function blurScreen(event) {
        event.preventDefault();
        var overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlay.style.pointerEvents = 'all';
        var passwordForm = document.getElementById('passwordForm');
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var passwordInput = document.getElementById('passwordInput').value;
            if (passwordInput === 'admin') {
                window.location.href = '/customers';
            } else {
                alert('Неверный пароль! Попробуйте еще раз.');
            }
        });
    }
});
