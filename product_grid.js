(function () {
    function createRatingWidget(productId, apiUrl) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (!productCard) return;
        const metaContainer = productCard.querySelector('.grid-product__meta');
        if (!metaContainer) return;
        
        // Check if rating widget already exists
        if (metaContainer.querySelector('.whata-star-container')) return;
        
        const ratingContainer = document.createElement('div');
        ratingContainer.id = `whata-star-${productId}`;
        ratingContainer.className = 'whata-star-container';
        
        // Insert the rating container after the product title
        const titleElement = metaContainer.querySelector('.grid-product__title');
        if (titleElement && titleElement.nextSibling) {
            metaContainer.insertBefore(ratingContainer, titleElement.nextSibling);
        } else {
            metaContainer.appendChild(ratingContainer);
        }

              async function fetchRating() {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    console.error('Response status:', response.status);
                    console.error('Response text:', await response.text());
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                renderStars(ratingContainer, data.average_rating, data.rating_count.total_rating_count);
            } catch (error) {
                console.error('Error fetching rating:', error);
                console.error('API URL:', apiUrl);
            }
        }

function renderStars(container, rating, rCount) {
    container.innerHTML = '';
    
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'whata-star';
        
        if (i <= fullStars) {
            star.innerHTML = '★';
            star.classList.add('whata-star-filled');
        } else if (i === fullStars + 1 && decimalPart > 0) {
            star.innerHTML = '<span class="whata-star-partial">★</span><span class="whata-star-empty">☆</span>';
            star.style.position = 'relative';
            star.firstChild.style.position = 'absolute';
            star.firstChild.style.overflow = 'hidden';
            star.firstChild.style.width = `${decimalPart * 100}%`;
        } else {
            star.innerHTML = '☆';
            star.classList.add('whata-star-empty');
        }
        
        container.appendChild(star);
    }
    
    const ratingCount = document.createElement('span');
    ratingCount.style.marginLeft = '5px';
    ratingCount.innerHTML = `${rating.toFixed(1)} (${rCount})`;
    container.appendChild(ratingCount);
}
        
        fetchRating();
    }

    // Find all unique product IDs on the page
    const processedProductIds = new Set();
    const productCards = document.querySelectorAll('[data-product-id]');
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        if (!processedProductIds.has(productId)) {
            console.log('Fetching rating for product ID:', productId);
            createRatingWidget(productId, `https://apiv2.whatacart.ai/v1/stores/${window.BURBUXA_PLATFORM_ID}/pub/reviews/${productId}/summary`);
            processedProductIds.add(productId);
        }
    });
})();
