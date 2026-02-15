document.querySelectorAll(".project-right").forEach(container => {
    const track = container.querySelector(".slider-track");
    const slides = container.querySelectorAll(".slide-img");
    let index = 0;
    let totalSlides = slides.length;

    function moveSlide() {
        index = (index + 1) %totalSlides;
        track.style.transform = `translateX(-${index * 100}%)`;
    }
    let slideInterval = setInterval(moveSlide, 3000);

    container.addEventListener("mouseenter", () => {
        clearInterval(slideInterval);
    });
    container.addEventListener("mouseleave", () => {
        slideInterval = setInterval(moveSlide, 3000);
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".closeBtn");
    const images = document.querySelectorAll(".slide-img");

    images.forEach(img => {
        img.addEventListener("click", function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });
});