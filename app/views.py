from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from .models import Product, Order, OrderItem
from django.contrib.auth.models import User
import json
from django.contrib import messages
from django.db import transaction
from django.views.decorators.http import require_POST


def home(request):

    products = Product.objects.all()

    context = {
        'products' : products ,
    }
    return render(request, 'home.html', context)


def manager(request):

    if request.user.is_authenticated and request.user.is_staff:
        
        return redirect("panel")

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None and user.is_staff:

            login(request, user)

            return redirect("panel")

        if user is not None and not user.is_staff :
            context = {
                "error" : "شما اجازه دسترسی به این بخش را ندارید"
            }
            return render(request,'manager.html', context)

        return render(
            request,
            "manager.html",
            {
                "error": "نام کاربری یا رمز عبور اشتباه است."
            }
        )

    return render(request, "manager.html")

def is_admin(user):
    # return user.is_staff
    return user.is_authenticated and user.is_staff

@login_required(login_url="manager")
@user_passes_test(is_admin)
def panel(request):

    return render(request, "panel.html")


def logout_view(request):

    logout(request)
    request.session.flush()

    return redirect("manager")




@login_required(login_url="manager")
@user_passes_test(is_admin)
def add_product(request):


    if request.method == 'POST':

        # گرفتن اطلاعات کالا
        name = request.POST.get("productName")
        brand = request.POST.get("brand")
        category = request.POST.get("category")
        price = request.POST.get("price")
        stock = request.POST.get("stock")
        description = request.POST.get("description")
        image = request.FILES.get('image')

        # اضافه کردن اصلاعات به دیتابیس
        product = Product(name = name , brand = brand , category = category , price = price , stock = stock , description = description , image = image)

        product.save()
        return redirect('add-product')


    return render(request, 'add-product.html')

@login_required(login_url="manager")
@user_passes_test(is_admin)
def products(request):

    products = Product.objects.all()
    
    context = {
        'products' : products ,
    }
    return render(request, 'products.html', context)


@login_required(login_url="manager")
@user_passes_test(is_admin)
def delete_product(request, id):
    if request.method == 'POST':

        # product = Product.objects.all()[id]
        product = Product.objects.get(id = id )


        product.delete()

    return redirect('products')

@login_required(login_url="manager")
@user_passes_test(is_admin)
def customers(request):
    users = User.objects.filter(is_staff=False, is_superuser=False)
    context = {
        'customers' : users
    }
    return render(request, 'customers.html', context)


@login_required(login_url="manager")
@user_passes_test(is_admin)
def manage_orders(request):

    orders = (
        Order.objects
        .select_related("user")
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    context = {
        "orders": orders,
        "status_choices": Order.STATUS_CHOICES,
    }

    return render(
        request,
        "panel/orders2.html",
        context
    )


@user_passes_test(
    lambda user: user.is_authenticated and user.is_staff,
    login_url="manager"
)
@require_POST
def update_order_status(request, order_id):

    order = get_object_or_404(Order, id=order_id)

    new_status = request.POST.get("status")

    valid_statuses = dict(Order.STATUS_CHOICES)

    if new_status not in valid_statuses:
        messages.error(request, "وضعیت انتخاب‌شده معتبر نیست.")
        return redirect("manage_orders")

    order.status = new_status
    order.save(update_fields=["status"])

    messages.success(
        request,
        f"وضعیت سفارش شماره {order.id} تغییر کرد."
    )

    return redirect("manage_orders")




@login_required(login_url="loginuser")
def userpanel(request):
    user = request.user
    context = {
        "customer" : user,
    }

    return render(request, 'panel-user-5.html', context) 

def loginuser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request,username=username, password=password)

        if user is not None :
           
            login(request, user)
            
            return redirect("userpanel")
            
        return render(
            request,
            "loginuser.html",
            {
                "error": "نام کاربری یا رمز عبور اشتباه است."
            }
            )



    return render(request ,'loginuser.html')


