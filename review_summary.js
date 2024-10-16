        document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.createElement('div');
    reviewsContainer.className = 'reviews-container';
    reviewsContainer.style.cssText = `
        max-width: 1200px;
        margin: 2rem auto;
        margin-top: 4rem;
        padding: 0 2rem;
        font-family: 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #333;
        background-color: #f8f9fa;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    `;
    const BurbuxaReviews = document.querySelector('burbuxa-reviews, .burbuxa-reviews, #burbuxa-reviews');
    console.log("Burbuxa reviews is", BurbuxaReviews)
    const productSection = document.querySelector('.product-section, .product, #product-area, #shopify-section-product-template');
    console.log("Product section is", productSection)
    const mainContent = document.querySelector('.main-content'); // Adjust this selector as needed
    console.log("Main content is", mainContent)
    if (BurbuxaReviews) {
        BurbuxaReviews.appendChild(reviewsContainer);
    } else {
        if (mainContent) {
            mainContent.appendChild(reviewsContainer);
        } else {
            // Fallback if main content isn't found
            if (productSection) {
                productSection.parentNode.insertBefore(reviewsContainer, productSection.nextSibling);
            } else {
                document.body.appendChild(reviewsContainer);
            }
        }
    }


    let currentPage = 1;
    const itemsPerPage = 6;
    let currentSort = 'newest';
    let currentRating = 'all';

    function createReviewsSummary(data) {
        const container = document.createElement('div');
        container.className = 'reviews-summary';
        container.style.cssText = `
            max-width: 100%;
            margin-top: 2rem;
            margin-bottom: 3rem;
            padding: 3rem;
            background-color: #ffffff;
            color: #333;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            transition: all 0.3s ease;
        `;

        const summaryTitle = document.createElement('h2');
        summaryTitle.textContent = 'Resumen de reseñas de compradores';
        summaryTitle.style.cssText = `
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #000000;
        `;
        container.appendChild(summaryTitle);

        const summaryText = document.createElement('p');
        summaryText.textContent = data.summary;
        summaryText.style.cssText = `
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        `;
        container.appendChild(summaryText);

        const ratingMediaSection = document.createElement('div');
        ratingMediaSection.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
        `;

        const ratingInfo = document.createElement('div');
        ratingInfo.style.cssText = `
            flex: 1;
            min-width: 250px;
        `;

        const averageRating = document.createElement('h3');
        averageRating.textContent = `Calificación Promedio: ${data.average_rating.toFixed(2)}`;
        averageRating.style.cssText = `
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #000000;
        `;
        ratingInfo.appendChild(averageRating);

        const ratingBreakdown = document.createElement('ul');
        ratingBreakdown.style.cssText = `
            list-style: none;
            padding: 0;
        `;

        for (let i = 5; i >= 1; i--) {
            const li = document.createElement('li');
            li.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
            `;

            const stars = document.createElement('span');
            stars.innerHTML = `${i} ` + '★'.repeat(i);
            stars.style.cssText = `
                margin-right: 0.5rem;
                color: #ffc107;
                font-size: 1.2rem;
            `;

            const count = document.createElement('span');
            count.textContent = data.rating_count[i];
            count.style.marginLeft = 'auto';

            li.appendChild(stars);
            li.appendChild(count);
            ratingBreakdown.appendChild(li);
        }

        ratingInfo.appendChild(ratingBreakdown);

        const mediaCarousel = document.createElement('div');
        mediaCarousel.style.cssText = `
            flex: 2;
            min-width: 300px;
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: #007bff #f0f0f0;
        `;

// Filter out empty strings from media_carrousel
const validMediaUrls = data.media_carrousel.filter(url => url.trim() !== '');

