import anime from "animejs";

// Page load animations
export function animatePageLoad() {
  const timeline = anime.timeline({
    easing: "easeOutExpo",
  });

  timeline
    .add({
      targets: ".animate-title",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
    })
    .add(
      {
        targets: ".animate-subtitle",
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 600,
      },
      "-=500"
    )
    .add(
      {
        targets: ".animate-input",
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 600,
      },
      "-=400"
    )
    .add(
      {
        targets: ".animate-example",
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(80),
        duration: 500,
      },
      "-=300"
    );

  return timeline;
}

// Input focus animation
export function animateInputFocus(element: HTMLElement) {
  anime({
    targets: element,
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 4px rgba(59, 130, 246, 0.15)",
    ],
    duration: 300,
    easing: "easeOutQuad",
  });
}

export function animateInputBlur(element: HTMLElement) {
  anime({
    targets: element,
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
    duration: 300,
    easing: "easeOutQuad",
  });
}

// Loading spinner animation
export function animateSpinner(element: HTMLElement) {
  return anime({
    targets: element,
    rotate: 360,
    duration: 1000,
    easing: "linear",
    loop: true,
  });
}

// Typewriter effect for loading text
export function animateTypewriter(
  element: HTMLElement,
  text: string,
  onComplete?: () => void
) {
  element.textContent = "";
  const chars = text.split("");
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (currentIndex < chars.length) {
      element.textContent += chars[currentIndex];
      currentIndex++;
    } else {
      clearInterval(interval);
      onComplete?.();
    }
  }, 50);

  return () => clearInterval(interval);
}

// Results appear animation
export function animateResultsIn() {
  const timeline = anime.timeline({
    easing: "easeOutExpo",
  });

  timeline
    .add({
      targets: ".animate-show-card",
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 700,
    })
    .add(
      {
        targets: ".animate-recap",
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      },
      "-=400"
    )
    .add(
      {
        targets: ".animate-episodes-header",
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 500,
      },
      "-=300"
    );

  return timeline;
}

// Episodes expand animation
export function animateEpisodesExpand(container: HTMLElement) {
  const episodes = container.querySelectorAll(".animate-episode");

  anime({
    targets: episodes,
    opacity: [0, 1],
    translateY: [15, 0],
    delay: anime.stagger(50),
    duration: 400,
    easing: "easeOutQuad",
  });
}

// Episode hover animation
export function animateEpisodeHover(element: HTMLElement, isEnter: boolean) {
  anime({
    targets: element,
    scale: isEnter ? 1.02 : 1,
    translateY: isEnter ? -2 : 0,
    duration: 200,
    easing: "easeOutQuad",
  });
}

// Accordion animation for episodes section
export function animateAccordion(
  element: HTMLElement,
  isExpanding: boolean,
  maxHeight: number
) {
  anime({
    targets: element,
    maxHeight: isExpanding ? maxHeight : 0,
    opacity: isExpanding ? 1 : 0,
    duration: 400,
    easing: "easeOutQuad",
  });
}

// Stagger fade in for any elements
export function staggerFadeIn(selector: string, delay: number = 100) {
  anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [10, 0],
    delay: anime.stagger(delay),
    duration: 500,
    easing: "easeOutQuad",
  });
}

// Pulse animation for buttons
export function animatePulse(element: HTMLElement) {
  anime({
    targets: element,
    scale: [1, 1.05, 1],
    duration: 300,
    easing: "easeInOutQuad",
  });
}

// Scroll reveal animation
export function createScrollObserver(
  selector: string,
  animationCallback: (entry: Element) => void
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animationCallback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));

  return observer;
}
