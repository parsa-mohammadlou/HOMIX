from django.db import models
from django.contrib.auth.models import User

# Create your models here.




class Product(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    price = models.PositiveBigIntegerField()
    stock = models.PositiveIntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return self.name

class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "در انتظار بررسی"),
        ("processing", "در حال پردازش"),
        ("shipped", "ارسال شده"),
        ("delivered", "تحویل داده شده"),
        ("cancelled", "لغو شده"),
    ]

    user = models.ForeignKey(User,on_delete=models.PROTECT,related_name="orders")

    first_name = models.CharField(max_length=100)
    
    last_name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES,default="pending")

    total_price = models.PositiveBigIntegerField(default=0)

    address = models.TextField()

    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"سفارش {self.id} - {self.user.username}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField()

    price = models.PositiveBigIntegerField()

    def __str__(self):
        return f"{self.product.name} × {self.quantity}"
