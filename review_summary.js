document.addEventListener('DOMContentLoaded', function() {
    // Create a container for both summary and individual reviews
    const reviewsContainer = document.createElement('div');
    reviewsContainer.className = 'reviews-container';
    reviewsContainer.style.cssText = `
      max-width: 1200px;
      margin: 2rem auto;
    `;

    // Insert the container into the page
    const productSection = document.querySelector('.product-section, .product, #product-area, #shopify-section-product-template');
    if (productSection) {
        productSection.appendChild(reviewsContainer);
    } else {
        document.body.appendChild(reviewsContainer);
    }

    let currentPage = 1;
    const itemsPerPage = 5;

    // Function to create and insert the reviews summary
    function createReviewsSummary(data) {
        // Create the main container
        const container = document.createElement('div');
        container.className = 'reviews-summary';
        container.style.cssText = `
        font-family: var(--font-body-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif);
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
        background-color: var(--color-background, #ffffff);
        color: var(--color-text, #333333);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      `;

        // Add the summary text
        const summaryText = document.createElement('p');
        summaryText.textContent = data.summary;
        summaryText.style.cssText = `
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      `;
        container.appendChild(summaryText);

        // Create the rating and media section
        const ratingMediaSection = document.createElement('div');
        ratingMediaSection.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
      `;

        // Add the rating information
        const ratingInfo = document.createElement('div');
        ratingInfo.style.cssText = `
        flex: 1;
        min-width: 250px;
      `;

        const averageRating = document.createElement('h3');
        averageRating.textContent = `Calificación promedio: ${data.average_rating.toFixed(2)}`;
        averageRating.style.cssText = `
        font-size: 1.5rem;
        margin-bottom: 1rem;
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
            stars.innerHTML = `${i} ` + '⭐'.repeat(i);
            stars.style.marginRight = '0.5rem';

            const count = document.createElement('span');
            count.textContent = data.rating_count[i];
            count.style.marginLeft = 'auto';

            li.appendChild(stars);
            li.appendChild(count);
            ratingBreakdown.appendChild(li);
        }

        ratingInfo.appendChild(ratingBreakdown);

        // Add the media carousel
        const mediaCarousel = document.createElement('div');
        mediaCarousel.style.cssText = `
        flex: 2;
        min-width: 300px;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      `;
        mediaCarousel.style.cssText += `
        &::-webkit-scrollbar {
          display: none;
        }
      `;

        data.media_carrousel.forEach((url, index) => {
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
        `;
            img.addEventListener('click', function() {
                openModal(index);
            });
            mediaCarousel.appendChild(img);
        });

        ratingMediaSection.appendChild(ratingInfo);
        ratingMediaSection.appendChild(mediaCarousel);
        container.appendChild(ratingMediaSection);

        // Append the summary container to the main reviews container
        reviewsContainer.appendChild(container);

        // Create and insert the modal element
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

    function createFilterControls(currentSort = 'newest', currentRating = 'all') {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-controls';
        filterContainer.style.cssText = `
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

        // Sort by recency
        const sortSelect = document.createElement('select');
        sortSelect.id = 'sort-select';
        sortSelect.innerHTML = `
      <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
      <option value="oldest" ${currentSort === 'oldest' ? 'selected' : ''}>Oldest First</option>
    `;

        // Filter by star rating
        const ratingSelect = document.createElement('select');
        ratingSelect.id = 'rating-select';
        ratingSelect.innerHTML = `
      <option value="all" ${currentRating === 'all' ? 'selected' : ''}>All Ratings</option>
      <option value="5" ${currentRating === '5' ? 'selected' : ''}>5 Stars</option>
      <option value="4" ${currentRating === '4' ? 'selected' : ''}>4 Stars</option>
      <option value="3" ${currentRating === '3' ? 'selected' : ''}>3 Stars</option>
      <option value="2" ${currentRating === '2' ? 'selected' : ''}>2 Stars</option>
      <option value="1" ${currentRating === '1' ? 'selected' : ''}>1 Star</option>
    `;

        filterContainer.appendChild(sortSelect);
        filterContainer.appendChild(ratingSelect);

        return filterContainer;
    }

    // Function to create and display individual reviews
    function createIndividualReviews(reviews, paginationData, currentSort, currentRating) {
        const individualReviewsContainer = document.createElement('div');
        individualReviewsContainer.className = 'individual-reviews';
        individualReviewsContainer.style.cssText = `
      margin-top: 2rem;
      padding: 1rem;
      background-color: var(--color-background, #ffffff);
      color: var(--color-text, #333333);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;

        // Create and append the filter controls with current values
        const filterControls = createFilterControls(currentSort, currentRating);
        individualReviewsContainer.appendChild(filterControls);

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.style.cssText = `
          border-bottom: 1px solid #e0e0e0;
          padding: 1rem 0;
          margin-bottom: 1rem;
        `;

            const reviewHeader = document.createElement('div');
            reviewHeader.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        `;

            const nameElement = document.createElement('strong');
            nameElement.textContent = review.name;

            const ratingElement = document.createElement('span');
            ratingElement.textContent = '⭐'.repeat(review.rate);

            reviewHeader.appendChild(nameElement);
            reviewHeader.appendChild(ratingElement);

            const commentElement = document.createElement('p');
            commentElement.textContent = review.comment || '';
            commentElement.style.marginBottom = '0.5rem';

            reviewElement.appendChild(reviewHeader);
            reviewElement.appendChild(commentElement);

            if (review.media) {
                const mediaElement = document.createElement('img');
                mediaElement.src = review.media;
                mediaElement.alt = 'Review media';
                mediaElement.style.cssText = `
            max-width: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 4px;
          `;
                reviewElement.appendChild(mediaElement);
            }

            const dateElement = document.createElement('small');
            dateElement.textContent = review.created_at;
            dateElement.style.color = '#666';
            reviewElement.appendChild(dateElement);

            individualReviewsContainer.appendChild(reviewElement);
        });

        // Create pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
      `;

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = 'pagination-prev';
        prevButton.disabled = paginationData.page === 1;
        prevButton.addEventListener('click', () => fetchReviews(paginationData.page - 1));

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = 'pagination-next';
        nextButton.disabled = paginationData.page === paginationData.total_pages;
        nextButton.addEventListener('click', () => fetchReviews(paginationData.page + 1));

        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Page ${paginationData.page} of ${paginationData.total_pages}`;
        pageInfo.style.margin = '0 1rem';

        paginationControls.appendChild(prevButton);
        paginationControls.appendChild(pageInfo);
        paginationControls.appendChild(nextButton);

        individualReviewsContainer.appendChild(paginationControls);

        // Append or update individual reviews container
        const existingContainer = document.querySelector('.individual-reviews');
        if (existingContainer) {
            reviewsContainer.replaceChild(individualReviewsContainer, existingContainer);
        } else {
            reviewsContainer.appendChild(individualReviewsContainer);
        }
        addFilterListeners();
    }

    function addFilterListeners() {
        const sortSelect = document.getElementById('sort-select');
        const ratingSelect = document.getElementById('rating-select');

        sortSelect.addEventListener('change', () => {
            fetchReviews(1, sortSelect.value, ratingSelect.value);
        });

        ratingSelect.addEventListener('change', () => {
            fetchReviews(1, sortSelect.value, ratingSelect.value);
        });
    }

    function fetchReviews(page, sort = 'newest', rating = 'all') {
        currentPage = page;
        const url = new URL(`https://apiv2.whatacart.ai/v1/stores/65774551270/pub/reviews/8035422863590/all`);
        url.searchParams.append('page', page);
        url.searchParams.append('per_page', itemsPerPage);
        url.searchParams.append('sort', sort);
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

    // Fetch the summary data and create the reviews summary
    fetch('https://apiv2.whatacart.ai/v1/stores/65774551270/pub/reviews/8035422863590/summary')
        .then(response => response.json())
        .then(data => createReviewsSummary(data))
        .then(() => fetchReviews(1, 'newest', 'all'))
        .catch(error => console.error('Error fetching reviews:', error));
});
