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
 i = 0;

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


//TRIANGLE ANIMATION

document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger); 
    const lenis = new Lenis({
        smoothWheel: true,
        autoRaf: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // --- GLOBAL VARIABLES ---
    const stickySection = document.querySelector(".sticky");
    const stickyHeight = window.innerHeight * 5;
    const outlineCanvas = document.querySelector(".outline-layer");
    const fillCanvas = document.querySelector(".fill-layer");
    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");
    const mainBgVideo = document.getElementById("main-bg-video");
    let currentVideoSrc = ""; 

    function setCanvasSize(canvas, ctx) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);
    }

    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);

    const triangleSize = 250;
    const lineWidth = 0.5;
    const SCALE_THRESHOLD = 0.01;
    const triangleStates = new Map();

    let animationFrameId = null;
    let canvasXPosition = 0;

    function drawTriangle(ctx, x, y, fillScale = 0, flipped = false) {
        const halfSize = triangleSize / 2;

        if (fillScale < SCALE_THRESHOLD) {
            ctx.beginPath();
            if (!flipped) {
                ctx.moveTo(x, y - halfSize);
                ctx.lineTo(x + halfSize, y + halfSize);
                ctx.lineTo(x - halfSize, y + halfSize);
            } else {
                ctx.moveTo(x, y + halfSize);
                ctx.lineTo(x + halfSize, y - halfSize);
                ctx.lineTo(x - halfSize, y - halfSize);
            }
            ctx.closePath();
            ctx.strokeStyle = "rgba(255,255,255, 0.75)";
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        if (fillScale >= SCALE_THRESHOLD) {
            ctx.save();
            ctx.translate(x, y);
            
            const renderScale = fillScale >= 0.99 ? fillScale * 1.006 : fillScale;
            ctx.scale(renderScale, renderScale);
            ctx.translate(-x, -y);

            ctx.beginPath();
            if (!flipped) {
                ctx.moveTo(x, y - halfSize);
                ctx.lineTo(x + halfSize, y + halfSize);
                ctx.lineTo(x - halfSize, y + halfSize);
            } else {
                ctx.moveTo(x, y + halfSize);
                ctx.lineTo(x + halfSize, y - halfSize);
                ctx.lineTo(x - halfSize, y - halfSize);
            }
            ctx.closePath();
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#fff";

            ctx.lineWidth = fillScale >= 0.99 ? 1.5 : lineWidth;
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
    }

    function drawGrid(scrollProgress = 0) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
        fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

        const animationProgress = gsap.utils.clamp(0, 1, (scrollProgress - 0.65) / 0.35);
        let needsUpdate = false;
        const animationSpeed = 0.15;

        triangleStates.forEach((state) => {
            if (state.scale < 1) {
                const x = state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPosition;
                const y = state.row * triangleSize + triangleSize / 2;
                const flipped = (state.row + state.col) % 2 !== 0;
                drawTriangle(outlineCtx, x, y, 0, flipped);
            }
        });

        triangleStates.forEach((state, key) => {
            const shouldBeVisible = animationProgress >= 0.99 || (animationProgress > 0 && state.order <= animationProgress);
            const targetScale = shouldBeVisible ? 1 : 0;
            const newScale = state.scale + (targetScale - state.scale) * animationSpeed;

            state.scale = newScale;

            if (Math.abs(targetScale - state.scale) > 0.001) {
                needsUpdate = true;
            } else {
                state.scale = targetScale;
            }

            if (state.scale >= SCALE_THRESHOLD) {
                const x = state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPosition;
                const y = state.row * triangleSize + triangleSize / 2;
                const flipped = (state.row + state.col) % 2 !== 0;
                drawTriangle(fillCtx, x, y, state.scale, flipped);
            }
        });

        if (needsUpdate) {
            animationFrameId = requestAnimationFrame(() => drawGrid(scrollProgress));
        }
    }

    function initializeTriangles() {
        const cols = Math.ceil(window.innerWidth / (triangleSize * 0.5)) + 4; 
        const rows = Math.ceil(window.innerHeight / triangleSize) + 1;
        const totalTriangles = cols * rows;

        const positions = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                positions.push({ row: r, col: c, key: `${r}-${c}` });
            }
        }

        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        positions.forEach((pos, index) => {
            triangleStates.set(pos.key, {
                order: (index + 1) / totalTriangles,
                scale: 0,
                row: pos.row,
                col: pos.col,
            });
        });
    }

    initializeTriangles();

    window.addEventListener("resize", () => {
        setCanvasSize(outlineCanvas, outlineCtx);
        setCanvasSize(fillCanvas, fillCtx);
        triangleStates.clear();
        initializeTriangles();
        if (ScrollTrigger.getAll().length > 0) {
            drawGrid(ScrollTrigger.getAll()[0].progress);
        }
    });

    // --- CRIAÇÃO DO SCROLLTRIGGER COM ACESSO SEGURO ÀS VARIÁVEIS ---
    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        onUpdate: (self) => {
            canvasXPosition = -self.progress * 130;
            drawGrid(self.progress);

            const cardsContainer = document.querySelector(".cards");
            const allCards = document.querySelectorAll(".card");
            const progress = Math.min(self.progress / 0.654, 1);

            if (cardsContainer && allCards.length > 0) {
                gsap.set(cardsContainer, {
                    x: -progress * window.innerWidth * 2, 
                });

                const totalCards = allCards.length;
                let activeIndex = Math.floor(progress * totalCards);
                
                if (activeIndex >= totalCards) activeIndex = totalCards - 1;
                if (activeIndex < 0) activeIndex = 0;

                const activeCard = allCards[activeIndex];
                const targetVideoSrc = activeCard.getAttribute("data-video");

                if (mainBgVideo && targetVideoSrc && currentVideoSrc !== targetVideoSrc) {
                    currentVideoSrc = targetVideoSrc;
                    
                    gsap.to(mainBgVideo, {
                        opacity: 0.3,
                        duration: 0.2,
                        onComplete: () => {
                            mainBgVideo.src = targetVideoSrc;
                            mainBgVideo.play().catch(err => console.log("Vídeo interceptado:", err));
                            gsap.to(mainBgVideo, { opacity: 1, duration: 0.3 });
                        }
                    });
                }
            }
        },
    });
});