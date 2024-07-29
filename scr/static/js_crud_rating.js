document.addEventListener("DOMContentLoaded", () => {

    const addBookInput = document.getElementById('add-book');
    const addRatingInput = document.getElementById('add-rating');
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
        fetch('/api/ratings')
            .then(response => response.json())
            .then(data => {
                responseData = data;
                renderRatings();
            });
    }

    function updateRatingData(rating) {
        fetch('/api/ratings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rating)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные рейтинга обновлены');
                refreshTable();
            }
        });
    }

    function addRatingData(rating){
            fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rating)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Новый рейтинг добавлен');
                    refreshTable();
                }
            });
    }

    function deleteRatingData(ratingId) {
        fetch('/api/ratings', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: ratingId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Данные о рейтинге удалены');
                refreshTable();
            }
        });
    }


    function renderRatings() {
        readerTableBody.innerHTML = '';
        books = [];
        if (responseData) {
            responseData.forEach(rating => {

                let book="\"" + rating.name + "\"" + " " + rating.author;
                books.push({ id: rating.bookId, book: book })

                let row = document.createElement('tr');

                let bookCell = document.createElement('td');
                bookCell.textContent = book;

                let ratingCell = document.createElement('td');
                ratingCell.textContent = rating.rating;

                let changeBtn = document.createElement('td');
                changeBtn.classList.add('changeBtn');
                let changeBtnContent = document.createElement('button');
                changeBtnContent.classList.add('changeBtn');
                changeBtnContent.textContent = "Изменить";
                changeBtnContent.value = rating.id;
                changeBtnContent.addEventListener('click', () => updateRating(rating));
                changeBtn.appendChild(changeBtnContent);

                let deleteBtn = document.createElement('td');
                deleteBtn.classList.add('deleteBtn');
                let deleteBtnContent = document.createElement('button');
                deleteBtnContent.classList.add('deleteBtn');
                deleteBtnContent.textContent = "Удалить";
                deleteBtnContent.value = rating.id;
                deleteBtnContent.addEventListener('click', () => deleteRating(rating));
                deleteBtn.appendChild(deleteBtnContent);

                row.appendChild(bookCell);
                row.appendChild(ratingCell);
                row.appendChild(changeBtn);
                row.appendChild(deleteBtn);

                readerTableBody.appendChild(row);
            });
        }
    }

    function deleteRating(rating){
        overlayDelete.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        overlayDelete.style.pointerEvents = 'all';

        function handleDelete() {
            deleteRatingData(rating.id);
            overlayDelete.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }
    
        deleteButtonSubmit.addEventListener('click', handleDelete);
    }

    function updateRating(rating) {
        const form = document.getElementById('overlay_change');

        book="\"" + rating.name + "\"" + " " + rating.author;

        const bookSelect = form.querySelector('#change-book');

        form.querySelector('#change-rating').value = rating.rating;
        bookSelect.innerHTML = '';

        if (books) {
            books.forEach(book => {
                let bookOption = document.createElement('option');
                bookOption.value = book.id;
                bookOption.textContent = book.book;
                bookSelect.appendChild(bookOption);
            });
        }

        bookSelect.value = rating.bookId;
        currentRatingId = rating.id;

        form.style.display = 'flex';
        document.body.style.pointerEvents = 'none';
        form.style.pointerEvents = 'all';

        changeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            let bookId = bookSelect.value;
            let updatedRating = {
                id: currentRatingId,
                bookId: bookId,
                rating: form.querySelector('#change-rating').value,
            };

            updateRatingData(updatedRating);
            form.style.display = 'none';
            document.body.style.pointerEvents = 'all';
        }, { once: true });
    }

    function validateAddForm() {
        if (addBookInput.value && addRatingInput.value) {
            addButtonSubmit.disabled = false;
        } else {
            addButtonSubmit.disabled = true;
        }
    }

    function addRating(){
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

        addRatingInput.addEventListener('input', validateAddForm);
        addBookInput.addEventListener('select', validateAddForm);

        addButtonSubmit.addEventListener('click', function() {
            if (!addButtonSubmit.disabled) {
                let bookId = addBookInput.value;
                const addData = {
                    bookId: bookId,
                    rating: addRatingInput.value.trim()
                };
                addRatingData(addData);
                overlayAdd.style.display = 'none';
                document.body.style.pointerEvents = 'all';
            }
        });
    }

    var addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', addRating);
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
        downloadLink.setAttribute('download', 'library_data_rating.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

});