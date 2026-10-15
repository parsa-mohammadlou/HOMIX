# HOMIX — Django E-commerce Website

A Persian, right-to-left (RTL) e-commerce website for home appliances, built with Django, PostgreSQL, HTML, CSS, and JavaScript.

HOMIX is a portfolio project designed to demonstrate full-stack web development skills, including product management, customer authentication, shopping cart functionality, order processing, and separate customer and management panels.

## Features

### Customer Features
- User registration and login
- Responsive, Persian RTL user interface
- Product browsing and product detail pages
- Shopping cart with quantity management
- Checkout form and order submission
- Server-side price calculation
- Stock availability validation and inventory updates
- Customer dashboard
- Order history and order status tracking

### Management Features
- Separate management login
- Staff-only access to management pages
- Add and manage products
- Upload product images
- View registered customers
- View customer orders
- Update order statuses

### Technical Features
- Django-based backend
- PostgreSQL database
- Django authentication and session management
- Django ORM for database operations
- Transaction-based order processing
- HTML, CSS, and JavaScript frontend
- Image handling with Pillow
- Environment variables for sensitive configuration

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django 5.2 | Web framework |
| PostgreSQL | Relational database |
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Client-side interactions |
| Pillow | Image processing |
| python-dotenv | Environment variable management |

## Project Structure

```text
HOMIX/
├── app/
│   ├── migrations/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── templates/
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── homix/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── .env.example
├── .gitignore
├── manage.py
└── requirements.txt
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.11 or a compatible Python version
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/parsa-mohammadlou/HOMIX.git
cd HOMIX
```

### 2. Create a Virtual Environment

On Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root, next to `manage.py`.

Add the following configuration and replace the example values with your local settings:

```dotenv
SECRET_KEY=replace-with-a-secret-key
DB_NAME=Homix
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
```

Create the PostgreSQL database specified by `DB_NAME` before running migrations.

**Security:** Never commit your real `.env` file, database password, or Django secret key to GitHub.

### 5. Apply Database Migrations

```bash
python manage.py migrate
```

### 6. Create a Django Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run the Development Server

```bash
python manage.py runserver
```

Open the following address in your browser:

http://127.0.0.1:8000/

## Order Processing

HOMIX supports order submission, server-side price calculation, inventory validation, and order status management.

The checkout process records orders in the database. **A real online payment gateway is not currently implemented.**

## Project Status

- Core storefront and product pages implemented
- Customer authentication and dashboard implemented
- Shopping cart and checkout implemented
- Order management implemented
- Local development setup
- Public deployment not yet configured

## Future Improvements

- Integrate an online payment gateway
- Deploy to a production server
- Add automated tests for critical workflows
- Improve production security and error handling
- Add screenshots and a live demo

## Author

**Parsa Mohammadlou**

GitHub: [@parsa-mohammadlou](https://github.com/parsa-mohammadlou)

---

*HOMIX is a portfolio project created to demonstrate Django web development skills.*

---

# HOMIX — فروشگاه اینترنتی لوازم خانگی با جنگو

HOMIX یک وب‌سایت فروشگاهی فارسی و راست‌چین (RTL) برای عرضه لوازم خانگی است که با استفاده از Django، PostgreSQL، HTML، CSS و JavaScript توسعه داده شده است.

این پروژه با هدف نمایش مهارت‌های توسعه وب و ساخت یک نمونه‌کار کاربردی طراحی شده و امکاناتی مانند مدیریت محصولات، احراز هویت کاربران، سبد خرید، ثبت سفارش و پنل‌های جداگانه مشتری و مدیریت را ارائه می‌دهد.

## امکانات پروژه

### امکانات مشتریان

- ثبت‌نام و ورود کاربران
- رابط کاربری فارسی و راست‌چین
- مشاهده محصولات و جزئیات هر محصول
- سبد خرید با امکان تغییر تعداد کالاها
- فرم تسویه‌حساب و ثبت سفارش
- محاسبه قیمت سفارش در سمت سرور
- بررسی موجودی و به‌روزرسانی تعداد کالاها
- پنل اختصاصی مشتری
- مشاهده تاریخچه سفارش‌ها و وضعیت آن‌ها

### امکانات پنل مدیریت

- ورود جداگانه به بخش مدیریت
- محدود کردن دسترسی پنل مدیریت به کاربران دارای مجوز
- افزودن و مدیریت محصولات
- بارگذاری تصاویر محصولات
- مشاهده فهرست مشتریان ثبت‌نام‌شده
- مشاهده سفارش‌های ثبت‌شده
- تغییر وضعیت سفارش‌ها

### ویژگی‌های فنی

- توسعه بک‌اند با فریم‌ورک Django
- استفاده از PostgreSQL برای ذخیره‌سازی اطلاعات
- استفاده از سیستم احراز هویت و نشست‌های Django
- مدیریت داده‌ها با Django ORM
- پردازش سفارش‌ها با استفاده از تراکنش‌های پایگاه داده
- توسعه رابط کاربری با HTML، CSS و JavaScript
- مدیریت تصاویر با کتابخانه Pillow
- نگهداری تنظیمات محرمانه در متغیرهای محیطی

## فناوری‌های استفاده‌شده

| فناوری | کاربرد |
|---|---|
| Python | برنامه‌نویسی بک‌اند |
| Django 5.2 | فریم‌ورک توسعه وب |
| PostgreSQL | پایگاه داده رابطه‌ای |
| HTML5 | ساختار صفحات |
| CSS3 | طراحی و استایل صفحات |
| JavaScript | تعاملات سمت کاربر |
| Pillow | پردازش تصاویر |
| python-dotenv | مدیریت متغیرهای محیطی |

## ساختار پروژه

```text
HOMIX/
├── app/
│   ├── migrations/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── templates/
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── homix/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── .env.example
├── .gitignore
├── manage.py
└── requirements.txt
```

## راه‌اندازی پروژه

### پیش‌نیازها

برای اجرای پروژه به موارد زیر نیاز دارید:

- Python 3.11 یا نسخه سازگار با وابستگی‌های پروژه
- PostgreSQL
- Git

### ۱. دریافت پروژه

```bash
git clone https://github.com/parsa-mohammadlou/HOMIX.git
cd HOMIX
```

### ۲. ایجاد محیط مجازی

در ویندوز:

```bash
python -m venv venv
venv\Scripts\activate
```

### ۳. نصب وابستگی‌ها

```bash
python -m pip install -r requirements.txt
```

### ۴. تنظیم متغیرهای محیطی

در کنار فایل `manage.py`، یک فایل با نام `.env` ایجاد کنید و مقادیر زیر را متناسب با تنظیمات سیستم خود وارد کنید:

```dotenv
SECRET_KEY=replace-with-a-secret-key
DB_NAME=Homix
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
```

پیش از اجرای مهاجرت‌ها، پایگاه داده PostgreSQL با نام تعیین‌شده را ایجاد کنید.

**نکته امنیتی