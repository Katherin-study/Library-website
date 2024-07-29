document.addEventListener("DOMContentLoaded", () => {

    const addNameInput = document.getElementById('add-name');
    const addAuthorInput = document.getElementById('add-author');
    const addGenreInput = document.getElementById('add-genre');
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
        fetch('/api/books')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderBooks();
            });
    }

    function updateBookData(book) {
        fetch('/api/books', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные книги обновлены');
                refreshTable();
            }
        });
    }

    function addBookData(book){
            fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Новая книга добавлена');
                    refreshTable();
                }
            });
    }

    function deleteBookData(bookId) {
        fetch('/api/books', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о книге удалены');
                refreshTable();
            }
        });
    }


    function renderBooks() {
        readerTableBody.innerHTML = '';
        if (responseData) {
            responseData.forEach(book => {
                let row = document.createElement('tr');

                let nameCell = document.createElement('td');
                nameCell.textContent = book.name;

                let authorCell = document.createElement('td');
                authorCell.textContent = book.author;

                let genreCell = document.createElement('td');
                genreCell.textContent = book.genre;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = book.id;
                changeBtnContent.addEventListener('click', () => updateBook(book));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = book.id;
                deleteBtnContent.addEventListener('click', () => deleteBook(book));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(nameCell);
                row.appendChild(authorCell);
                row.appendChild(genreCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteBook(book){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deleteBookData(book.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateBook(book) {
        const form = document.getElementById('overlay_change');

        form.querySelector('#change-name').value = book.name;
        form.querySelector('#change-author').value = book.author;
        form.querySelector('#change-genre').value = book.genre;

        currentBookId = book.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();

            let updatedBook = {
                id: currentBookId,
                name: form.querySelector('#change-name').value,
                author: form.querySelector('#change-author').value,
                genre: form.querySelector('#change-genre').value
            };

            updateBookData(updatedBook);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addNameInput.value && addAuthorInput.value && addGenreInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addBook(){
        overlayAdd.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayAdd.style.pointerEvents = 'all';

        addNameInput.addEventListener('input', validateAddForm);
        addAuthorInput.addEventListener('input', validateAddForm);
        addGenreInput.addEventListener('input', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                const addData = {
                    name: addNameInput.value.trim(),
                    author: addAuthorInput.value.trim(),
                    genre: addGenreInput.value.trim()
                };
                addBookData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addBook);
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
        downloadLink.setAttribute('download', 'library_data_book.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});