// Check if validMediaUrls is empty
if (validMediaUrls.length > 0) {
    validMediaUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Review image';
        img.dataset.index = index;
        img.style.cssText = `
            width: 150px;
            height: 150px;
            object-fit: cover;
            margin-right: 1rem;
            border-radius: 8px;
            display: inline-block;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin-top: 3rem;
        `;
        img.addEventListener('click', function() {
            openModal(index);
        });
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
        mediaCarousel.appendChild(img);
    });
    ratingMediaSection.appendChild(mediaCarousel); // Append only if there are valid images
}


        ratingMediaSection.appendChild(ratingInfo);
        container.appendChild(ratingMediaSection);

        const poweredBy = document.createElement('div');
        poweredBy.innerHTML = '<a href="https://burbuxa.com" target="_blank" style="text-decoration: none; color: #6c757d;">Reviews en WhatsApp by burbuxa.com</a>';
        poweredBy.style.cssText = `
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 0.8rem;
            color: #6c757d;
            font-weight: 500;
        `;
        container.appendChild(poweredBy);


        reviewsContainer.appendChild(container);

        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.8);
        justify-content: center;
        align-items: center;
      `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 900px;
        text-align: center;
        position: relative;
      `;

        const modalImage = document.createElement('img');
        modalImage.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        margin-bottom: 1rem;
      `;

        const closeModal = document.createElement('span');
        closeModal.innerHTML = '&times;';
        closeModal.style.cssText = `
        color: #aaa;
        position: absolute;
        top: 10px;
        right: 25px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      `;
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&#10094;';
        prevButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 2rem;
        padding: 1rem;
      `;
        prevButton.addEventListener('click', showPrevImage);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&#10095;';
        nextButton.style.cssText = `
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 2rem;
        padding: 1rem;
      `;
        nextButton.addEventListener('click', showNextImage);

        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      `;

        data.media_carrousel.forEach((url, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = url;
            thumbnail.dataset.index = index;
            thumbnail.style.cssText = `
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
        `;
            thumbnail.addEventListener('click', function() {
                openModal(index);
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        modalContent.appendChild(closeModal);
        modalContent.appendChild(prevButton);
        modalContent.appendChild(modalImage);
        modalContent.appendChild(nextButton);
        modalContent.appendChild(thumbnailContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        let currentIndex = 0;

        function openModal(index) {
            currentIndex = index;
            modalImage.src = data.media_carrousel[currentIndex];
            modal.style.display = 'flex';
        }

        function showPrevImage() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : data.media_carrousel.length - 1;
            modalImage.src = data.media_carrousel[currentIndex];
        }

        function showNextImage() {
            currentIndex = (currentIndex < data.media_carrousel.length - 1) ? currentIndex + 1 : 0;
            modalImage.src = data.media_carrousel[currentIndex];
        }

        document.addEventListener('keydown', function(event) {
            if (modal.style.display === 'flex') {
                if (event.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (event.key === 'ArrowRight') {
                    showNextImage();
                } else if (event.key === 'Escape') {
                    modal.style.display = 'none';
                }
            }
        });
    }

    function createStarRating(rating) {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
        `;
        
        const fullStars = Math.floor(rating);
        const decimalPart = rating - fullStars;
        const hasPartialStar = decimalPart > 0;
        const totalStars = 5;
    
        // Create full stars
        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.style.cssText = `
                color: #ffc107;
                font-size: 1.2rem;
                margin-right: 0.1rem;
            `;
            starsContainer.appendChild(star);
        }
    
        // Create partial star if needed
        if (hasPartialStar) {
            const star = document.createElement('span');
            star.style.cssText = `
                position: relative;
                display: inline-block;
                color: #e0e0e0;
                font-size: 1.2rem;
                margin-right: 0.1rem;
            `;
            star.innerHTML = '★';
    
            const partialStar = document.createElement('span');
            partialStar.innerHTML = '★';
            partialStar.style.cssText = `
                color: #ffc107;
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                width: ${decimalPart * 100}%;
            `;
    
            star.appendChild(partialStar);
            starsContainer.appendChild(star);
        }
    
        // Create empty stars
        const emptyStars = totalStars - fullStars - (hasPartialStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.style.cssText = `
                color: #e0e0e0;
                font-size: 1.2rem;
                margin-right: 0.1rem;
            `;
            starsContainer.appendChild(star);
        }
    
        return starsContainer;
    }

    function createImageCarousel(images) {
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'image-carousel';
        carouselContainer.style.cssText = `
            position: relative;
            width: 100%;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 1rem;
        `;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            display: flex;
            transition: transform 0.3s ease;
        `;

        images.forEach((url, index) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Review image ${index + 1}`;
            img.style.cssText = `
                width: 100%;
                height: 200px;
                object-fit: cover;
                flex-shrink: 0;
            `;
            imageContainer.appendChild(img);
        });

        const prevButton = document.createElement('button');
        prevButton.textContent = '❮';
        prevButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 1rem;
            cursor: pointer;
            z-index: 2;
        `;

        const nextButton = document.createElement('button');
        nextButton.textContent = '❯';
        nextButton.style.cssText = `
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 1rem;
            cursor: pointer;
            z-index: 2;
        `;

        let currentIndex = 0;

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            imageContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            imageContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        carouselContainer.appendChild(imageContainer);
        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);

        return carouselContainer;
    }
  
    function createFilterControls(currentSort = 'newest', currentRating = 'all') {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-controls';
        filterContainer.style.cssText = `
            margin-bottom: 2rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
        `;

        const sortSelect = document.createElement('select');
        sortSelect.id = 'sort-select';
        sortSelect.innerHTML = `
            <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Más recientes</option>
            <option value="oldest" ${currentSort === 'oldest' ? 'selected' : ''}>Menos recientes</option>
        `;

        const ratingSelect = document.createElement('select');
        ratingSelect.id = 'rating-select';
        ratingSelect.innerHTML = `
            <option value="all" ${currentRating === 'all' ? 'selected' : ''}>Todas</option>
            <option value="5" ${currentRating === '5' ? 'selected' : ''}>5 estrellas</option>
            <option value="4" ${currentRating === '4' ? 'selected' : ''}>4 estrellas</option>
            <option value="3" ${currentRating === '3' ? 'selected' : ''}>3 estrellas</option>
            <option value="2" ${currentRating === '2' ? 'selected' : ''}>2 estrellas</option>
            <option value="1" ${currentRating === '1' ? 'selected' : ''}>1 estrella</option>
        `;

        [sortSelect, ratingSelect].forEach(select => {
            select.style.cssText = `
                padding: 0.75rem 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                background-color: #fff;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s ease;
                width: auto;
                max-width: 250px;
            `;
        });

        filterContainer.appendChild(sortSelect);
        filterContainer.appendChild(ratingSelect);

        return filterContainer;
    }

function createStyledButton(text, onClick, disabled = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = disabled;
    button.style.cssText = `
        padding: 0.5rem 1rem;
        background-color: ${disabled ? '#a0a0a0' : '#007bff'};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        transition: background-color 0.2s ease;
        font-size: 1rem;
    `;
    if (!disabled) {
        button.addEventListener('mouseover', () => button.style.backgroundColor = '#0056b3');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#007bff');
    }
    button.addEventListener('click', onClick);
    return button;
}
  
    function createPaginationControls(paginationData) {
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        paginationControls.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2rem;
        `;

