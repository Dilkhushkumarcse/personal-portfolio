document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                projectCards.forEach(card => {
                    card.classList.toggle('hide', !(filter === 'all' || card.dataset.category.includes(filter)));
                });
            });
        });
    }

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetElement = document.querySelector(anchor.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('.nav-links a').forEach(link =>
            link.addEventListener('click', () => navLinks.classList.remove('active'))
        );
    }

    // --- Read More / Show Less for Projects ---
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            // Target the project's info container
            const parentInfo = btn.closest('.project-info'); 
            if (parentInfo) {
                const moreText = parentInfo.querySelector('.more-text');
                if (moreText) {
                    const isVisible = moreText.style.display === 'inline';
                    moreText.style.display = isVisible ? 'none' : 'inline';
                    btn.textContent = isVisible ? 'Read More' : 'Show Less';
                }
            }
        });
    });

    // --- Blog Carousel ---
    const track = document.querySelector('.blog-carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        
        if (slides.length > 0) {
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => slide.style.left = slideWidth * index + 'px');
            let currentIndex = 0;

            const moveToSlide = targetIndex => {
                if (slides[targetIndex]) {
                    track.style.transform = `translateX(-${slides[targetIndex].offsetLeft}px)`;
                    currentIndex = targetIndex;
                    updateNavButtons();
                }
            };

            const updateNavButtons = () => {
                prevButton.classList.toggle('hidden', currentIndex === 0);
                nextButton.classList.toggle('hidden', currentIndex >= slides.length - 1);
            };
            updateNavButtons();

            nextButton.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    moveToSlide(currentIndex + 1);
                }
            });

            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    moveToSlide(currentIndex - 1);
                }
            });
        }
    }

    // --- Fullscreen Modal Logic for Blog ---
    const fullscreenBtns = document.querySelectorAll(".fullscreen-btn");
    const modal = document.getElementById("fullscreenModal");
    if (modal) {
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");
        const closeBtn = document.querySelector(".close-btn");

        fullscreenBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const post = e.target.closest(".blog-post");
                if (post) {
                    const title = post.querySelector("h3").innerText;
                    const text = post.querySelector("p.blog-text").innerText; // Get full text
                    
                    modalTitle.innerText = title;
                    modalText.innerText = text;
                    modal.style.display = "block";
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = contactForm.name.value;
            const email = contactForm.email.value;
            const message = contactForm.message.value;
            const sendButton = contactForm.querySelector('button');

            sendButton.textContent = 'Sending...';
            sendButton.disabled = true;

            try {
                const response = await fetch('http://localhost:5001/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message }),
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Success! Your message has been sent.');
                    contactForm.reset();
                } else {
                    alert(`Error: ${result.message || 'Something went wrong.'}`);
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                sendButton.textContent = 'Send Message';
                sendButton.disabled = false;
            }
        });
    }
});
