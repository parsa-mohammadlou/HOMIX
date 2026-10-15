
document.addEventListener("DOMContentLoaded", () => {
    // console.log("فایل cart.js اجرا شد!");
    const cartButton = document.getElementById("cartButton");
    const cartCount = document.getElementById("cartCount");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartClose = document.getElementById("cartClose");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartToast = document.getElementById("cartToast");

    // بازیابی سبد خرید ذخیره‌شده
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("homix_cart")) || [];
    } catch (error) {
        console.error("خطا در خواندن سبد خرید:", error);
        cart = [];
    }

    function saveCart() {
        localStorage.setItem("homix_cart", JSON.stringify(cart));
    }

    function normalizeDigits(value) {
        return value
            .replace(/[۰-۹]/g, digit => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
            .replace(/[٠-٩]/g, digit => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));
    }

    function formatPrice(price) {
        return Number(price).toLocaleString("fa-IR") + " تومان";
    }

    function showCartToast() {
        if (!cartToast) return;

        cartToast.classList.add("show");

        setTimeout(() => {
            cartToast.classList.remove("show");
        }, 2500);
    }

    function renderCart() {
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>سبد خرید شما خالی است.</p>
                </div>
            `;

            cartTotal.textContent = "۰ تومان";
            cartCount.textContent = "۰";
            return;
        }

        cart.forEach((product, index) => {
            const item = document.createElement("div");
            item.className = "cart-item";

            const info = document.createElement("div");
            info.className = "cart-item-info";

            const brand = document.createElement("div");
            brand.className = "cart-item-brand";
            brand.textContent = product.brand;

            const name = document.createElement("div");
            name.className = "cart-item-name";
            name.textContent = product.name;

            const price = document.createElement("div");
            price.className = "cart-item-price";
            price.textContent = formatPrice(product.price);

            info.append(brand, name, price);

            const actions = document.createElement("div");
            actions.className = "cart-item-actions";

            const decrease = document.createElement("button");
            decrease.className = "quantity-btn decrease";
            decrease.dataset.index = index;
            decrease.textContent = "−";

            const quantity = document.createElement("span");
            quantity.className = "quantity";
            quantity.textContent = product.quantity;

            const increase = document.createElement("button");
            increase.className = "quantity-btn increase";
            increase.dataset.index = index;
            increase.textContent = "+";

            actions.append(decrease, quantity, increase);
            item.append(info, actions);
            cartItems.appendChild(item);
        });

        updateCartSummary();
    }

    function updateCartSummary() {
        const totalQuantity = cart.reduce(
            (sum, product) => sum + product.quantity, 0
        );

        const totalPrice = cart.reduce(
            (sum, product) => sum + product.price * product.quantity, 0
        );

        cartCount.textContent = totalQuantity.toLocaleString("fa-IR");
        cartTotal.textContent = formatPrice(totalPrice);
    }

    // افزودن محصول به سبد خرید
    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".product-card");

            if (!productCard) return;

            const id = Number(productCard.dataset.productId);

            if (!Number.isInteger(id) || id <= 0) {
                console.error(
                    "شناسه محصول معتبر نیست. data-product-id را بررسی کن.",
                    productCard
                );
                return;
            }

            const name = productCard.querySelector(".product-name")?.textContent.trim();
            const brand = productCard.querySelector(".product-brand")?.textContent.trim() || "";
            const priceText = productCard.querySelector(".price")?.textContent.trim() || "";

            const normalizedPrice = normalizeDigits(priceText);
            const price = Number(normalizedPrice.replace(/[^\d]/g, ""));

            if (!name || !Number.isFinite(price) || price <= 0) {
                console.error("اطلاعات محصول یا قیمت معتبر نیست.");
                return;
            }

            const existingProduct = cart.find(product => product.id === id);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    brand,
                    price,
                    quantity: 1
                });
            }

            // try {
            //     saveCart();
            //     renderCart();
            //     showCartToast();
            // } catch (error) {
            //     console.error("ذخیره سبد خرید ناموفق بود:", error);
            // }

            try {
                saveCart();

                console.log("سبد خرید ذخیره شد:", cart);
                console.log(
                    "مقدار ذخیره‌شده:",
                    localStorage.getItem("homix_cart")
                );

                renderCart();
                showCartToast();
            } catch (error) {
                console.error("خطا در ذخیره سبد خرید:", error);
            }
        });
    });

    // تغییر تعداد محصولات
    cartItems.addEventListener("click", event => {
        const button = event.target.closest(".quantity-btn");

        if (!button) return;

        const index = Number(button.dataset.index);
        if (!Number.isInteger(index) || !cart[index]) return;

        if (button.classList.contains("increase")) {
            cart[index].quantity++;
        } else if (button.classList.contains("decrease")) {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        saveCart();
        renderCart();
    });

    // باز و بسته کردن سبد خرید
    cartButton?.addEventListener("click", event => {
        event.preventDefault();
        cartSidebar?.classList.add("active");
        cartOverlay?.classList.add("active");
    });

    function closeCart() {
        cartSidebar?.classList.remove("active");
        cartOverlay?.classList.remove("active");
    }

    cartClose?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);


    window.addEventListener("homixCartUpdated", () => {
        try {
            cart = JSON.parse(
                localStorage.getItem("homix_cart") || "[]"
            );

            if (!Array.isArray(cart)) cart = [];
        } catch (error) {
            cart = [];
        }

        renderCart();
    });

    // نمایش سبد بازیابی‌شده هنگام بارگذاری صفحه
    renderCart();
});