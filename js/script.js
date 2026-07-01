window.addEventListener("load", async () => {

    await new Promise(r => setTimeout(r, 2000));

    document.getElementById("loader").classList.add("hide");


        startTyping();


});


const menu = document.querySelector("#menu");

window.addEventListener("scroll", () => {
    menu.classList.toggle("active", window.scrollY > 50);
});


const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    })
})

document.querySelectorAll(".about,.education,.card").forEach(el=>{
    el.classList.add("hidden");
    observer.observe(el);
});



//Type name
const title = document.getElementById("name");

const text = title.innerText;

title.innerText = "";

let i = 0;

function startTyping() {

    if (i < text.length) {
        title.innerHTML += text.charAt(i);
        i++;
        setTimeout(startTyping, 80); 
    }

}






//Paralax effect
const photo = document.querySelector(".naomiTopImage");
const photo2 = document.querySelector(".naomiTopImage2");

document.addEventListener("mousemove",(e)=>{

    let x=(e.clientX/window.innerWidth-.5)*20;
    let y=(e.clientY/window.innerHeight-.5)*20;

    photo.style.transform=`translate(${x}px,${y}px)`;
    photo2.style.transform=`translate(${x}px,${y}px)`;

});


const img1 = document.querySelector(".naomiTopImage");
const img2 = document.querySelector(".naomiTopImage2");

const about = document.querySelector(".about");

window.addEventListener("scroll", () => {

    const maxScroll = 400;
    let scroll = Math.min(window.scrollY, maxScroll);

    let progress = scroll / maxScroll;

    let ease = 1 - Math.pow(1 - progress, 3);

    

    // Color
  

    let grayscale = (1 - ease) * 100;

    img1.style.filter = `
        grayscale(${grayscale}%)
        contrast(150%)
    `;

    img2.style.filter = `
        grayscale(${grayscale}%)
        contrast(130%)
    `;


    // ABOUT
  

    if (scroll >= maxScroll) {
        about.classList.add("show");
    } else {
        about.classList.remove("show");
    }

});