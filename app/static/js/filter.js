document.addEventListener("DOMContentLoaded", () => {

    const products = document.querySelectorAll(".product-card");

    const categoryFilters =
        document.querySelectorAll(".category-filter");

    const brandFilters =
        document.querySelectorAll(".brand-filter");


    function filterProducts() {

        // دسته‌بندی‌های انتخاب‌شده
        const selectedCategories =
            Array.from(categoryFilters)
                .filter(filter => filter.checked)
                .map(filter => filter.value);


        // برندهای انتخاب‌شده
        const selectedBrands =
            Array.from(brandFilters)
                .filter(filter => filter.checked)
                .map(filter => filter.value);


        products.forEach(product => {

            const category =
                product.dataset.category;

            const brand =
                product.dataset.brand;


            // بررسی دسته‌بندی
            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(category);


            // بررسی برند
            const brandMatch =
                selectedBrands.length === 0 ||
                selectedBrands.includes(brand);


            // نمایش یا مخفی کردن محصول
            if (categoryMatch && brandMatch) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    }


    // تغییر فیلتر دسته‌بندی
    categoryFilters.forEach(filter => {

        filter.addEventListener(
            "change",
            filterProducts
        );

    });


    // تغییر فیلتر برند
    brandFilters.forEach(filter => {

        filter.addEventListener(
            "change",
            filterProducts
        );

    });

});