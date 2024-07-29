document.addEventListener("DOMContentLoaded", () => {

    const addCustomerInput = document.getElementById('add-customer');
    const addBookInput = document.getElementById('add-book');
    const addEmployeeInput = document.getElementById('add-employee');
    const addStartInput = document.getElementById('add-start');
    const addMustEndInput = document.getElementById('add-must-end');
    const addEndInput = document.getElementById('add-end');
    const overlayDelete = document.getElementById('overlay_delete');
    const overlayAdd = document.getElementById('overlay_add');
    const changeSubmitButton = document.getElementById('change-submit'); 
    const deleteButtonSubmit = document.getElementById('delete-submit');
    const addButtonSubmit = document.getElementById('add-submit');
    const downloadButton = document.getElementById('save');
    const readerTableBody = document.getElementById('readerTableBody');
    let responseData = null;
    let currentRatingId = null;
    let doc;
    let books = [];
    let employees = [];
    let cusromers = [];

    function refreshTable() {
        fetch('/api/form')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderForm();
            });
    }

    function updateFormData(form) {
        fetch('/api/form', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные формуляра обновлены');
                refreshTable();
            }
        });
    }

    function addFormData(form){
            fetch('/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Запись добавлена в формуляр');
                    refreshTable();
                }
            });
    }

    function deleteFormData(formId) {
        fetch('/api/form', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: formId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Запись удалена из формуляра');
                refreshTable();
            }
        });
    }


    function renderForm() {
        readerTableBody.innerHTML = '';
        books = [];
        employees = [];
        customers = [];
        if (responseData) {
            responseData.forEach(form => {

                let book="\"" + form.bookName + "\"" + " " + form.author;
                let employee = form.employeeFirstName + " " + form.employeeMiddleName.charAt(0) + "." + form.employeeLastName.charAt(0) + ".";
                let customer = form.customerFirstName + " " + form.customerMiddleName.charAt(0) + "." + form.customerLastName.charAt(0) + ".";
                books.push({ id: form.bookId, book: book });
                employees.push({ id: form.employeeId, employee: employee });
                customers.push({ id: form.customerId, customer: customer });

                let row = document.createElement('tr');

                let customerCell = document.createElement('td');
                customerCell.textContent = customer;

                let bookCell = document.createElement('td');
                bookCell.textContent = book;

                let employeeCell = document.createElement('td');
                employeeCell.textContent = employee;

                let startCell = document.createElement('td');
                startCell.textContent = form.start;

                let mustEndCell = document.createElement('td');
                mustEndCell.textContent = form.mustEnd;

                let endCell = document.createElement('td');
                endCell.textContent = form.end;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = form.id;
                changeBtnContent.addEventListener('click', () => updateForm(form));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = form.id;
                deleteBtnContent.addEventListener('click', () => deleteForm(form));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(customerCell);
                row.appendChild(bookCell);
                row.appendChild(employeeCell);
                row.appendChild(startCell);
                row.appendChild(mustEndCell);
                row.appendChild(endCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteForm(form) {
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';
    
        function handleDelete() {
            deleteFormData(form.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
            
            deleteButtonSubmit.removeEventListener('click', handleDelete);
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateForm(Form) {
        const form = document.getElementById('overlay_change');

        let book="\"" + Form.bookName + "\"" + " " + Form.author;
        let employee = Form.employeeFirstName + " " + Form.employeeMiddleName.charAt(0) + "." + Form.employeeLastName.charAt(0) + ".";
        let customer = Form.customerFirstName + " " + Form.customerMiddleName.charAt(0) + "." + Form.customerLastName.charAt(0) + ".";

        const bookSelect = form.querySelector('#change-book');
        const employeeSelect = form.querySelector('#change-employee');
        const customerSelect = form.querySelector('#change-customer');

        form.querySelector('#change-start').value = Form.start;
        form.querySelector('#change-must-end').value = Form.mustEnd;
        form.querySelector('#change-end').value = Form.end;

        bookSelect.innerHTML = '';

        if (books) {
            books.forEach(book => {
                let bookOption = document.createElement('option');
                bookOption.value = book.id;
                bookOption.textContent = book.book;
                bookSelect.appendChild(bookOption);
            });
        }

        employeeSelect.innerHTML = '';

        if (employees) {
            employees.forEach(employee => {
                let employeeOption = document.createElement('option');
                employeeOption.value = employee.id;
                employeeOption.textContent = employee.employee;
                employeeSelect.appendChild(employeeOption);
            });
        }

        customerSelect.innerHTML = '';

        if (customers) {
            customers.forEach(customer => {
                let customerOption = document.createElement('option');
                customerOption.value = customer.id;
                customerOption.textContent = customer.customer;
                customerSelect.appendChild(customerOption);
            });
        }

        bookSelect.value = Form.bookId;
        employeeSelect.value = Form.employeeId;
        customerSelect.value = Form.customerId;
        currentFormId = Form.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            let bookId = bookSelect.value;
            let employeeId = employeeSelect.value;
            let customerId = customerSelect.value;
            let updatedForm = {
                id: currentFormId,
                customerId: customerId,
                bookId: bookId,
                employeeId: employeeId,
                start: form.querySelector('#change-start').value,
                mustEnd: form.querySelector('#change-must-end').value,
                end: form.querySelector('#change-end').value,
            };

            updateFormData(updatedForm);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addCustomerInput.value && addBookInput.value && addEmployeeInput.value && addStartInput.value && addMustEndInput.value && addEndInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addForm(){
        overlayAdd.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayAdd.style.pointerEvents = 'all';

        addBookInput.innerHTML = '';

        if (books) {
            books.forEach(book => {
                let bookOption = document.createElement('option');
                bookOption.value = book.id;
                bookOption.textContent = book.book;
                addBookInput.appendChild(bookOption);
            });
        }

        addEmployeeInput.innerHTML = '';

        if (employees) {
            employees.forEach(employee => {
                let employeeOption = document.createElement('option');
                employeeOption.value = employee.id;
                employeeOption.textContent = employee.employee;
                addEmployeeInput.appendChild(employeeOption);
            });
        }

        addCustomerInput.innerHTML = '';

        if (customers) {
            customers.forEach(customer => {
                let customerOption = document.createElement('option');
                customerOption.value = customer.id;
                customerOption.textContent = customer.customer;
                addCustomerInput.appendChild(customerOption);
            });
        }

        addStartInput.addEventListener('input', validateAddForm);
        addEndInput.addEventListener('input', validateAddForm);
        addMustEndInput.addEventListener('input', validateAddForm);
        addEmployeeInput.addEventListener('select', validateAddForm);
        addBookInput.addEventListener('select', validateAddForm);
        addCustomerInput.addEventListener('select', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                let bookId = addBookInput.value;
                let employeeId = addEmployeeInput.value;
                let customerId = addCustomerInput.value;
                const addData = {
                    customerId: customerId,
                    bookId: bookId,
                    employeeId: employeeId,
                    start: addStartInput.value.trim(),
                    mustEnd: addMustEndInput.value.trim(),
                    end: addEndInput.value.trim(),
                };
                addFormData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addForm);
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
        downloadLink.setAttribute('download', 'library_data_form.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});