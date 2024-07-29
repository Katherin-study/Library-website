document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const gallery = document.getElementById('books_gallery');
    const deleteButton = document.getElementById('delete');
    const debtsGallery = document.getElementById('debts_gallery');
    const checkButton = document.getElementById('check');
    const nameInput = document.getElementById('name');
    let responseData = null;

    function fetchData(payload) {
        fetch('/api/catalog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            responseData = data;
            if (payload.genre !== undefined) {
                renderBooks();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function renderBooks() {
        if (!gallery) return;
        gallery.querySelectorAll('.book').forEach(book => book.remove());
    
        if (responseData) {
            responseData.books.forEach(book => {
                let bookElement = document.createElement('div');
                bookElement.classList.add('book');
    
                let titleElement = document.createElement('p');
                titleElement.textContent = `"${book.name}"`;
    
                let authorElement = document.createElement('p');
                authorElement.textContent = book.author;

                let br = document.createElement('br');
    
                let shelfElement = document.createElement('p');
                shelfElement.textContent = `Полка: ${book.shelf}, Стеллаж: ${book.shelving}`;
    
                let ratingElement = document.createElement('p');
                ratingElement.textContent = `Рейтинг: ${book.avg_rating}`;
    
                bookElement.appendChild(titleElement);
                bookElement.appendChild(authorElement);
                bookElement.appendChild(br);
                bookElement.appendChild(shelfElement);
                bookElement.appendChild(ratingElement);
    
                gallery.appendChild(bookElement);
            });
        }
    }

    fetchData({ genre: '' });

    if (form) {
        form.addEventListener('change', function (event) {
            if (event.target.type === 'radio') {
                const genre = event.target.value;
                fetchData({ genre: genre });
            }
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', function () {
            form.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

            fetchData({ genre: '' });
        });
    }
    
});
