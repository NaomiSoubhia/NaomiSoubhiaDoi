# Naomi Soubhia Doi – Portfolio

Personal portfolio website showcasing my background, education, technical skills, professional experience, projects, and contact information.

The website was designed and developed as a custom interactive portfolio, with a focus on responsive design, smooth scrolling, scroll-based animations, and a visual identity centered around gold, black, and neutral tones.

---

## Technologies

- HTML5
- CSS3
- JavaScript
- GSAP
- GSAP ScrollTrigger
- Lenis
- SVG
- Google Fonts

---

## Design & Typography

### Google Fonts

The website uses the following fonts from Google Fonts:

- **Instrument Sans** – primary sans-serif typography
- **Instrument Serif** – serif typography and visual contrast
- **Carattere** – decorative typography

The fonts are loaded through Google Fonts using:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Carattere&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap"
>
```

These fonts are used throughout the portfolio to create the intended combination of modern, clean, editorial, and decorative typography.

---

## Logo & Visual Identity

### Canva

Canva was used to create and refine the portfolio's personal logo and visual branding elements.

The logo was designed specifically for the portfolio and integrated into the website's:

- Navigation
- Loading screen
- Branding elements
- Favicon
- Overall visual identity

The Canva design was used as a starting point for the final digital implementation.

https://canva.link/7xwtri4audmpeol

<p align="center">
  <img width="400" height="400" alt="Logo Design" src="https://github.com/user-attachments/assets/45f724f8-ae35-475a-8cc2-0cbee57a7a1a" />
  <img width="400" height="400" alt="Portfolio Logo" src="https://github.com/user-attachments/assets/f520480b-c95a-4c52-bbcc-fcc8077dd5b6" />
</p>

---

## Wireframe & Design Process

### Figma

The initial website structure and wireframe were created in Figma.

**Figma design:**  
https://www.figma.com/design/JROlLE9hIEviNVCM8Tzw1x/Resume

The Figma wireframe was used to establish the initial:

- Page structure
- Section organization
- Navigation
- Content hierarchy
- Project presentation
- General visual direction

The final website was **modified during the development process**.

Some elements changed from the original wireframe after implementation in order to improve:

- User experience
- Responsiveness
- Animation behavior
- Visual hierarchy
- Spacing
- Interaction
- Technical feasibility

Therefore, the Figma file represents the **initial design direction**, while the coded website represents the final implemented version.

---

# Animation & Interaction References

The portfolio uses GSAP, ScrollTrigger, CSS, SVG, and JavaScript to create its interactive effects.

The following resources were used as learning references and inspiration during development.

---

## 1. Project Card Stacking

### GreenSock – ScrollTrigger Simple Stacking Cards

https://codepen.io/GreenSock/pen/WNLZPZN

### Used for

**Projects section → desktop project card stacking animation**

This reference was used to understand the structure behind the stacked-card effect.

Relevant concepts include:

- GSAP
- ScrollTrigger
- `pin`
- `pinSpacing: false`
- `scrub`
- card scaling
- scroll-based positioning
- overlapping cards

The portfolio adapts these concepts to its own project-card structure and visual design.

### Portfolio implementation

The concept is implemented inside:

```text
JavaScript
└── initProjects()
    └── Desktop stacked-deck effect
```

The implementation uses ScrollTrigger to pin project cards and GSAP to progressively scale and darken cards as subsequent projects enter the viewport.

---

## 2. GSAP Stacked Card Tutorial

### GSAP ScrollTrigger Stacked Cards Animation

https://youtu.be/sWj43BS5zdg

### Used for

**Projects section → card movement and ScrollTrigger behavior**

This tutorial was used as an additional reference for understanding scroll-controlled stacked cards and transitions.

The concepts were adapted to the portfolio rather than reproduced directly.

---

## 3. GSAP Animation Reference

https://youtu.be/Mfl91qz8N-s

### Used for

**Navigation and interface animation**

This resource was used as a learning reference for GSAP-based interface transitions and interactive motion.

Relevant concepts were adapted to the portfolio's:

- Navigation
- UI transitions
- Hover interactions
- Interface movement

---

## 4. Gold Animated Button

### CSS Buttons – Gold Color Border Animated Button

https://www.css-buttons.com/buttons/100/gold-color-border-animated-button

### Used for

**Gold CTA buttons throughout the portfolio**

This reference was used as inspiration for the animated gold button styling.

Relevant concepts include:

- Gold gradients
- Animated background position
- Hover effects
- Rounded button styling
- CSS transitions

The original concept was adapted to the portfolio's own:

- Gold color palette
- CSS variables
- Dimensions
- Typography
- Border radius
- Spacing
- Responsive behavior

---

## 5. Additional Animation Reference

https://www.youtube.com/watch?v=1tbGhxAJNqQ

### Used for

**General animation and interaction inspiration**

This reference was consulted during development for ideas related to:

- UI movement
- Transitions
- Animation timing
- Interactive elements

The concepts were adapted where appropriate to the portfolio's design.

---

# Project Visual Effects

The Projects section combines several animation systems.

## Stacked Project Cards

On desktop, project cards create a layered stacked-deck effect:

```text
Project 01
    ↓