const prevButton = createStyledButton('Anterior', () => fetchReviews(paginationData.page - 1), paginationData.page <= 1);
const nextButton = createStyledButton('Siguiente', () => fetchReviews(paginationData.page + 1), paginationData.page >= paginationData.total_pages);

        const pageInfo = document.createElement('span');
        let totalPages = Number.isInteger(paginationData.total_pages) && paginationData.total_pages >= 1 ? paginationData.total_pages : 1;
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Página ${paginationData.page} de ${totalPages}`;
        pageInfo.style.margin = '0 1rem';

        [prevButton, nextButton].forEach(button => {
            button.style.cssText = `
                padding: 0.5rem 1rem;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            `;
            button.addEventListener('mouseover', () => {
                if (!button.disabled) {
                    button.style.backgroundColor = '#0056b3';
                }
            });
            button.addEventListener('mouseout', () => {
                if (!button.disabled) {
                    button.style.backgroundColor = '#007bff';
                }
            });
        });

        paginationControls.appendChild(prevButton);
        paginationControls.appendChild(pageInfo);
        paginationControls.appendChild(nextButton);

        return paginationControls;
    }

 function createReviewElement(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review';
reviewElement.style.cssText = `
    border: 1px solid #d0d0d0;
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
    reviewElement.addEventListener('mouseenter', () => {
        reviewElement.style.transform = 'translateY(-5px)';
        reviewElement.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
    });
    reviewElement.addEventListener('mouseleave', () => {
        reviewElement.style.transform = 'translateY(0)';
        reviewElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    });

    const reviewHeader = document.createElement('div');
    reviewHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    `;

    const nameVerifiedContainer = document.createElement('div');
    nameVerifiedContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    `;

    const nameElement = document.createElement('strong');
    nameElement.textContent = review.name;
    nameElement.style.cssText = `
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
    `;
    nameVerifiedContainer.appendChild(nameElement);

    const verifiedBadgeLink = document.createElement('a');
    verifiedBadgeLink.href = 'https://burbuxa.com'; // Replace with your URL
    verifiedBadgeLink.target = '_blank'; // Optional: opens the link in a new tab
    verifiedBadgeLink.style.textDecoration = 'none'; // Remove underline
    
    const verifiedBadge = document.createElement('span');
    verifiedBadge.textContent = 'Verificado por burbuxa.com';
    verifiedBadge.style.cssText = `
        background-color: #28a745;
        color: white;
        font-size: 0.8rem;
        padding: 2px 5px;
        border-radius: 3px;
    `;
    
    verifiedBadgeLink.appendChild(verifiedBadge);
    nameVerifiedContainer.appendChild(verifiedBadgeLink);


    const ratingElement = createStarRating(review.rate);

    reviewHeader.appendChild(nameVerifiedContainer);
    reviewHeader.appendChild(ratingElement);
    reviewElement.appendChild(reviewHeader);

    const commentElement = document.createElement('p');
    commentElement.textContent = review.comment || '';
