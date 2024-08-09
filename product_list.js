(function () {
    // Injecting the CSS styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .whata-star {
            position: relative;
            display: inline-block;
            font-size: 20px;
            line-height: 1;
        }

        .whata-star-filled {
            color: gold;
        }

        .whata-star-empty {
            color: #ccc;
        }

        .whata-star-partial {
            color: gold;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
        }

        .whata-star-container {
            flex-direction: row;
            gap: 5px;
            align-items: center;
            margin-top: 1rem;
            display: block !important;
            visibility: visible !important;
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);

    function createRatingWidget(containerId, apiUrl, productId, sectionId) {
        const ratingWidget = document.getElementById(containerId);

        console.log(`Initializing rating widget for Product ID: ${productId}`);

        async function fetchRating() {
            try {
                console.log(`Fetching rating from API: ${apiUrl}`);
                const response = await fetch(apiUrl);
                console.log(`API Response Status: ${response.status}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok for Product ID: ${productId}`);
                }

                const data = await response.json();
                console.log(`Fetched Data for Product ID: ${productId}`, data);

                if (data.rating !== undefined && data.count !== undefined) {
                    renderStars(data.rating, data.count);
                } else {
                    console.warn(`Invalid data received for Product ID: ${productId}`);
                    ratingWidget.innerHTML = 'Rating not available';
                }
            } catch (error) {
                console.error(`Error fetching rating for Product ID: ${productId}`, error);
                ratingWidget.innerHTML = 'Error loading rating';
            }
        }

        function renderStars(rating, rCount) {
            ratingWidget.innerHTML = '';
            console.log(`Rendering stars for Product ID: ${productId} with rating: ${rating} and count: ${rCount}`);

            const fullStars = Math.floor(rating);
            const decimalPart = rating - fullStars;

            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'whata-star';

                if (i <= fullStars) {
                    star.innerHTML = '★';
                    star.classList.add('whata-star-filled');
                } else if (i === fullStars + 1 && decimalPart > 0) {
                    const partialStar = document.createElement('span');
                    partialStar.className = 'whata-star-partial';
                    partialStar.innerHTML = '★';
                    partialStar.style.width = `${decimalPart * 100}%`;

                    const emptyStar = document.createElement('span');
                    emptyStar.className = 'whata-star-empty';
                    emptyStar.innerHTML = '☆';

                    star.appendChild(partialStar);
                    star.appendChild(emptyStar);
                } else {
                    star.innerHTML = '☆';
                    star.classList.add('whata-star-empty');
                }

                ratingWidget.appendChild(star);
            }

            const count = document.createElement('span');
            count.style.marginLeft = '5px';
            count.innerHTML = `${rating.toFixed(1)} (${rCount})`;
            ratingWidget.appendChild(count);
        }

        fetchRating();
    }

    function initializeRatingWidget(retryCount = 0) {

        const productId = `{{ card_product.id }}`;
        const uid = `whata-star-${productId}`;
        console.log(`Generated UID: ${uid}`);
        const sectionId = `{{ section_id }}`;
        console.log(`Current Product ID: ${productId}, Section ID: ${sectionId}`);

        const container = document.createElement('div');
        container.id = uid;
        container.className = "whata-star-container";

        const productTitle = document.querySelector(`#CardLink-${sectionId}-${productId}`);
        if (productTitle && productTitle.parentElement) {
            productTitle.parentElement.appendChild(container, productTitle);
            createRatingWidget(uid, `https://apiv2.whatacart.ai/v1/stores/${window.BURBUXA_PLATFORM_ID}/pub/reviews/${productId}`, productId, sectionId);
            
            // Check if the container is empty after a short delay
            setTimeout(() => {
                if (container.innerHTML.trim() === '') {
                    console.log(`Container ${uid} is empty. Retrying...`);
                    if (retryCount < 5) { // Limit retries to prevent infinite loop
                        setTimeout(() => initializeRatingWidget(retryCount + 1), 1000);
                    } else {
                        console.warn(`Max retries reached for ${uid}`);
                    }
                }
            }, 500); // Check after 500ms to allow for initial rendering
        } else {
            console.warn(`Product title not found for Product ID: ${productId}`);
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const productTitle = document.querySelector(`#CardLink-{{ section_id }}-{{ card_product.id }}`);
                if (productTitle) {
                    observer.disconnect();
                    initializeRatingWidget();
                    break;
                }
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
