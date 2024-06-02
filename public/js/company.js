document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM полностью загружен и обработан');

    document.getElementById('link-home').addEventListener('click', () => {
        console.log('Переход на главную страницу');
        document.getElementById('home').style.display = 'block';
        document.getElementById('company').style.display = 'none';
    });

    document.getElementById('link-company').addEventListener('click', () => {
        console.log('Переход на страницу "Моя компания"');
        document.getElementById('home').style.display = 'none';
        document.getElementById('company').style.display = 'block';
        fetchCompanyData();
    });

    document.getElementById('editButton').addEventListener('click', () => {
        console.log('Нажата кнопка "Редактировать"');
        toggleEdit(true);
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        console.log('Нажата кнопка "Отменить"');
        toggleEdit(false);
        fetchCompanyData();
    });


    document.getElementById('companyForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Отправка формы компании');
        const formData = new FormData(event.target);
        const companyData = Object.fromEntries(formData.entries());

        console.log('Данные компании:', companyData);

        const response = await fetch('/company', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(companyData)
        });

        if (response.ok) {
            console.log('Данные компании успешно сохранены');
            alert('Данные успешно сохранены');
            toggleEdit(false);
        } else {
            console.error('Ошибка при сохранении данных компании:', response.statusText);
            alert('Ошибка при сохранении данных');
        }
    });

    document.getElementById('addWarrantyButton').addEventListener('click', () => {
        console.log('Нажата кнопка "Добавить новый" в разделе гарантийных писем');
        document.getElementById('warrantyFileInput').click();
    });


    document.getElementById('warrantyFileInput').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const base64File = await toBase64(file);
    
        // Получение данных из локального хранилища
        const contactFirstName = localStorage.getItem('contactFirstName') || "exampleFirstName";
        const contactLastName = localStorage.getItem('contactLastName') || "exampleLastName";
        const contactPatronymic = localStorage.getItem('contactPatronymic') || "examplePatronymic";
        const contactPhone = localStorage.getItem('contactPhone') || "examplePhone";
        const contactEmail = localStorage.getItem('contactEmail') || "exampleEmail";
        const companyName = localStorage.getItem('companyName') || "exampleCompanyName";
        const companyINN = localStorage.getItem('companyINN') || "exampleINN";
        const kpp = localStorage.getItem('kpp') || "exampleKPP";
    
        const data = {
            contactFirstName,
            contactLastName,
            contactPatronymic,
            contactPhone,
            contactEmail,
            companyName,
            companyINN,
            kpp,
            warranty_file_inRow: base64File, // Base64 строка файла
            fileName: file.name, // Имя файла
            __directory: "00000000-0000-0000-0000-000000000000",
            __subscribers: ["00000000-0000-0000-0000-000000000000"],
            __externalProcessMeta: "undefined",
            __externalId: "example",
            vkhodyashii_nomer: "example",
            statusGroupId: "a35cd8de-0c73-4f6a-8218-90193d02e2e0"
        };
    
        console.log('Отправляемые данные на сервер:', data);
    
        try {
            const response = await fetch('/warranty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                console.log('Документ успешно загружен');
                alert('Документ успешно загружен');
            } else {
                const errorText = await response.text();
                console.error('Ошибка при загрузке документа:', errorText);
                alert('Ошибка при загрузке документа');
            }
        } catch (error) {
            console.error('Ошибка при загрузке документа:', error);
            alert('Ошибка при загрузке документа');
        }
    });
    

    function toggleEdit(editMode) {
        document.querySelectorAll('#companyForm input').forEach(input => {
            input.disabled = !editMode;
        });
        document.getElementById('editButton').style.display = editMode ? 'none' : 'inline-block';
        document.getElementById('saveButton').style.display = editMode ? 'inline-block' : 'none';
        document.getElementById('cancelButton').style.display = editMode ? 'inline-block' : 'none';
    }

    async function fetchCompanyData() {
        try {
            const response = await fetch('/company', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Данные компании получены:', data);
                document.getElementById('companyName').value = data.companyName || '';
                document.getElementById('companyInn').value = data.companyInn || '';
                document.getElementById('companyKpp').value = data.companyKpp || '';
                document.getElementById('contactPhone').value = data.contactPhone || '';
                document.getElementById('contactLastName').value = data.contactLastName || '';
                document.getElementById('contactFirstName').value = data.contactFirstName || '';
                document.getElementById('contactMiddleName').value = data.contactMiddleName || '';
                document.getElementById('contactEmail').value = data.contactEmail || '';
                document.getElementById('contactTelegram').value = data.contactTelegram || '';
            } else {
                const errorText = await response.text();
                console.error('Ошибка при получении информации о компании:', errorText);
                alert('Ошибка при получении информации о компании');
            }
        } catch (error) {
            console.error('Ошибка при запросе данных компании:', error);
            alert('Ошибка при получении информации о компании');
        }
    }

    async function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log('Base64 файла:', reader.result); // Добавлено логирование
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = error => {
                console.error('Ошибка при преобразовании файла в Base64:', error); // Добавлено логирование
                reject(error);
            };
        });
    }
    

    /*/async function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }*/

    if (window.location.hash === '#company') {
        document.getElementById('link-company').click();
    }
});
