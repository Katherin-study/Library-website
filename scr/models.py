from sqlalchemy import String, create_engine, text, Date, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import date

class Base(DeclarativeBase):
    pass

class Book(Base):
    __tablename__ = "book"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    author: Mapped[str]
    genre: Mapped[str]

class Customer(Base):
    __tablename__ = "customer"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    firstName: Mapped[str]
    middleName: Mapped[str]
    lastName: Mapped[str]
    phone: Mapped[int] = mapped_column(BigInteger)
    born: Mapped[date] = mapped_column(Date)
    sex: Mapped[str]

class Employee(Base):
    __tablename__ = "employee"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    firstName: Mapped[str]
    middleName: Mapped[str]
    lastName: Mapped[str]
    doc: Mapped[int]
    phone: Mapped[int] = mapped_column(BigInteger)
    born: Mapped[date] = mapped_column(Date)
    sex: Mapped[str]

class Storage(Base):
    __tablename__ = "storage"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    bookId: Mapped[int] = mapped_column(ForeignKey("book.id", ondelete="CASCADE"))
    employeeId: Mapped[int] = mapped_column(ForeignKey("employee.id", ondelete="SET NULL"))
    shelf: Mapped[int]
    shelving: Mapped[int]

class PublishingHouse(Base):
    __tablename__ = "publishing_house"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    bookId: Mapped[int] = mapped_column(ForeignKey("book.id", ondelete="CASCADE"))
    house: Mapped[str]
    year: Mapped[int]
    city: Mapped[str]

class Rating(Base):
    __tablename__ = "rating"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    bookId: Mapped[int] = mapped_column(ForeignKey("book.id", ondelete="CASCADE"))
    rating: Mapped[int]

class Form(Base):
    __tablename__ = "form"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    bookId: Mapped[int] = mapped_column(ForeignKey("book.id", ondelete="CASCADE"))
    employeeId: Mapped[int] = mapped_column(ForeignKey("employee.id", ondelete="SET NULL"))
    customerId: Mapped[int] = mapped_column(ForeignKey("customer.id", ondelete="CASCADE"))
    start: Mapped[date] = mapped_column(Date)
    mustEnd: Mapped[date] = mapped_column(Date)
    end: Mapped[date] = mapped_column(Date, nullable=True)
