document.addEventListener("DOMContentLoaded", () => {

    const addFirstNameInput = document.getElementById('add-first-name');
    const addMiddleNameInput = document.getElementById('add-middle-name');
    const addLastNameInput = document.getElementById('add-last-name');
    const addPhoneInput = document.getElementById('add-phone');
    const addBornInput = document.getElementById('add-born');
    const addSexInput = document.getElementById('add-sex');
    const nameDeleteInput = document.getElementById('delete-last-name');
    const overlayDelete = document.getElementById('overlay_delete');
    const overlayAdd = document.getElementById('overlay_add');
    const overlayChange = document.getElementById('overlay_change');
    const changeSubmitButton = document.getElementById('change-submit'); 
    const deleteButtonSubmit = document.getElementById('delete-submit');
    const addButtonSubmit = document.getElementById('add-submit');
    const downloadButton = document.getElementById('save');
    const readerTableBody = document.getElementById('readerTableBody');
    let responseData = null;
    let currentCustomerId = null;

    function refreshTable() {
        fetch('/api/customers')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderReaders();
            });
    }

    function updateCustomerData(customer) {
        fetch('/api/customers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные читателя обновлены');
                refreshTable();
            }
        });
    }

    function addCustomerData(customer){
            fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Новый читатель добавлен');
                    refreshTable();
                }
            });
    }

    function deleteCustomerData(customerId) {
        fetch('/api/customers', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: customerId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о читателе удалены');
                refreshTable();
            }
        });
    }


    function renderReaders() {
        readerTableBody.innerHTML = '';
        if (responseData) {
            responseData.forEach(customer => {
                let row = document.createElement('tr');

                let lastNameCell = document.createElement('td');
                lastNameCell.textContent = customer.firstName;

                let firstNameCell = document.createElement('td');
                firstNameCell.textContent = customer.middleName;

                let middleNameCell = document.createElement('td');
                middleNameCell.textContent = customer.lastName;

                let phoneCell = document.createElement('td');
                phoneCell.textContent = customer.phone;

                let birthDateCell = document.createElement('td');
                birthDateCell.textContent = customer.born;

                let sexCell = document.createElement('td');
                sexCell.textContent = customer.sex;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = customer.id;
                changeBtnContent.addEventListener('click', () => updateCustomer(customer));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = customer.id;
                deleteBtnContent.addEventListener('click', () => deleteCustomer(customer));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(lastNameCell);
                row.appendChild(firstNameCell);
                row.appendChild(middleNameCell);
                row.appendChild(phoneCell);
                row.appendChild(birthDateCell);
                row.appendChild(sexCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteCustomer(customer){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deleteCustomerData(customer.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateCustomer(customer) {
        const form = document.getElementById('overlay_change');

        form.querySelector('#change-first-name').value = customer.firstName;
        form.querySelector('#change-middle-name').value = customer.middleName;
        form.querySelector('#change-last-name').value = customer.lastName;
        form.querySelector('#change-phone').value = customer.phone;
        form.querySelector('#change-born').value = customer.born;
        form.querySelector('#change-sex').value = customer.sex;

        currentCustomerId = customer.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();

            let updatedCustomer = {
                id: currentCustomerId,
                firstName: form.querySelector('#change-first-name').value,
                middleName: form.querySelector('#change-middle-name').value,
                lastName: form.querySelector('#change-last-name').value,
                phone: form.querySelector('#change-phone').value,
                born: form.querySelector('#change-born').value,
                sex: form.querySelector('#change-sex').value
            };

            updateCustomerData(updatedCustomer);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addFirstNameInput.value && addMiddleNameInput.value && addLastNameInput.value && addPhoneInput.value && addBornInput.value && addSexInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addCustomer(){
        overlayAdd.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayAdd.style.pointerEvents = 'all';

        addFirstNameInput.addEventListener('input', validateAddForm);
        addMiddleNameInput.addEventListener('input', validateAddForm);
        addLastNameInput.addEventListener('input', validateAddForm);
        addPhoneInput.addEventListener('input', validateAddForm);
        addBornInput.addEventListener('input', validateAddForm);
        addSexInput.addEventListener('input', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                const addData = {
                    action: 'add',
                    firstName: addFirstNameInput.value.trim(),
                    middleName: addMiddleNameInput.value.trim(),
                    lastName: addLastNameInput.value.trim(),
                    phone: addPhoneInput.value.trim(),
                    born: addBornInput.value.trim(),
                    sex: addSexInput.value.trim()
                };
                addCustomerData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addCustomer);
    }

    refreshTable();

    downloadButton.addEventListener('click', function() {
        downloadCSV();
    });

    function downloadCSV() {
        const table = document.getElementById('readerTable');
        const rows = table.querySelectorAll('tr');
        const csv = [];
    
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            const cellCount = cells.length;
            
            cells.forEach((cell, index) => {
                if (index < cellCount - 2) { 
                    rowData.push(cell.innerText);
                }
            });
            csv.push(rowData.join(';'));
        });
    
        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csv.join('\n');
    
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', encodeURI(csvContent));
        downloadLink.setAttribute('download', 'library_data_customer.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    

});