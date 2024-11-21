document.addEventListener("DOMContentLoaded", () => {
    // Main selectors
    const mainImage = document.getElementById("main-product-image");
    const mainTitle = document.querySelector(".product-info h2");
    const mainPrice = document.querySelector(".product-info .price");
    const mainAvailability = document.querySelector(".availability span");
    const mainDescription = document.querySelector(".product-info .description");
    const mainRating = document.querySelector(".rating");
    const mainThumbnails = document.querySelector(".thumbnail-images");
    const bestsellerGrid = document.getElementById("product-grid");
    const paginationControls = document.getElementById("pagination-controls");
    const searchInput = document.getElementById("product-search");

    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const itemsPerPage = 4;
    let currentPage = 1;

    let filteredProducts = [...productCards]; // Track filtered products for search

    // Create product card
    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.setAttribute("data-title", product.title);
        card.setAttribute("data-reviews", product.reviews);
        card.setAttribute("data-description", product.description);
        card.setAttribute("data-thumbnails", JSON.stringify(product.thumbnails));
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h4 class="product-title">${product.title}</h4>
            <p class="product-subtitle">${product.subtitle}</p>
            <p class="price">
                <span class="original-price">${product.originalPrice}</span> ${product.discountedPrice}
            </p>
        `;
        card.addEventListener("click", () => {
            updateMainProduct(product);
        });
        return card;
    }

    // Update the thumbnails
    function updateThumbnails(thumbnails) {
        mainThumbnails.innerHTML = ""; // Clear existing thumbnails
        thumbnails.forEach((thumbnail, index) => {
            const img = document.createElement("img");
            img.src = thumbnail;
            img.alt = `Thumbnail ${index + 1}`;
            img.classList.add(index === 0 ? "active-thumbnail" : "");
            img.addEventListener("click", () => {
                // Update the main image when a thumbnail is clicked
                mainImage.src = thumbnail; // Set the clicked thumbnail as the main image
                document.querySelectorAll(".thumbnail-images img").forEach(img => img.classList.remove("active-thumbnail"));
                img.classList.add("active-thumbnail"); // Highlight the clicked thumbnail
            });
            mainThumbnails.appendChild(img);
        });
    }

    // Update the main product
    function updateMainProduct(productDetails) {
        // Update main product details
        mainImage.src = productDetails.image;
        mainTitle.textContent = productDetails.title;
        mainPrice.innerHTML = `
            <span class="original-price">${productDetails.originalPrice}</span> ${productDetails.discountedPrice}
        `;
        mainAvailability.textContent = "In Stock";
        mainRating.innerHTML = productDetails.reviews;
        mainDescription.textContent = productDetails.description;

        // Update thumbnails
        updateThumbnails(productDetails.thumbnails);
    }

    // Initialize the grid for best products
    function initializeProductGrid() {
        bestsellerGrid.innerHTML = "";

        const allProducts = [...filteredProducts];
        allProducts.forEach(productCard => {
            bestsellerGrid.appendChild(productCard);
        });
    }

    // Display products for the main product section
    function showPage() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const visibleProducts = filteredProducts.slice(start, end);

        bestsellerGrid.innerHTML = "";
        visibleProducts.forEach(card => {
            bestsellerGrid.appendChild(card);
        });

        renderPagination(filteredProducts.length);
    }

    // Render pagination buttons
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationControls.innerHTML = "";

        if (totalPages <= 1) return;
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("page-button");
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                showPage();
            });
            paginationControls.appendChild(pageButton);
        }
    }

    // Initialize product search
    searchInput.addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();
        filteredProducts = productCards.filter(card =>
            card.querySelector(".product-title").textContent.toLowerCase().includes(searchText)
        );
        currentPage = 1;
        showPage();
        renderPagination(filteredProducts.length);
    });

    // Initialize product cards with event listeners
    productCards.forEach(card => {
        const productDetails = {
            image: card.querySelector("img").src,
            title: card.querySelector(".product-title").textContent,
            originalPrice: card.querySelector(".original-price")?.textContent || "",
            discountedPrice: card.querySelector(".price").textContent.replace(card.querySelector(".original-price")?.textContent || "", "").trim(),
            subtitle: card.querySelector(".product-subtitle").textContent,
            reviews: card.dataset.reviews || "No reviews available",
            description: card.dataset.description || "No description available",
            thumbnails: JSON.parse(card.dataset.thumbnails || '[]'),
        };
        card.addEventListener("click", () => {
            updateMainProduct(productDetails);
        });
    });

    // Initial render of products and pagination
    showPage();
    renderPagination(filteredProducts.length);
});
