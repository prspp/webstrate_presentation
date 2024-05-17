document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('slidesIframe');
    const addSlideBtn = document.getElementById('addSlideBtn');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');

    const getSlidesDocument = () => iframe.contentDocument || iframe.contentWindow.document;

    const updateSlides = () => {
        const slidesDoc = getSlidesDocument();
        const slides = slidesDoc.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', true);
        });
    };

    let currentSlideIndex = 0;

    iframe.addEventListener('load', () => {
        const slidesDoc = getSlidesDocument();
        const slidesContainer = slidesDoc.querySelector('.slides-container');
        let slides = slidesDoc.querySelectorAll('.slide');

        addSlideBtn.addEventListener('click', () => {
            const newSlide = slidesDoc.createElement('div');
            newSlide.classList.add('slide');
            newSlide.classList.add('active');
            newSlide.setAttribute('contenteditable', 'true');
            newSlide.textContent = `Slide ${slides.length + 1}`;
            slidesContainer.appendChild(newSlide);
            slides = slidesDoc.querySelectorAll('.slide');
        });

        prevSlideBtn.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlides();
            }
        });

        nextSlideBtn.addEventListener('click', () => {
            if (currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
                updateSlides();
            }
        });

        updateSlides();
    });
});