Project 01 parks near the top
    ↓
Project 02 slides over Project 01
    ↓
Project 01 becomes slightly smaller and darker
    ↓
Project 03 slides over Project 02
    ↓
Project 02 becomes slightly smaller and darker
```

This creates the main visual transition between projects.

---

## Text Reveal

Project content marked with:

```html
data-reveal
```

is animated into view when the corresponding project enters the viewport.

The text moves upward while its opacity increases.

```text
opacity: 0
y: 36px

        ↓ scroll

opacity: 1
y: 0
```

---

## Triangle Artwork

Each project includes an SVG-based visual panel containing geometric triangle artwork.

The artwork progresses as the project card enters the viewport.

```text
Project enters viewport
        ↓
Triangle progress: 0%
        ↓
Triangle progress: 50%
        ↓
Triangle progress: 100%
```

The progress is connected to the ScrollTrigger progress value.

```javascript
art.setProgress(self.progress);
```

This allows the triangle pattern to progressively reveal/fill according to the user's scroll position.

---

## Triangle Parallax

The SVG artwork also has a subtle vertical parallax movement.

The artwork begins slightly offset and moves as the card scrolls through the viewport.

This creates a small sense of depth without overpowering the project content.

---

# Responsive Behaviour

The project-card stacking effect is primarily used on desktop.

GSAP `matchMedia()` is used to provide different behavior depending on screen size.

```text
Desktop
├── Pinned project cards
├── Stacked-deck effect
├── Card scaling
├── Card darkening
├── Triangle animation
└── Parallax

Mobile
├── Normal card flow
├── Scroll-based reveals
├── Triangle animation
└── Responsive layout
```

This prevents the desktop stacking interaction from becoming difficult to use on smaller screens.

---

# Accessibility

The project also considers reduced-motion preferences.

When the user has enabled reduced motion, the portfolio avoids unnecessary animation and displays the project artwork in its completed state.

Conceptually:

```javascript
if (prefersReducedMotion) {
    arts.forEach((art) => art?.setProgress(1));
}
```

This allows the content to remain accessible without requiring the user to experience the full animation system.

---

# Development Process

The portfolio was developed through an iterative design and implementation process.

```text
Initial idea
     ↓
Figma wireframe
     ↓
Visual identity / logo
     ↓
HTML structure
     ↓
CSS styling
     ↓
JavaScript functionality
     ↓
GSAP animations
     ↓
ScrollTrigger interactions
     ↓
Responsive adjustments
     ↓
Testing and debugging
     ↓
Final implementation
```

The final website evolved from the original wireframe as technical and UX considerations were identified during development.

---

# AI-Assisted Development

AI tools were used as development support during the project.

- **Claude** – assisted with code organization, implementation ideas, and selected development tasks.
- **ChatGPT** – assisted primarily with syntax correction, debugging, explanations, and troubleshooting.

All AI-assisted suggestions were reviewed, modified, tested, and integrated as part of the development process.

---

# Where the References Are Used

| Reference | Website Area | Main Concept |
|---|---|---|
| GreenSock Stacking Cards | Projects | Pinned stacked cards |
| GSAP Stacked Cards Tutorial | Projects | Scroll-controlled card movement |
| GSAP Animation Reference | Navigation / UI | Interface transitions |
| CSS Buttons #100 | Gold buttons | Animated gold styling |
| Additional YouTube Reference | General UI | Animation inspiration |
| Google Fonts | Entire website | Typography |
| Canva | Branding | Logo and visual identity |
| Figma | Initial design | Wireframe and layout |

---

# Attribution & Learning References

The following resources were consulted during the design and development process:

1. **GreenSock – ScrollTrigger Simple Stacking Cards**  
   https://codepen.io/GreenSock/pen/WNLZPZN

2. **GSAP ScrollTrigger Stacked Cards Animation**  
   https://youtu.be/sWj43BS5zdg

3. **GSAP Animation Reference**  
   https://youtu.be/Mfl91qz8N-s

4. **CSS Buttons – Gold Color Border Animated Button**  
   https://www.css-buttons.com/buttons/100/gold-color-border-animated-button

5. **Additional Animation Reference**  
   https://www.youtube.com/watch?v=1tbGhxAJNqQ

6. **Figma – Initial Portfolio Wireframe**  
   https://www.figma.com/design/JROlLE9hIEviNVCM8Tzw1x/Resume

7. **Google Fonts**  
   https://fonts.google.com/

8. **Canva**  
   Used for the portfolio logo and visual identity.

---

## Note

These resources were used for learning, reference, and design inspiration. The final website combines and adapts these concepts into a custom implementation based on the portfolio's own layout, branding, content, responsive requirements, and interaction design.
