from sqlalchemy import Integer, cast, func,  select, update, delete, case
from sqlalchemy.orm import aliased, contains_eager, joinedload, selectinload
from datetime import date, datetime

from database import Base, session_factory, engine
from models import Book, Employee, Customer, Rating, PublishingHouse, Storage, Form


class SyncORM:
    @staticmethod
    def get_customers():
        with session_factory() as session:
            query = (
                select(
                    Customer.id,
                    Customer.firstName,
                    Customer.middleName,
                    Customer.lastName,
                    Customer.phone,
                    Customer.born,
                    Customer.sex
                )
                .order_by(Customer.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            customers = []
            for row in result:
                customer = dict(row)
                customer['born'] = customer['born'].strftime('%Y-%m-%d') if customer['born'] else None
                customers.append(customer)
            return customers
        
    @staticmethod
    def add_customer(new_firstName: str, new_middleName: str, new_lastName: str, new_phone: int, new_born: date, new_sex: str):
        with session_factory() as session:
            new_customer = Customer(
                firstName=new_firstName,
                middleName=new_middleName,
                lastName=new_lastName,
                phone=new_phone,
                born=new_born,
                sex=new_sex
            )
            session.add(new_customer)
            session.commit()
            
    @staticmethod
    def del_customer(c_id: int):
        with session_factory() as session:
            stmt = (
                delete(Customer)
                .filter_by(id=c_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_customers(c_id: int, new_firstName: str, new_middleName: str, new_lastName: str, new_phone: int, new_born: date, new_sex: str):
        with session_factory() as session:
            stmt = (
                update(Customer)
                .values(firstName = new_firstName, middleName = new_middleName, lastName = new_lastName, phone = new_phone, born = new_born, sex = new_sex)
                .filter_by(id=c_id)
            )
            session.execute(stmt)
            session.commit()
            
    @staticmethod
    def get_employee():
        with session_factory() as session:
            query = (
                select(
                    Employee.id,
                    Employee.firstName,
                    Employee.middleName,
                    Employee.lastName,
                    Employee.doc,
                    Employee.phone,
                    Employee.born,
                    Employee.sex
                )
                .order_by(Employee.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            employees = []
            for row in result:
                employee = dict(row)
                employee['born'] = employee['born'].strftime('%Y-%m-%d') if employee['born'] else None
                employees.append(employee)
            return employees
        
    @staticmethod
    def add_employee(new_firstName: str, new_middleName: str, new_lastName: str, new_phone: int, new_born: date, new_sex: str, new_doc: int):
        with session_factory() as session:
            new_employee = Employee(
                firstName=new_firstName,
                middleName=new_middleName,
                lastName=new_lastName,
                doc=new_doc,
                phone=new_phone,
                born=new_born,
                sex=new_sex
            )
            session.add(new_employee)
            session.commit()
            
    @staticmethod
    def del_employee(e_id: int):
        with session_factory() as session:
            stmt = (
                delete(Employee)
                .filter_by(id=e_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_employee(e_id: int, new_firstName: str, new_middleName: str, new_lastName: str, new_phone: int, new_born: date, new_sex: str, new_doc: int):
        with session_factory() as session:
            stmt = (
                update(Employee)
                .values(firstName = new_firstName, middleName = new_middleName, lastName = new_lastName, phone = new_phone, born = new_born, sex = new_sex, doc=new_doc)
                .filter_by(id=e_id)
            )
            session.execute(stmt)
            session.commit()
            
            
    @staticmethod
    def get_rating():
        with session_factory() as session:
            query = (
                select(
                    Rating.id,
                    Rating.rating,
                    Book.id.label('bookId'),
                    Book.name,
                    Book.author
                )
                .join(Book)
                .order_by(Rating.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            ratings = [dict(row) for row in result]
            return ratings
        
    @staticmethod
    def add_rating(new_bookId: int, new_rating: int):
        with session_factory() as session:
            new_rating = Rating(
                bookId=new_bookId,
                rating=new_rating
            )
            session.add(new_rating)
            session.commit()
            
    @staticmethod
    def del_rating(r_id: int):
        with session_factory() as session:
            stmt = (
                delete(Rating)
                .filter_by(id=r_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_rating(new_bookId: int, new_rating: int, r_id: int):
        with session_factory() as session:
            stmt = (
                update(Rating)
                .values(bookId = new_bookId, rating = new_rating)
                .filter_by(id=r_id)
            )
            session.execute(stmt)
            session.commit()
    
    @staticmethod
    def get_book():
        with session_factory() as session:
            query = (
                select(
                    Book.id,
                    Book.name,
                    Book.author,
                    Book.genre
                )
                .order_by(Book.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            books = [dict(row) for row in result]
            return books
        
    @staticmethod
    def add_book(new_name: str, new_author: str, new_genre: str):
        with session_factory() as session:
            new_book = Book(
                name=new_name,
                author=new_author,
                genre=new_genre
            )
            session.add(new_book)
            session.commit()
            
    @staticmethod
    def del_book(b_id: int):
        with session_factory() as session:
            stmt = (
                delete(Book)
                .filter_by(id=b_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_book(new_name: str, new_author: str, new_genre: str, b_id: int):
        with session_factory() as session:
            stmt = (
                update(Book)
                .values(name = new_name, author = new_author, genre=new_genre)
                .filter_by(id=b_id)
            )
            session.execute(stmt)
            session.commit()
    
    
    @staticmethod
    def get_publishing_house():
        with session_factory() as session:
            query = (
                select(
                    PublishingHouse.id,
                    PublishingHouse.year,
                    PublishingHouse.city,
                    PublishingHouse.house,
                    Book.id.label('bookId'),
                    Book.name,
                    Book.author
                )
                .join(Book)
                .order_by(PublishingHouse.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            publishing_houses = [dict(row) for row in result]
            return publishing_houses
        
    @staticmethod
    def add_publishing_house(new_bookId: int, new_house: str, new_city: str, new_year: int):
        with session_factory() as session:
            new_rating = PublishingHouse(
                bookId=new_bookId,
                house = new_house, 
                city = new_city, 
                year = new_year
            )
            session.add(new_rating)
            session.commit()
            
    @staticmethod
    def del_publishing_house(p_id: int):
        with session_factory() as session:
            stmt = (
                delete(PublishingHouse)
                .filter_by(id=p_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_publishing_house(new_bookId: int, new_house: str, new_city: str, new_year: int, p_id: int):
        with session_factory() as session:
            stmt = (
                update(PublishingHouse)
                .values(bookId = new_bookId, house = new_house, city = new_city, year = new_year)
                .filter_by(id=p_id)
            )
            session.execute(stmt)
            session.commit()
    
    @staticmethod
    def get_storage():
        with session_factory() as session:
            query = (
                select(
                    Storage.id,
                    Storage.shelf,
                    Storage.shelving,
                    Storage.bookId,
                    Storage.employeeId,
                    Book.name,
                    Book.author,
                    Employee.firstName,
                    Employee.middleName,
                    Employee.lastName
                )
                .join(Book)
                .join(Employee)
                .order_by(Storage.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            storage = [dict(row) for row in result]
            return storage
        
    @staticmethod
    def add_storage(new_bookId: int, new_employeeId: int, new_shelf: int, new_shelving: int):
        with session_factory() as session:
            new_storage = Storage(
                bookId=new_bookId,
                employeeId = new_employeeId, 
                shelf = new_shelf, 
                shelving = new_shelving
            )
            session.add(new_storage)
            session.commit()
            
    @staticmethod
    def del_storage(s_id: int):
        with session_factory() as session:
            stmt = (
                delete(Storage)
                .filter_by(id=s_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_storage(new_bookId: int, new_employeeId: int, new_shelf: int, new_shelving: int, s_id: int):
        with session_factory() as session:
            stmt = (
                update(Storage)
                .values(bookId=new_bookId, employeeId = new_employeeId, shelf = new_shelf, shelving = new_shelving)
                .filter_by(id=s_id)
            )
            session.execute(stmt)
            session.commit()
            
    @staticmethod
    def get_form():
        with session_factory() as session:
            query = (
                select(
                    Form.id,
                    Form.start,
                    Form.mustEnd,
                    Form.end,
                    Form.customerId,
                    Form.employeeId,
                    Form.bookId,
                    Customer.firstName.label('customerFirstName'),
                    Customer.middleName.label('customerMiddleName'),
                    Customer.lastName.label('customerLastName'),
                    Employee.firstName.label('employeeFirstName'),
                    Employee.middleName.label('employeeMiddleName'),
                    Employee.lastName.label('employeeLastName'),
                    Book.name.label('bookName'),
                    Book.author
                )
                .join(Customer)
                .join(Employee)
                .join(Book)
                .order_by(Form.id)
            )
            res = session.execute(query)
            result = res.mappings().all()
            
            forms = []
            for row in result:
                form = dict(row)
                form['start'] = form['start'].strftime('%Y-%m-%d') if form['start'] else None
                form['end'] = form['end'].strftime('%Y-%m-%d') if form['end'] else None
                form['mustEnd'] = form['mustEnd'].strftime('%Y-%m-%d') if form['mustEnd'] else None
                forms.append(form)
            return forms
        
    @staticmethod
    def add_form(new_customerId: int, new_employeeId: int, new_bookId: int, new_end: date, new_start: date, new_mustEnd: date):
        with session_factory() as session:
            new_form = Form(
                customerId=new_customerId,
                employeeId = new_employeeId, 
                bookId = new_bookId,
                start = new_start, 
                end = new_end,
                mustEnd = new_mustEnd
            )
            session.add(new_form)
            session.commit()
            
    @staticmethod
    def del_form(f_id: int):
        with session_factory() as session:
            stmt = (
                delete(Form)
                .filter_by(id=f_id)
            )
            session.execute(stmt)
            session.commit()
        
        
    @staticmethod
    def upd_form(new_customerId: int, new_employeeId: int, new_bookId: int, new_end: date, new_start: date, new_mustEnd: date, f_id: int):
        with session_factory() as session:
            stmt = (
                update(Form)
                .values(customerId=new_customerId, employeeId = new_employeeId, bookId = new_bookId, start = new_start, end = new_end, mustEnd = new_mustEnd)
                .filter_by(id=f_id)
            )
            session.execute(stmt)
            session.commit()
            
    @staticmethod
    def customer_debts(firstName: str, lastName: str, middleName: str):
        with session_factory() as session:
            query = (
                select(
                    Book.author,
                    Book.name,
                    (func.current_date() - Form.mustEnd).label("overdueDays")
                )
                .join(Form)
                .join(Customer)
                .where(
                    Customer.firstName == firstName,
                    Customer.lastName == lastName,
                    Customer.middleName == middleName,
                    Form.mustEnd < func.current_date()
                )
                .order_by(Customer.firstName)
            )
            res = session.execute(query)
            result = res.mappings().all()
            if result:
                debts = [dict(row) for row in result]
                return {"status": "success", "debts": debts}
            else:
                user_query = (
                    select(func.count(Customer.id))
                    .where(
                        Customer.firstName == firstName,
                        Customer.lastName == lastName,
                        Customer.middleName == middleName
                    )
                )
                user_exists = session.execute(user_query).scalar() > 0

                if user_exists:
                    return {'status': 'no_debts', 'message': f'No overdue books found for {firstName} {middleName} {lastName}'}
                else:
                    return {'status': 'not_found', 'message': f'User with name {firstName} {middleName} {lastName} not found'}
                
                
    @staticmethod
    def book_gallery(genre: str):
        with session_factory() as session:
            rating_subquery = (
                select(
                    func.round(func.avg(Rating.rating), 1).label('avg_rating')
                )
                .where(Rating.bookId == Book.id)
                .scalar_subquery()
            )
            query1 = (
                select(
                    Book.name,
                    Book.author,
                    Storage.shelving,
                    Storage.shelf,
                    rating_subquery.label('avg_rating')
                )
                .join(Storage)
                .where(Book.genre == genre)
                .order_by(Book.name)
            )
            
            query2 = (
                select(
                    Book.name,
                    Book.author,
                    Storage.shelving,
                    Storage.shelf,
                    rating_subquery.label('avg_rating')
                )
                .join(Storage)
                .order_by(Book.name)
            )
            
            if (genre == ""):
                result = session.execute(query2).mappings().all()
            else:
                result = session.execute(query1).mappings().all()
                
            books = [dict(row) for row in result]
            return books
        
    def get_author_statistics():
        date_start = datetime.strptime('2024-01-01', '%Y-%m-%d')
        date_end = datetime.strptime('2024-02-01', '%Y-%m-%d')
        with session_factory() as session:
            query = (
                select(
                    Book.author,
                    func.count().label('borrow_count')
                )
                .join(Form, Form.bookId == Book.id)
                .where(
                    Form.start >= date_start,
                    Form.start < date_end
                )
                .group_by(Book.author)
                .order_by(func.count().desc())
                .limit(1)
            )
            res = session.execute(query)
            result = res.mappings().all()
            author = [dict(row) for row in result]
            return author

    @staticmethod
    def get_genre_statistics():
        with session_factory() as session:
            query = (
                select(
                    Book.genre,
                    func.count().label('amount')
                )
                .join(Form, Form.bookId == Book.id)
                .group_by(Book.genre)
                .order_by(func.count().desc())
            )
            result = session.execute(query).all()

            total_books = sum(row[1] for row in result)
            labels = [row[0] for row in result]
            percentages = [(row[1] / total_books) * 100 for row in result]

            return {
                'status': 'success', 'labels': labels, 'percentages': percentages}

    @staticmethod
    def get_publishing_house_statistics():
        with session_factory() as session:
            query = (
                select(
                    PublishingHouse.house,
                    func.count().label('amount')
                )
                .group_by(PublishingHouse.house)
                .order_by(func.count().desc())
            )
            result = session.execute(query).all()

            total_houses = sum(row[1] for row in result)
            labels = [row[0] for row in result]
            percentages = [(row[1] / total_houses) * 100 for row in result]

            return {
                'status': 'success', 'labels': labels, 'percentages': percentages}

    @staticmethod
    def get_sex_statistics():
        with session_factory() as session:
            query = (
                select(
                    Customer.sex,
                    func.count().label('amount')
                )
                .join(Form)
                .group_by(Customer.sex)
                .order_by(func.count().desc())
            )
            result = session.execute(query).all()

            total_customers = sum(row[1] for row in result)
            sex_percentages = [
                {'sex': row[0], 'percentage': (row[1] / total_customers) * 100}
                for row in result
            ]

            return {
            'status': 'success',
            'sex_percentages': sex_percentages
            }

    def get_age_statistics():
        with session_factory() as session:
            current_date = date.today()
            current_year = current_date.year

            age_groups = case(
                (current_year - func.extract('year', Customer.born) < 18, '<18'),
                (func.extract('year', Customer.born).between(current_year - 25, current_year - 18), '18-25'),
                (func.extract('year', Customer.born).between(current_year - 35, current_year - 26), '26-35'),
                (func.extract('year', Customer.born).between(current_year - 50, current_year - 36), '36-50'),
                (func.extract('year', Customer.born).between(current_year - 60, current_year - 51), '51-60'),
                (current_year - func.extract('year', Customer.born) > 60, '>60')
            ).label('age_group')

            query = (
                select(
                    age_groups,
                    func.count(Customer.id).label('amount')
                )
                .group_by(age_groups)
                .order_by(age_groups)
            )

            result = session.execute(query).all()

            age_groups_order = ['<18', '18-25', '26-35', '36-50', '51-60', '>60']
            age_groups_dict = {group: 0 for group in age_groups_order}
            for row in result:
                age_groups_dict[row[0]] = row[1]

            total_customers = sum(age_groups_dict.values())
            labels = age_groups_order
            percentages = [(age_groups_dict[group] / total_customers) * 100 for group in labels]

            return {
                'status': 'success', 'age_groups': labels, 'percentage': percentages
            }