def register(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')

        user = User.objects.filter(username=username) 
        
        if user.exists():

            context = {
                "error" : 'این نام کاربری قبلا ثبت شده است'
            }

            return render(request,'registe.html', context)
        
        if password != password_confirm :
            context = {
                "error" : 'رمزها یکسان نمیباشند '
            }

            return render(request,'register', context)

        user = User.objects.create_user(username=username,email=email,password=password)
        


        return redirect('loginuser')
           


    return render(request ,'register.html')


def logout_user(request):

    logout(request)
    request.session.flush()

    return redirect("home")

@login_required(login_url="loginuser")
def cart(request):

    return render(request, 'cart-page.html')



@login_required(login_url="loginuser")
def checkout(request):

    # نمایش فرم ثبت سفارش
    if request.method == "GET":
        return render(request, "checkout2.html")

    # فقط درخواست POST مجاز است
    if request.method != "POST":
        return redirect("cart")

    # دریافت اطلاعات گیرنده
    first_name = request.POST.get("first_name", "").strip()
    last_name = request.POST.get("last_name", "").strip()
    phone = request.POST.get("phone", "").strip()
    address = request.POST.get("address", "").strip()

    # دریافت اطلاعات سبد خرید از فرانت‌اند
    cart_data = request.POST.get("cart_data", "")

    # بررسی اطلاعات ضروری
    if not first_name or not last_name or not phone or not address:
        messages.error(
            request,
            "لطفاً نام، نام خانوادگی، شماره تماس و نشانی را وارد کنید."
        )
        return redirect("checkout")

    # تبدیل اطلاعات سبد خرید از JSON به پایتون
    # try:
    #     cart = json.loads(cart_data)

    #     if not isinstance(cart, list) or not cart:
    #         raise ValueError
 
    #     quantities = {}

    #     for item in cart:
    #         product_id = int(item["id"])
    #         quantity = int(item["quantity"])

    #         if product_id <= 0 or quantity <= 0:
    #             raise ValueError

    #         quantities[product_id] = (
    #             quantities.get(product_id, 0) + quantity
    #         )

    # except (ValueError, TypeError, KeyError, json.JSONDecodeError):
    #     messages.error(request, "اطلاعات سبد خرید معتبر نیست.")
    #     return redirect("cart")


# تبدیل اطلاعات سبد خرید از JSON به پایتون
    try:
        cart = json.loads(cart_data)

        if not isinstance(cart, list) or not cart or len(cart) > 100:
            raise ValueError

        quantities = {}

        for item in cart:

            if not isinstance(item, dict):
                raise ValueError

            raw_id = item.get("id")
            raw_quantity = item.get("quantity")

            # رد کردن مقادیر بولی و ورودی‌های نامعتبر
            if (
                isinstance(raw_id, bool)
                or isinstance(raw_quantity, bool)
            ):
                raise ValueError

            product_id = int(raw_id)
            quantity = int(raw_quantity)

            if (
                product_id <= 0
                or quantity <= 0
                or quantity > 100
            ):
                raise ValueError

            quantities[product_id] = (
                quantities.get(product_id, 0) + quantity
            )

            # محدودیت تعداد تجمیعی هر محصول
            if quantities[product_id] > 100:
                raise ValueError

    except (ValueError, TypeError, KeyError, json.JSONDecodeError):
        messages.error(request, "اطلاعات سبد خرید معتبر نیست.")
        return redirect("cart")


    # ایجاد سفارش و اقلام آن در یک تراکنش
    with transaction.atomic():

        # دریافت محصولات و قفل‌کردن رکوردها در دیتابیس‌های پشتیبان
        products = Product.objects.select_for_update().filter(
            id__in=quantities.keys()
        )

        products_by_id = {
            product.id: product
            for product in products
        }

        # بررسی وجود تمام محصولات
        if len(products_by_id) != len(quantities):
            messages.error(
                request,
                "یکی از محصولات سبد خرید دیگر موجود نیست."
            )
            return redirect("cart")

        # total_price = 0

        # # بررسی موجودی و محاسبه قیمت از دیتابیس
        # for product_id, quantity in quantities.items():

        #     product = products_by_id[product_id]

        #     if product.stock < quantity:
        #         messages.error(
        #             request,
        #             f"موجودی محصول «{product.name}» کافی نیست."
        #         )
        #         return redirect("cart")

        #     total_price += product.price * quantity


        # محاسبه مبلغ محصولات
        total_price = 0

        for product_id, quantity in quantities.items():

            product = products_by_id[product_id]

            if product.stock < quantity:
                messages.error(
                    request,
                    f"موجودی محصول «{product.name}» کافی نیست."
                )
                return redirect("cart")

            total_price += product.price * quantity

        # هزینه ثابت ارسال
        shipping_cost = 50000

        # مبلغ نهایی شامل هزینه ارسال
        total_price += shipping_cost


        # ذخیره سفارش اصلی
        order = Order.objects.create(
            user=request.user,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            address=address,
            total_price=total_price,
        )

        # order = Order(user=request.user,
        #             first_name=first_name,
        #             last_name=last_name,
        #             phone=phone,
        #             address=address,
        #             total_price=total_price,)
        # order.save()

        order_items = []

        # ذخیره محصولات سفارش و کم‌کردن موجودی
        for product_id, quantity in quantities.items():

            product = products_by_id[product_id]

            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price,
                )
            )

            product.stock -= quantity
            product.save(update_fields=["stock"])

        # ذخیره تمام اقلام سفارش
        OrderItem.objects.bulk_create(order_items)

    # نگهداری شناسه سفارش برای صفحه موفقیت
    request.session["last_order_id"] = order.id

    return redirect("order_success")


@login_required(login_url="loginuser")
def order_success(request):

    order_id = request.session.get("last_order_id")

    if not order_id:
        return redirect("userpanel")

    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    context = {
        "order": order,
    }

    return render(request, "order-success2.html", context)



@login_required(login_url="loginuser")
def my_orders(request):

    orders = Order.objects.filter(user=request.user).order_by("-created_at")

    context = {
        "orders": orders,
    }

    return render(request,"my-orders2.html",context)


def product_details(request, id):

    product = Product.objects.get(id = id )

    related_products = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    context = {
        'product' : product,
        "related_products": related_products,
    }

    return render(request,'product-details.html', context)

# def delete_product(request, id):
#     if request.method == 'POST':

#         # product = Product.objects.all()[id]
#         product = Product.objects.get(id = id )


#         product.delete()

#     return redirect('products')



















     