document.addEventListener("DOMContentLoaded", () => {

    const addFirstNameInput = document.getElementById('add-first-name');
    const addMiddleNameInput = document.getElementById('add-middle-name');
    const addLastNameInput = document.getElementById('add-last-name');
    const addPhoneInput = document.getElementById('add-phone');
    const addBornInput = document.getElementById('add-born');
    const addSexInput = document.getElementById('add-sex');
    const addPassportInput = document.getElementById('add-passport');
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
    let currentEmployeeId = null;
    let doc;

    function refreshTable() {
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderEmployees();
            });
    }

    function updateEmployeeData(employee) {
        fetch('/api/employees', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(employee);
                alert('Данные работника обновлены');
                refreshTable();
            }
        });
    }

    function addEmployeeData(employee){
            fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Новый работник добавлен');
                    refreshTable();
                }
            });
    }

    function deleteEmployeeData(employeeId) {
        fetch('/api/employees', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: employeeId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о работнике удалены');
                refreshTable();
            }
        });
    }


    function renderEmployees() {
        readerTableBody.innerHTML = '';
        if (responseData) {
            responseData.forEach(employee => {
                let row = document.createElement('tr');

                let lastNameCell = document.createElement('td');
                lastNameCell.textContent = employee.firstName;

                let firstNameCell = document.createElement('td');
                firstNameCell.textContent = employee.middleName;

                let middleNameCell = document.createElement('td');
                middleNameCell.textContent = employee.lastName;

                let passportCell = document.createElement('td');
                employee.doc = employee.doc.replace(/(\d{4})(\d+)/, '$1 $2');
                passportCell.textContent = employee.doc;

                let phoneCell = document.createElement('td');
                phoneCell.textContent = employee.phone;

                let birthDateCell = document.createElement('td');
                birthDateCell.textContent = employee.born;

                let sexCell = document.createElement('td');
                sexCell.textContent = employee.sex;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = employee.id;
                changeBtnContent.addEventListener('click', () => updateEmployee(employee));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = employee.id;
                deleteBtnContent.addEventListener('click', () => deleteEmployee(employee));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(lastNameCell);
                row.appendChild(firstNameCell);
                row.appendChild(middleNameCell);
                row.appendChild(passportCell);
                row.appendChild(phoneCell);
                row.appendChild(birthDateCell);
                row.appendChild(sexCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteEmployee(employee){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deleteEmployeeData(employee.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateEmployee(employee) {
        const form = document.getElementById('overlay_change');

        form.querySelector('#change-first-name').value = employee.firstName;
        form.querySelector('#change-middle-name').value = employee.middleName;
        form.querySelector('#change-last-name').value = employee.lastName;
        form.querySelector('#change-passport').value = employee.doc;
        form.querySelector('#change-phone').value = employee.phone;
        form.querySelector('#change-born').value = employee.born;
        form.querySelector('#change-sex').value = employee.sex;

        currentEmployeeId = employee.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            doc = form.querySelector('#change-passport').value.replace(/\s+/g, '');
            let updatedEmployee = {
                id: currentEmployeeId,
                firstName: form.querySelector('#change-first-name').value,
                middleName: form.querySelector('#change-middle-name').value,
                lastName: form.querySelector('#change-last-name').value,
                doc: doc,
                phone: form.querySelector('#change-phone').value,
                born: form.querySelector('#change-born').value,
                sex: form.querySelector('#change-sex').value
            };

            updateEmployeeData(updatedEmployee);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addFirstNameInput.value && addMiddleNameInput.value && addLastNameInput.value && addPhoneInput.value && addBornInput.value && addSexInput.value && addPassportInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addEmployee(){
        overlayAdd.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayAdd.style.pointerEvents = 'all';

        addFirstNameInput.addEventListener('input', validateAddForm);
        addMiddleNameInput.addEventListener('input', validateAddForm);
        addLastNameInput.addEventListener('input', validateAddForm);
        addPassportInput.addEventListener('input', validateAddForm);
        addPhoneInput.addEventListener('input', validateAddForm);
        addBornInput.addEventListener('input', validateAddForm);
        addSexInput.addEventListener('input', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            doc = addPassportInput.value.replace(/\s+/g, '');
            if (!addButtonSubmit.disabled) {
                const addData = {
                    firstName: addFirstNameInput.value.trim(),
                    middleName: addMiddleNameInput.value.trim(),
                    lastName: addLastNameInput.value.trim(),
                    doc: doc,
                    phone: addPhoneInput.value.trim(),
                    born: addBornInput.value.trim(),
                    sex: addSexInput.value.trim()
                };
                addEmployeeData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addEmployee);
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
        downloadLink.setAttribute('download', 'library_data_employee.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});