commentElement.style.cssText = `
    flex-grow: 1;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    line-height: 1.6;
`;
    reviewElement.appendChild(commentElement);

    if (review.media) {
        const mediaArray = typeof review.media === 'string' ? [review.media] : review.media;
        if (mediaArray.length > 0) {
            const carousel = createImageCarousel(mediaArray);
            reviewElement.appendChild(carousel);
        }
    }

    const dateElement = document.createElement('small');
    dateElement.textContent = review.created_at;
    dateElement.style.color = '#6c757d';
    reviewElement.appendChild(dateElement);

    return reviewElement;
}


function createReviewsGrid(reviews) {
    const reviewsGrid = document.createElement('div');
    reviewsGrid.className = 'reviews-grid';
reviewsGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
`;

    reviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsGrid.appendChild(reviewElement);
    });

    return reviewsGrid;
}

function createIndividualReviews(reviews, paginationData, currentSort, currentRating) {
    console.log("Updating reviews with new data", reviews);

    const individualReviewsContainer = document.createElement('div');
    individualReviewsContainer.className = 'individual-reviews';
    individualReviewsContainer.style.cssText = `
        margin-top: 3rem;
        padding: 3rem;
        background-color: #ffffff;
        color: #333;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        margin-bottom: 2rem;
    `;

    const filterControls = createFilterControls(currentSort, currentRating);
    individualReviewsContainer.appendChild(filterControls);

    const reviewsGrid = createReviewsGrid(reviews);
    individualReviewsContainer.appendChild(reviewsGrid);

    const paginationControls = createPaginationControls(paginationData);
    individualReviewsContainer.appendChild(paginationControls);

    const existingContainer = document.querySelector('.individual-reviews');
    if (existingContainer) {
        console.log("Replacing existing reviews container");
        reviewsContainer.replaceChild(individualReviewsContainer, existingContainer);
    } else {
        console.log("Appending new reviews container");
        reviewsContainer.appendChild(individualReviewsContainer);
    }
    addFilterListeners(); // Ensure listeners are re-added if needed
}


function addFilterListeners() {
    const sortSelect = document.getElementById('sort-select');
    const ratingSelect = document.getElementById('rating-select');

    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value; // Update currentSort globally
        fetchReviews(1, sortSelect.value, currentRating);
    });

    ratingSelect.addEventListener('change', () => {
        currentRating = ratingSelect.value; // Update currentRating globally
        fetchReviews(1, currentSort, ratingSelect.value);
    });
}


function renderStarRatingOnly(data) {
    const ratingContainer = document.querySelector('.burbuxa-title-stars');
    if (ratingContainer) {
        const averageRating = data.average_rating;
        const starsElement = createStarRating(averageRating);
        ratingContainer.appendChild(starsElement);
    }
}

function fetchReviews(page, sort = currentSort, rating = currentRating) {
    currentPage = page;
    currentSort = sort;
    currentRating = rating;



    const url = new URL(`https://apiv2.whatacart.ai/v1/stores/${window.BURBUXA_PLATFORM_ID}/pub/reviews/${window.productId}/all`);
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', itemsPerPage);
    url.searchParams.append('sort', sort === 'newest' ? 'newest' : 'oldest'); // Change 'sort' to 'order'
    if (rating !== 'all') {
        url.searchParams.append('rating', rating);
    }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                createIndividualReviews(data.reviews, {
                    page: data.page,
                    per_page: data.per_page,
                    total_pages: data.total_pages,
                    total_count: data.total_count
                }, sort, rating);
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }
  


    fetch(`https://apiv2.whatacart.ai/v1/stores/${window.BURBUXA_PLATFORM_ID}/pub/reviews/${window.productId}/summary`)
        .then(response => response.json())
        .then(data => {
            createReviewsSummary(data);
            renderStarRatingOnly(data);
        })
        .then(() => fetchReviews(1, 'newest', 'all'))
        .catch(error => console.error('Error fetching reviews:', error));

function addResponsiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .reviews-container {
                padding: 0 1rem !important;
                margin: 0 auto !important;
                max-width: 100% !important;
            }
            .reviews-summary, .individual-reviews {
                padding: 1.5rem !important;
                box-sizing: border-box !important;
            }
            .reviews-summary .ratingMediaSection {
                flex-direction: column !important;
                align-items: center !important;
            }
            .reviews-summary .ratingInfo,
            .reviews-summary .mediaCarousel {
                flex: 1 1 100% !important;
                min-width: 100% !important;
                box-sizing: border-box !important;
            }
            .reviews-summary .mediaCarousel {
                margin-top: 1rem !important;
                overflow-x: auto !important;
                display: flex !important;
                justify-content: center !important;
            }
            .reviews-summary .mediaCarousel img {
                width: 100px !important;
                height: 100px !important;
                margin: 0.5rem !important;
            }
            .reviews-grid {
                display: flex !important;
                flex-direction: column !important;
                gap: 1rem !important;
            }
            .filter-controls {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            .filter-controls select {
                width: 100% !important;
                margin-bottom: 0.5rem !important;
            }
            .review {
                padding: 1.5rem !important;
                box-sizing: border-box !important;
            }
            .pagination-controls {
                flex-wrap: wrap !important;
                justify-content: center !important;
            }
            .pagination-controls button {
                margin: 0.25rem !important;
            }
        }
    `;
    document.head.appendChild(style);
}

addResponsiveStyles();

  });
