# Naomi Soubhia Doi: Portfolio

My personal portfolio: a bit about me, where I've studied and worked, and a few things I've built.

Live site: https://naomisoubhia.github.io/NaomiSoubhiaDoi/

It's plain HTML, CSS and JavaScript. The scroll animations use GSAP with ScrollTrigger, and the smooth scrolling is Lenis. There's no framework and no build step.

## What's on the page

- **Intro:** a short loading screen, then my name types itself out. The two hero photos shift slightly with the mouse and go from grayscale to colour as you start scrolling.
- **Education:** a pinned section where you scroll sideways through three cards. The background video changes to match the card in the middle, and a triangle grid fills in at the end.
- **Work:** my work history as a pinned, vertically scrolling carousel.
- **Projects:** on desktop the cards stack on top of each other as you scroll. Each one has a triangle pattern that fills in as it comes into view.
- **Menu:** a full-screen menu that closes with Escape. The Menu button switches between light and dark text depending on what's behind it.
- **Footer:** links, a contact card and a resume download.

## Running it locally

Download or clone the repo and open `index.html` in a browser. If the background videos don't load, serve the folder with any static server instead (for example the Live Server extension in VS Code). You need an internet connection, because GSAP, Lenis and the fonts come from CDNs.

## Folder layout

```
index.html
css/
  normalize.css
  style.css
js/
  script.js
img/      photos, logos and the education videos
```

`script.js` is split into numbered sections (intro, menu, education, work, projects, nav colour), and the numbers I tweak most (timings, scroll lengths, card sizes) are in a `CONFIG` object at the top.

## Browser and accessibility notes

- The fade-up effects on the Projects heading and the footer cards use CSS scroll-driven animations. Browsers that don't support them just show the content without the animation.
- If your system is set to reduced motion, I turn off smooth scrolling, the typing intro and the project animations. The pinned Education and Work sections still scroll.
- While the menu is open, the rest of the page is made inert so keyboard focus stays inside the menu.

## Where things came from

- Stacked project cards: [GreenSock's stacking cards pen](https://codepen.io/GreenSock/pen/WNLZPZN), plus [this tutorial](https://youtu.be/sWj43BS5zdg).
- Menu and interface animation: [this GSAP tutorial](https://youtu.be/Mfl91qz8N-s) and [this one](https://www.youtube.com/watch?v=1tbGhxAJNqQ).
- Gold button: [css-buttons.com #100](https://www.css-buttons.com/buttons/100/gold-color-border-animated-button), restyled to match my colours.
- Fonts: Instrument Serif and Instrument Sans from Google Fonts.
- The logo was made in Canva, and I planned the layout in [Figma](https://www.figma.com/design/JROlLE9hIEviNVCM8Tzw1x/Resume) first. The finished site drifted from that wireframe along the way.

## AI use

I used Claude and ChatGPT while building this. Claude helped me organize the code and think through implementation ideas, and ChatGPT helped with syntax errors and debugging. I read, changed and tested everything before keeping it.
