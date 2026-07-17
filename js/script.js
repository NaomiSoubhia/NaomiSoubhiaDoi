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
    
    // --- VIDEO CROSSFADE SETUP ---
    // Instead of one video, we select or dynamically create a dual-video setup.
    let mainBgVideo = document.getElementById("main-bg-video");
    let secondaryBgVideo = document.getElementById("secondary-bg-video");
    
    // If you don't have a second video in your HTML, this will create it automatically
    if (mainBgVideo && !secondaryBgVideo) {
        secondaryBgVideo = mainBgVideo.cloneNode(true);
        secondaryBgVideo.id = "secondary-bg-video";
        // Put it right next to the main video
        mainBgVideo.parentNode.appendChild(secondaryBgVideo);
        
        // Ensure CSS layers them correctly via JS style fallbacks
        gsap.set([mainBgVideo, secondaryBgVideo], {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1
        });
    }

    // Keep track of which video element is currently active/visible
    let activeVideoElement = mainBgVideo;
    let currentVideoSrc = mainBgVideo ? mainBgVideo.querySelector("source")?.getAttribute("src") || mainBgVideo.src : ""; 
    
    // Initialize starting opacities
    if (mainBgVideo && secondaryBgVideo) {
        gsap.set(mainBgVideo, { opacity: 1 });
        gsap.set(secondaryBgVideo, { opacity: 0 });
    }

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

    // --- SCROLLTRIGGER WITH MIDDLE-OF-SCREEN DETECTION ---
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
            
            if (cardsContainer && allCards.length > 0) {
                const cardMovementProgress = Math.min(self.progress / 0.654, 1);
                gsap.set(cardsContainer, {
                    x: -cardMovementProgress * window.innerWidth * 2, 
                });

                // Detect the exact horizontal center line of the screen
                const screenCenter = window.innerWidth / 2;
                let activeIndex = 0;
                let closestDistance = Infinity;

                // Loop through cards to see which one's center is closest to the screen center
                allCards.forEach((card, index) => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + (rect.width / 2);
                    const distanceToCenter = Math.abs(screenCenter - cardCenter);

                    if (distanceToCenter < closestDistance) {
                        closestDistance = distanceToCenter;
                        activeIndex = index;
                    }
                });

                const activeCard = allCards[activeIndex];
                const targetVideoSrc = activeCard.getAttribute("data-video");

                if (mainBgVideo && secondaryBgVideo && targetVideoSrc && currentVideoSrc !== targetVideoSrc) {
                    currentVideoSrc = targetVideoSrc;
                    
                    const incomingVideoElement = (activeVideoElement === mainBgVideo) ? secondaryBgVideo : mainBgVideo;
                    const outgoingVideoElement = activeVideoElement;
                    
                    incomingVideoElement.src = targetVideoSrc;
                    incomingVideoElement.load();
                    
                    incomingVideoElement.onloadedmetadata = () => {
                        incomingVideoElement.play().catch(err => console.log("Playback bypass:", err));
                        
                        // Pure opacity crossfade
                        gsap.to(incomingVideoElement, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
                        gsap.to(outgoingVideoElement, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
                        
                        activeVideoElement = incomingVideoElement;
                    };
                }
            }
        },
    });
});