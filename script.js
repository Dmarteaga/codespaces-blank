// North Star Bakery - Interactive Features

// First array: products available for the favorites feature
const productCatalog = [
    {
        id: "signature-loaf",
        name: "Signature Loaf",
        category: "bread"
    },
    {
        id: "artisan-bread",
        name: "Artisan Bread Selection",
        category: "bread"
    },
    {
        id: "cookie-collection",
        name: "Weekend Cookie Collection",
        category: "pastry"
    },
    {
        id: "pastry-box",
        name: "Fresh Pastry Box",
        category: "pastry"
    },
    {
        id: "celebration-cake",
        name: "Celebration Cake",
        category: "cake"
    },
    {
        id: "cupcake-set",
        name: "Custom Cupcake Set",
        category: "cake"
    }
];

// Second array: IDs of products selected as favorites
let favoriteIds = [];

// Read saved favorites from localStorage
function readSavedFavorites() {
    const savedFavorites = localStorage.getItem("northStarFavorites");

    if (!savedFavorites) {
        return [];
    }

    try {
        const parsedFavorites = JSON.parse(savedFavorites);

        if (Array.isArray(parsedFavorites)) {
            return parsedFavorites.filter((id) =>
                productCatalog.some((product) => product.id === id)
            );
        }
    } catch (error) {
        console.error("Saved favorites could not be loaded.", error);
    }

    return [];
}

// Save favorites in the browser
function saveFavorites() {
    localStorage.setItem(
        "northStarFavorites",
        JSON.stringify(favoriteIds)
    );
}

// Save the selected product category
function saveCategory(category) {
    localStorage.setItem("northStarCategory", category);
}

// Display the available products
function renderProducts() {
    const productList = document.querySelector("#product-list");
    const categoryFilter = document.querySelector("#category-filter");

    if (!productList || !categoryFilter) {
        return;
    }

    productList.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const visibleProducts = productCatalog.filter((product) => {
        return (
            selectedCategory === "all" ||
            product.category === selectedCategory
        );
    });

    visibleProducts.forEach((product) => {
        const productCard = document.createElement("article");
        productCard.className = "product-card";

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const categoryText = document.createElement("p");
        categoryText.textContent =
            "Category: " +
            product.category.charAt(0).toUpperCase() +
            product.category.slice(1);

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.className = "favorite-button";

        const isFavorite = favoriteIds.includes(product.id);

        favoriteButton.textContent = isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites";

        favoriteButton.setAttribute(
            "aria-pressed",
            isFavorite.toString()
        );

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(product.id);
        });

        productCard.append(
            productName,
            categoryText,
            favoriteButton
        );

        productList.append(productCard);
    });
}

// Add or remove a favorite product
function toggleFavorite(productId) {
    const existingIndex = favoriteIds.indexOf(productId);
    const selectedProduct = productCatalog.find(
        (product) => product.id === productId
    );

    if (existingIndex === -1) {
        favoriteIds.push(productId);
    } else {
        favoriteIds.splice(existingIndex, 1);
    }

    saveFavorites();
    renderProducts();
    renderFavorites();

    const storageMessage =
        document.querySelector("#storage-message");

    if (storageMessage && selectedProduct) {
        storageMessage.textContent =
            existingIndex === -1
                ? `${selectedProduct.name} was added to your favorites.`
                : `${selectedProduct.name} was removed from your favorites.`;
    }
}

// Display the current favorites list
function renderFavorites() {
    const favoritesList =
        document.querySelector("#favorites-list");

    const favoriteCount =
        document.querySelector("#favorite-count");

    if (!favoritesList || !favoriteCount) {
        return;
    }

    favoritesList.innerHTML = "";
    favoriteCount.textContent = favoriteIds.length;

    if (favoriteIds.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No favorites selected yet.";
        favoritesList.append(emptyItem);
        return;
    }

    favoriteIds.forEach((favoriteId) => {
        const product = productCatalog.find(
            (item) => item.id === favoriteId
        );

        if (product) {
            const listItem = document.createElement("li");
            listItem.textContent = product.name;
            favoritesList.append(listItem);
        }
    });
}

