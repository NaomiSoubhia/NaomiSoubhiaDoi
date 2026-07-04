window.addEventListener("load", async () => {

    await new Promise(r => setTimeout(r, 2000));

    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hide");

    startTyping();
});


// MENU
const menu = document.querySelector("#menu");

window.addEventListener("scroll", () => {
    if (menu) {
        menu.classList.toggle("active", window.scrollY > 200);
    }
});


// TYPE NAME
const title = document.getElementById("name");

let text = "";
let i = 0;

if (title) {
    text = title.innerText;
    title.innerText = "";
}

function startTyping() {
    if (!title) return;

    if (i < text.length) {
        title.innerHTML += text.charAt(i);
        i++;
        setTimeout(startTyping, 80);
    }
}


// PARALLAX
const photo = document.querySelector(".naomiTopImage");
const photo2 = document.querySelector(".naomiTopImage2");

document.addEventListener("mousemove", (e) => {

    if (!photo || !photo2) return;

    let x = (e.clientX / window.innerWidth - .5) * 20;
    let y = (e.clientY / window.innerHeight - .5) * 20;

    photo.style.transform = `translate(${x}px,${y}px)`;
    photo2.style.transform = `translate(${x}px,${y}px)`;
});


// GRAYSCALE SCROLL EFFECT
const img1 = document.querySelector(".naomiTopImage");
const img2 = document.querySelector(".naomiTopImage2");

window.addEventListener("scroll", () => {

    if (!img1 || !img2) return;

    const maxScroll = 400;
    let scroll = Math.min(window.scrollY, maxScroll);

    let progress = scroll / maxScroll;
    let ease = 1 - Math.pow(1 - progress, 3);

    let grayscale = (1 - ease) * 100;

    img1.style.filter = `grayscale(${grayscale}%) contrast(150%)`;
    img2.style.filter = `grayscale(${grayscale}%) contrast(130%)`;
});


// ABOUT SCROLL SCALE
const about = document.querySelector(".about");

function animateAbout() {
    if (!about) return;

    const rect = about.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const start = windowHeight * 0.9;
    const end = windowHeight * 0.2;

    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(progress, 1));

    const ease = 1 - Math.pow(1 - progress, 3);
    const scale = 0.82 + (0.18 * ease);

    about.style.transform = `scale(${scale})`;
    about.style.opacity = ease;
}

window.addEventListener("scroll", animateAbout);
window.addEventListener("load", animateAbout);