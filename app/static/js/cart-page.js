
document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cartList");
    const itemCount = document.getElementById("itemCount");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shippingCost");
    const grandTotalElement = document.getElementById("grandTotal");
    const summaryCard = document.querySelector(".summary-card");
    const checkoutButton = document.querySelector(".checkout-btn");
    const mobileCartBadge = document.querySelector(".mobile-cart-badge");

    const STORAGE_KEY = "homix_cart";
    const SHIPPING_COST = 50000;

    if (
        !cartList ||
        !itemCount ||
        !subtotalElement ||
        !shippingElement ||
        !grandTotalElement
    ) {
        console.error("عناصر ضروری صفحه سبد خرید پیدا نشدند.");
        return;
    }

    // بازیابی سبد خرید
    function loadCart() {
        try {
            const savedCart = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (!Array.isArray(savedCart)) {
                return [];
            }

            return savedCart.filter(product =>
                product &&
                product.id !== undefined &&
                product.name &&
                Number.isFinite(Number(product.price)) &&
                Number(product.price) > 0 &&
                Number.isInteger(Number(product.quantity)) &&
                Number(product.quantity) > 0
            ).map(product => ({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }));
        } catch (error) {
            console.error("خطا در خواندن سبد خرید:", error);
            return [];
        }
    }

    let cart = loadCart();

    // قالب‌بندی قیمت
    function formatPrice(price) {
        return Number(price).toLocaleString("fa-IR") + " تومان";
    }

    // ذخیره سبد خرید
    function saveCart() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );
        } catch (error) {
            console.error("خطا در ذخیره سبد خرید:", error);
            alert("ذخیره تغییرات سبد خرید انجام نشد.");
        }
    }

    // ساخت آیکون پیش‌فرض محصول
    function createProductIcon() {
        const wrapper = document.createElement("div");
        wrapper.className = "item-image";

        wrapper.innerHTML = `
            <svg viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 aria-hidden="true">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
        `;

        return wrapper;
    }

    // ساخت کارت یک محصول
    function createCartItem(product) {
        const item = document.createElement("div");
        item.className = "cart-item";
        item.dataset.productId = String(product.id);

        const info = document.createElement("div");
        info.className = "item-info";

        const details = document.createElement("div");
        details.className = "item-details";

        const name = document.createElement("div");
        name.className = "item-name";
        name.textContent = product.name;

        details.appendChild(name);

        if (product.brand) {
            const brand = document.createElement("div");
            brand.className = "item-price";
            brand.textContent = product.brand;
            details.appendChild(brand);
        }

        const unitPrice = document.createElement("div");
        unitPrice.className = "item-price";
        unitPrice.textContent =
            "قیمت واحد: " + formatPrice(product.price);

        details.appendChild(unitPrice);

        info.append(
            createProductIcon(),
            details
        );

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const quantityControl = document.createElement("div");
        quantityControl.className = "quantity-control";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.setAttribute("aria-label", "کاهش تعداد");
        decreaseButton.textContent = "−";

        const quantity = document.createElement("span");
        quantity.className = "qty-value";
        quantity.textContent =
            Number(product.quantity).toLocaleString("fa-IR");

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.dataset.action = "increase";
        increaseButton.setAttribute("aria-label", "افزایش تعداد");
        increaseButton.textContent = "+";

        quantityControl.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        const total = document.createElement("div");
        total.className = "item-total";
        total.textContent = formatPrice(
            product.price * product.quantity
        );

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-btn";
        removeButton.dataset.action = "remove";
        removeButton.title = "حذف از سبد";
        removeButton.setAttribute("aria-label", "حذف محصول");

        removeButton.innerHTML = `
            <svg viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            </svg>
        `;

        actions.append(
            quantityControl,
            total,
            removeButton
        );

        item.append(info, actions);

        return item;
    }

    // نمایش حالت سبد خالی
    function renderEmptyCart() {
        const emptyCart = document.createElement("div");
        emptyCart.className = "empty-cart";

        const title = document.createElement("h2");
        title.textContent = "سبد خرید شما خالی است";

        const description = document.createElement("p");
        description.textContent =
            "هنوز محصولی به سبد خرید اضافه نکرده‌اید.";

        const link = document.createElement("a");
        link.href = "/";
        link.className = "empty-cart-btn";
        link.textContent = "مشاهده محصولات";

        emptyCart.append(title, description, link);
        cartList.appendChild(emptyCart);
    }

    // به‌روزرسانی مبالغ و تعداد کالاها
    function updateSummary() {
        const totalQuantity = cart.reduce(
            (sum, product) => sum + product.quantity,
            0
        );

        const subtotal = cart.reduce(
            (sum, product) =>
                sum + product.price * product.quantity,
            0
        );

        const shipping = cart.length > 0 ? SHIPPING_COST : 0;
        const grandTotal = subtotal + shipping;

        itemCount.textContent =
            totalQuantity.toLocaleString("fa-IR") + " کالا";

        subtotalElement.textContent = formatPrice(subtotal);
        shippingElement.textContent = formatPrice(shipping);
        grandTotalElement.textContent = formatPrice(grandTotal);

        if (mobileCartBadge) {
            mobileCartBadge.textContent =
                totalQuantity.toLocaleString("fa-IR");

            mobileCartBadge.hidden = totalQuantity === 0;
        }

        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }
    }

    // نمایش مجدد کل سبد خرید
    function renderCart() {
        cartList.replaceChildren();

        if (cart.length === 0) {
            renderEmptyCart();

            if (summaryCard) {
                summaryCard.style.display = "none";
            }

            updateSummary();
            return;
        }

        if (summaryCard) {
            summaryCard.style.display = "";
        }

        cart.forEach(product => {
            cartList.appendChild(createCartItem(product));
        });

        updateSummary();
    }

    // مدیریت افزایش، کاهش و حذف محصولات
    cartList.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const item = button.closest(".cart-item");

        if (!item) return;

        const productId = item.dataset.productId;

        const product = cart.find(
            product => String(product.id) === productId
        );

        if (!product) return;

        const action = button.dataset.action;

        if (action === "increase") {
            product.quantity++;
        } else if (action === "decrease") {
            product.quantity--;

            if (product.quantity <= 0) {
                cart = cart.filter(
                    product => String(product.id) !== productId
                );
            }
        } else if (action === "remove") {
            cart = cart.filter(
                product => String(product.id) !== productId
            );
        }

        saveCart();
        renderCart();
    });

    // همگام‌سازی در صورت تغییر سبد خرید در تب دیگر
    window.addEventListener("storage", event => {
        if (event.key === STORAGE_KEY) {
            cart = loadCart();
            renderCart();
        }
    });

    // شروع صفحه
    renderCart();
});