// Load saved favorites and category when the page opens
function loadPreferences() {
    favoriteIds = readSavedFavorites();

    const categoryFilter =
        document.querySelector("#category-filter");

    const storageMessage =
        document.querySelector("#storage-message");

    const savedCategory =
        localStorage.getItem("northStarCategory");

    if (
        categoryFilter &&
        savedCategory &&
        Array.from(categoryFilter.options).some(
            (option) => option.value === savedCategory
        )
    ) {
        categoryFilter.value = savedCategory;
    }

    const restoredMessages = [];

    if (favoriteIds.length > 0) {
        restoredMessages.push(
            `${favoriteIds.length} saved favorite(s) were restored.`
        );
    }

    if (savedCategory && savedCategory !== "all") {
        restoredMessages.push(
            `Your ${savedCategory} filter was restored.`
        );
    }

    if (storageMessage && restoredMessages.length > 0) {
        storageMessage.textContent =
            restoredMessages.join(" ");
    }
}

// Start the favorites feature
function initializeFavoritesFeature() {
    const productList = document.querySelector("#product-list");
    const categoryFilter =
        document.querySelector("#category-filter");

    if (!productList || !categoryFilter) {
        return;
    }

    categoryFilter.addEventListener("change", () => {
        saveCategory(categoryFilter.value);
        renderProducts();

        const storageMessage =
            document.querySelector("#storage-message");

        if (storageMessage) {
            storageMessage.textContent =
                "Your product filter preference was saved.";
        }
    });

    loadPreferences();
    renderProducts();
    renderFavorites();
}

// Create or find an error message near a form field
function getErrorElement(field) {
    const errorId = `${field.id}-error`;
    let errorElement = document.querySelector(`#${errorId}`);

    if (!errorElement) {
        errorElement = document.createElement("small");
        errorElement.id = errorId;
        errorElement.className = "error-message";
        errorElement.setAttribute("aria-live", "polite");
        field.insertAdjacentElement("afterend", errorElement);
    }

    return errorElement;
}

// Show a validation message
function showError(field, message) {
    const errorElement = getErrorElement(field);

    errorElement.textContent = message;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorElement.id);
}

// Remove a validation message
function clearError(field) {
    const errorElement =
        document.querySelector(`#${field.id}-error`);

    if (errorElement) {
        errorElement.textContent = "";
    }

    field.removeAttribute("aria-invalid");
}

// Validate the contact and pre-order form
function validateForm() {
    const fullName = document.querySelector("#full-name");
    const email = document.querySelector("#email");
    const itemDetails =
        document.querySelector("#item-details");

    let isValid = true;
    let firstInvalidField = null;

    if (fullName) {
        clearError(fullName);

        if (fullName.value.trim().length < 2) {
            showError(
                fullName,
                "Please enter at least 2 characters for your name."
            );

            isValid = false;
            firstInvalidField = fullName;
        }
    }

    if (email) {
        clearError(email);

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            showError(
                email,
                "Please enter a valid email address."
            );

            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = email;
            }
        }
    }

    if (itemDetails) {
        clearError(itemDetails);

        if (itemDetails.value.trim().length < 10) {
            showError(
                itemDetails,
                "Please describe your order in at least 10 characters."
            );

            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = itemDetails;
            }
        }
    }

    return {
        isValid,
        firstInvalidField
    };
}

// Start JavaScript validation on the form
function initializeFormValidation() {
    const form = document.querySelector("form");

    if (!form) {
        return;
    }

    const formStatus = document.createElement("p");
    formStatus.id = "form-status";
    formStatus.setAttribute("role", "status");
    form.append(formStatus);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const validationResult = validateForm();

        if (!validationResult.isValid) {
            formStatus.textContent =
                "Please correct the highlighted fields before submitting.";

            if (validationResult.firstInvalidField) {
                validationResult.firstInvalidField.focus();
            }

            return;
        }

        formStatus.textContent =
            "Thank you! Your pre-order request passed validation.";
    });

    const validatedFields = [
        document.querySelector("#full-name"),
        document.querySelector("#email"),
        document.querySelector("#item-details")
    ].filter(Boolean);

    validatedFields.forEach((field) => {
        field.addEventListener("input", () => {
            clearError(field);
            formStatus.textContent = "";
        });
    });

    form.addEventListener("reset", () => {
        validatedFields.forEach(clearError);
        formStatus.textContent = "";
    });
}

// Start the JavaScript after the HTML finishes loading
document.addEventListener("DOMContentLoaded", () => {
    initializeFavoritesFeature();
    initializeFormValidation();
});