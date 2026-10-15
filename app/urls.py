
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('product-detail/<int:id>', views.product_details, name='product_detail'),

    # پنل ادمین
    path('manager/', views.manager, name='manager'),
    path('panel/', views.panel, name='panel'),
    path('logout/', views.logout_view, name='logout'),
    path('panel/add-product', views.add_product, name='add-product'),
    path('panel/products', views.products, name='products'),
    path(
        'panel/delete-product/<int:id>/',
        views.delete_product,
        name='delete-product'
    ),
    path('panel/customers', views.customers, name='customers'),

    # حساب کاربری مشتری
    path('loginuser/', views.loginuser, name='loginuser'),
    path('register/', views.register, name='register'),
    path('userpanel/', views.userpanel, name='userpanel'),
    path('logoutuser/', views.logout_user, name='logoutuser'),

    # سبد خرید و سفارش
    path('userpanel/cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('order-success/',views.order_success,name='order_success'),
    path("userpanel/orders/",views.my_orders,name="my_orders"),


    path(
        "panel/orders/",
        views.manage_orders,
        name="manage_orders"
    ),

    path(
        "panel/orders/<int:order_id>/status/",
        views.update_order_status,
        name="update_order_status"
    ),

]
