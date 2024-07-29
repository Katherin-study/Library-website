document.addEventListener("DOMContentLoaded", () => {

    const addBookInput = document.getElementById('add-book');
    const addHouseInput = document.getElementById('add-house');
    const addYearInput = document.getElementById('add-year');
    const addCityInput = document.getElementById('add-city');
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
    let currentRatingId = null;
    let doc;
    let books = [];

    function refreshTable() {
        fetch('/api/publishing_houses')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderPublishingHouses();
            });
    }

    function updatePublishingHouseData(publishingHouse) {
        fetch('/api/publishing_houses', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publishingHouse)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные издательствв обновлены');
                refreshTable();
            }
        });
    }

    function addPublishingHouseData(publishingHouse){
            fetch('/api/publishing_houses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(publishingHouse)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Новое издательство добавлено');
                    refreshTable();
                }
            });
    }

    function deletePublishingHouseData(publishingHouseId) {
        fetch('/api/publishing_houses', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: publishingHouseId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные об издательстве удалены');
                refreshTable();
            }
        });
    }


    function renderPublishingHouses() {
        readerTableBody.innerHTML = '';
        books = [];
        if (responseData) {
            responseData.forEach(publishingHouse => {

                let book="\"" + publishingHouse.name + "\"" + " " + publishingHouse.author;
                books.push({ id: publishingHouse.bookId, book: book })

                let row = document.createElement('tr');

                let bookCell = document.createElement('td');
                bookCell.textContent = book;

                let houseCell = document.createElement('td');
                houseCell.textContent = publishingHouse.house;

                let yearCell = document.createElement('td');
                yearCell.textContent = publishingHouse.year;

                let cityCell = document.createElement('td');
                cityCell.textContent = publishingHouse.city;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = publishingHouse.id;
                changeBtnContent.addEventListener('click', () => updatePublishingHouse(publishingHouse));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = publishingHouse.id;
                deleteBtnContent.addEventListener('click', () => deletePublishingHouse(publishingHouse));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(bookCell);
                row.appendChild(houseCell);
                row.appendChild(yearCell);
                row.appendChild(cityCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deletePublishingHouse(publishingHouse){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deletePublishingHouseData(publishingHouse.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updatePublishingHouse(publishingHouse) {
        const form = document.getElementById('overlay_change');

        book="\"" + publishingHouse.name + "\"" + " " + publishingHouse.author;

        const bookSelect = form.querySelector('#change-book');

        form.querySelector('#change-house').value = publishingHouse.house;
        form.querySelector('#change-year').value = publishingHouse.year;
        form.querySelector('#change-city').value = publishingHouse.city;

        bookSelect.innerHTML = '';

        if (books) {
            books.forEach(book => {
                let bookOption = document.createElement('option');
                bookOption.value = book.id;
                bookOption.textContent = book.book;
                bookSelect.appendChild(bookOption);
            });
        }

        bookSelect.value = publishingHouse.bookId;
        currentPublishingHouseId = publishingHouse.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            let bookId = bookSelect.value;
            let updatedPublishingHouse = {
                id: currentPublishingHouseId,
                bookId: bookId,
                house: form.querySelector('#change-house').value,
                year: form.querySelector('#change-year').value,
                city: form.querySelector('#change-city').value,
            };

            updatePublishingHouseData(updatedPublishingHouse);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addBookInput.value && addHouseInput.value && addYearInput.value && addCityInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addPublishingHouse(){
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

        addHouseInput.addEventListener('input', validateAddForm);
        addYearInput.addEventListener('input', validateAddForm);
        addCityInput.addEventListener('input', validateAddForm);
        addBookInput.addEventListener('select', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                let bookId = addBookInput.value;
                const addData = {
                    bookId: bookId,
                    house: addHouseInput.value.trim(),
                    year: addYearInput.value.trim(),
                    city: addCityInput.value.trim()
                };
                addPublishingHouseData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addPublishingHouse);
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
        downloadLink.setAttribute('download', 'library_data_publishing_house.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});