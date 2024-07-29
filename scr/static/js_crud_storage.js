document.addEventListener("DOMContentLoaded", () => {

    const addBookInput = document.getElementById('add-book');
    const addEmployeeInput = document.getElementById('add-employee');
    const addShelvingInput = document.getElementById('add-shelving');
    const addShelfInput = document.getElementById('add-shelf');
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

    function refreshTable() {
        fetch('/api/storage')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderStorage();
            });
    }

    function updateStorageData(storage) {
        fetch('/api/storage', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(storage)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о хранении обновлены');
                refreshTable();
            }
        });
    }

    function addStorageData(storage){
            fetch('/api/storage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storage)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Данные о хранении добавлены');
                    refreshTable();
                }
            });
    }

    function deleteStorageData(storageId) {
        fetch('/api/storage', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: storageId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о хранении удалены');
                refreshTable();
            }
        });
    }


    function renderStorage() {
        readerTableBody.innerHTML = '';
        books = [];
        employees = [];
        if (responseData) {
            responseData.forEach(storage => {

                let book="\"" + storage.name + "\"" + " " + storage.author;
                let employee = storage.firstName + " " + storage.middleName.charAt(0) + "." + storage.lastName.charAt(0) + ".";
                books.push({ id: storage.bookId, book: book });
                employees.push({ id: storage.employeeId, employee: employee });

                let row = document.createElement('tr');

                let bookCell = document.createElement('td');
                bookCell.textContent = book;

                let employeeCell = document.createElement('td');
                employeeCell.textContent = employee;

                let shelvingCell = document.createElement('td');
                shelvingCell.textContent = storage.shelving;

                let shelfCell = document.createElement('td');
                shelfCell.textContent = storage.shelf;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = storage.id;
                changeBtnContent.addEventListener('click', () => updateStorage(storage));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = storage.id;
                deleteBtnContent.addEventListener('click', () => deleteStorage(storage));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(bookCell);
                row.appendChild(employeeCell);
                row.appendChild(shelvingCell);
                row.appendChild(shelfCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteStorage(storage){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deleteStorageData(storage.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateStorage(storage) {
        const form = document.getElementById('overlay_change');

        let book="\"" + storage.name + "\"" + " " + storage.author;
        let employee = storage.firstName + " " + storage.middleName.charAt(0) + "." + storage.lastName.charAt(0) + ".";

        const bookSelect = form.querySelector('#change-book');
        const employeeSelect = form.querySelector('#change-employee');

        form.querySelector('#change-shelving').value = storage.shelving;
        form.querySelector('#change-shelf').value = storage.shelf;

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

        bookSelect.value = storage.bookId;
        employeeSelect.value = storage.employeeId;
        currentStorageId = storage.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            let bookId = bookSelect.value;
            let employeeId = employeeSelect.value;
            let updatedStorage = {
                id: currentStorageId,
                bookId: bookId,
                employeeId: employeeId,
                shelving: form.querySelector('#change-shelving').value,
                shelf: form.querySelector('#change-shelf').value,
            };

            updateStorageData(updatedStorage);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addBookInput.value && addEmployeeInput.value && addShelvingInput.value && addShelfInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addStorage(){
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

        addShelvingInput.addEventListener('input', validateAddForm);
        addShelfInput.addEventListener('input', validateAddForm);
        addEmployeeInput.addEventListener('select', validateAddForm);
        addBookInput.addEventListener('select', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                let bookId = addBookInput.value;
                let employeeId = addEmployeeInput.value;
                const addData = {
                    bookId: bookId,
                    employeeId: employeeId,
                    shelving: addShelvingInput.value.trim(),
                    shelf: addShelfInput.value.trim()
                };
                addStorageData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addStorage);
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
        downloadLink.setAttribute('download', 'library_data_storage.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});