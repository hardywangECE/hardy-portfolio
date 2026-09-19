// Shared helpers + nav/theme/reveal behaviour used by every page.

export const $ = (sel, root = document) => root.querySelector(sel);
export const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

function initThemeToggle() {
  const btn = $("#theme-toggle");
  const label = $("#theme-toggle-label");
  if (!btn || !label) return;

  const getTheme = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  const applyLabel = () => {
    label.textContent = getTheme() === "light" ? "[ LIGHT ]" : "[ DARK ]";
  };

  applyLabel();

  btn.addEventListener("click", () => {
    const next = getTheme() === "light" ? "dark" : "light";
    if (next === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    applyLabel();
  });
}

// Highlights the nav link matching the current file. Anchor links that point
// at another page (e.g. "index.html#skills") only match when their file part
// equals the current file.
function markActivePage(links) {
  const currentFile = location.pathname.split("/").pop() || "index.html";
  links.querySelectorAll("a").forEach((a) => {
    const hrefFile = a.getAttribute("href").split("#")[0] || "index.html";
    if (hrefFile === currentFile) a.classList.add("active");
  });
}

// On the home page, several nav items point at in-page anchors (#skills,
// #contact) alongside the hero itself — scroll-spy those so the nav still
// reflects scroll position instead of only the static "current file" match.
function initSectionScrollSpy(links) {
  const sections = [...document.querySelectorAll("main .section, #hero")];
  if (!sections.length) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !entry.target.id) return;
        const match = links.querySelector(`a[href$="#${entry.target.id}"]`);
        if (!match) return;
        links.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
        match.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

function initNav() {
  const nav = $("#nav");
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  if (!nav || !toggle || !links) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
    })
  );

  markActivePage(links);
  initSectionScrollSpy(links);
}

function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((elm) => revealObserver.observe(elm));
}

function setFooterYear() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

// Call once, after a page has rendered its own content into the DOM.
export function initPage() {
  initThemeToggle();
  initNav();
  initReveal();
  setFooterYear();
}
