from flask import Flask, jsonify, render_template, request
from datetime import datetime
from orm import SyncORM

app = Flask(__name__)

@app.route('/customers')
def index_customers():
    return render_template('crud_customer.html')

@app.route('/employees')
def index_employee():
    return render_template('crud_employee.html')

@app.route('/ratings')
def index_rating():
    return render_template('crud_rating.html')

@app.route('/books')
def index_book():
    return render_template('crud_book.html')

@app.route('/publishing_houses')
def index_publishing_house():
    return render_template('crud_publishing_house.html')

@app.route('/storage')
def index_storage():
    return render_template('crud_storage.html')

@app.route('/form')
def index_form():
    return render_template('crud_form.html')

@app.route('/personal_account')
def index_personal_account():
    return render_template('personal_account.html')

@app.route('/catalog')
def index_catalog():
    return render_template('catalog.html')

@app.route('/')
def index():
    return render_template('main.html')


@app.route('/api/customers', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_customers():
    if request.method == 'GET':
        customers = SyncORM.get_customers()
        return jsonify(customers)
    elif request.method == 'PUT':
        data = request.json
        born_date = datetime.strptime(data['born'], '%Y-%m-%d').date()
        SyncORM.upd_customers(
            c_id=data['id'],
            new_firstName=data['firstName'],
            new_middleName=data['middleName'],
            new_lastName=data['lastName'],
            new_phone=data['phone'],
            new_born=born_date,
            new_sex=data['sex']
        )
        return jsonify({"success": True, "message": "Customer updated successfully"})
    elif request.method == 'POST':
        data = request.json
        born_date = datetime.strptime(data['born'], '%Y-%m-%d').date()
        SyncORM.add_customer(
            new_firstName=data['firstName'],
            new_middleName=data['middleName'],
            new_lastName=data['lastName'],
            new_phone=data['phone'],
            new_born=born_date,
            new_sex=data['sex']
        )
        return jsonify({"success": True, "message": "Customer added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_customer(c_id=data['id'])
        return jsonify({"success": True, "message": "Customer deleted successfully"})
    
    
@app.route('/api/employees', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_employees():
    if request.method == 'GET':
        employees = SyncORM.get_employee()
        return jsonify(employees)
    elif request.method == 'PUT':
        data = request.json
        born_date = datetime.strptime(data['born'], '%Y-%m-%d').date()
        SyncORM.upd_employee(
            e_id=data['id'],
            new_firstName=data['firstName'],
            new_middleName=data['middleName'],
            new_lastName=data['lastName'],
            new_doc=data['doc'],
            new_phone=data['phone'],
            new_born=born_date,
            new_sex=data['sex']
        )
        return jsonify({"success": True, "message": "Employee updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        born_date = datetime.strptime(data['born'], '%Y-%m-%d').date()
        SyncORM.add_employee(
            new_firstName=data['firstName'],
            new_middleName=data['middleName'],
            new_lastName=data['lastName'],
            new_doc=data['doc'],
            new_phone=data['phone'],
            new_born=born_date,
            new_sex=data['sex']
        )
        return jsonify({"success": True, "message": "Employee added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_employee(e_id=data['id'])
        return jsonify({"success": True, "message": "Employee deleted successfully"})
    
    
@app.route('/api/ratings', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_ratings():
    if request.method == 'GET':
        ratings = SyncORM.get_rating()
        return jsonify(ratings)
    elif request.method == 'PUT':
        data = request.json
        SyncORM.upd_rating(
            r_id=data['id'],
            new_bookId=data['bookId'],
            new_rating=data['rating']
        )
        return jsonify({"success": True, "message": "Rating updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        SyncORM.add_rating(
            new_bookId=data['bookId'],
            new_rating=data['rating']
        )
        return jsonify({"success": True, "message": "Rating added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_rating(r_id=data['id'])
        return jsonify({"success": True, "message": "Rating deleted successfully"})
    
@app.route('/api/books', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_books():
    if request.method == 'GET':
        books = SyncORM.get_book()
        return jsonify(books)
    elif request.method == 'PUT':
        data = request.json
        SyncORM.upd_book(
            b_id=data['id'],
            new_name=data['name'],
            new_author=data['author'],
            new_genre=data['genre']
        )
        return jsonify({"success": True, "message": "Book updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        SyncORM.add_book(
            new_name=data['name'],
            new_author=data['author'],
            new_genre=data['genre']
        )
        return jsonify({"success": True, "message": "Book added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_book(b_id=data['id'])
        return jsonify({"success": True, "message": "Book deleted successfully"})
    
    
@app.route('/api/publishing_houses', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_publishing_houses():
    if request.method == 'GET':
        publishing_houses = SyncORM.get_publishing_house()
        return jsonify(publishing_houses)
    elif request.method == 'PUT':
        data = request.json
        SyncORM.upd_publishing_house(
            p_id=data['id'],
            new_house=data['house'],
            new_year=data['year'],
            new_city=data['city'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Publishing house updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        SyncORM.add_publishing_house(
            new_house=data['house'],
            new_year=data['year'],
            new_city=data['city'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Publishing house added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_publishing_house(p_id=data['id'])
        return jsonify({"success": True, "message": "Publishing house deleted successfully"})


@app.route('/api/storage', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_storage():
    if request.method == 'GET':
        storage = SyncORM.get_storage()
        return jsonify(storage)
    elif request.method == 'PUT':
        data = request.json
        SyncORM.upd_storage(
            s_id=data['id'],
            new_shelf=data['shelf'],
            new_shelving=data['shelving'],
            new_employeeId=data['employeeId'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Storage updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        SyncORM.add_storage(
            new_shelf=data['shelf'],
            new_shelving=data['shelving'],
            new_employeeId=data['employeeId'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Storage added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_storage(s_id=data['id'])
        return jsonify({"success": True, "message": "Storage deleted successfully"})
    
@app.route('/api/form', methods=['GET', 'PUT', 'POST', 'DELETE'])
def manage_form():
    if request.method == 'GET':
        form = SyncORM.get_form()
        return jsonify(form)
    elif request.method == 'PUT':
        data = request.json
        start_date = datetime.strptime(data['start'], '%Y-%m-%d').date()
        mustEnd_date = datetime.strptime(data['mustEnd'], '%Y-%m-%d').date()
        if data['end']:
            end_date = datetime.strptime(data['end'], '%Y-%m-%d').date()
        else:
            end_date = None
        SyncORM.upd_form(
            f_id=data['id'],
            new_start=start_date,
            new_mustEnd=mustEnd_date,
            new_end=end_date,
            new_employeeId=data['employeeId'],
            new_customerId=data['customerId'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Form updated successfully"})
    
    elif request.method == 'POST':
        data = request.json
        start_date = datetime.strptime(data['start'], '%Y-%m-%d').date()
        mustEnd_date = datetime.strptime(data['mustEnd'], '%Y-%m-%d').date()
        if data['end']:
            end_date = datetime.strptime(data['end'], '%Y-%m-%d').date()
        else:
            end_date = None
        SyncORM.add_form(
            new_start=start_date,
            new_mustEnd=mustEnd_date,
            new_end=end_date,
            new_employeeId=data['employeeId'],
            new_customerId=data['customerId'],
            new_bookId=data['bookId']
        )
        return jsonify({"success": True, "message": "Form added successfully"})
    elif request.method == 'DELETE':
        data = request.json
        SyncORM.del_form(f_id=data['id'])
        return jsonify({"success": True, "message": "Form deleted successfully"})
    
    
@app.route('/api/personal_account', methods=['POST'])
def manage_debts():
    data = request.json
    debts_response = SyncORM.customer_debts(firstName=data['firstName'], middleName=data['middleName'], lastName=data['lastName'])
    return jsonify(debts_response)

@app.route('/api/catalog', methods=['POST'])
def manage_book_gallery():
    data = request.json
    books = SyncORM.book_gallery(genre=data['genre'])
    return jsonify({"books": books})

@app.route('/api/main', methods=['POST'])
def manage_statistics():
    author_of_the_month = SyncORM.get_author_statistics()
    genre_percentages = SyncORM.get_genre_statistics()
    publishing_house_data = SyncORM.get_publishing_house_statistics()
    sex_percentages = SyncORM.get_sex_statistics()
    age_group_percentages = SyncORM.get_age_statistics()
    return jsonify({"author_of_the_month": author_of_the_month, "genre_percentages": genre_percentages, "publishing_house_data": publishing_house_data, "sex_percentages": sex_percentages, "age_group_percentages": age_group_percentages})
    
if __name__ == "__main__":
    app.run(debug=True)
