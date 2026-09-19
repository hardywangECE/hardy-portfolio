import { profile, education, skills, experience, projects } from "./data.js";
import { StepViewer } from "./viewer.js";

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function typeCommand(target, text, speed = 42) {
  let i = 0;
  (function tick() {
    target.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, speed);
  })();
}

function renderHero() {
  typeCommand($("#typed-cmd"), "./launch_portfolio.sh --profile=hardy_wang");
  $("#hero-role").textContent = profile.role;
  $("#hero-tagline").textContent = profile.tagline;

  const resumeLink = $("#resume-link");
  resumeLink.href = profile.resumeFile;

  const links = [
    { label: "EMAIL", href: `mailto:${profile.email}` },
    { label: "LINKEDIN", href: profile.linkedin },
  ];
  if (profile.github) links.push({ label: "GITHUB", href: profile.github });

  const wrap = $("#hero-links");
  links.forEach(({ label, href }) => {
    const a = el("a", "hero-link", `<span>[</span>${label}<span>]</span>`);
    a.href = href;
    if (href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    wrap.appendChild(a);
  });
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
function renderAbout() {
  const bio = $("#about-bio");
  profile.bio.forEach((para) => bio.appendChild(el("p", null, para)));

  const eduPanel = $("#education-panel");
  eduPanel.appendChild(el("p", "panel-label", "// EDUCATION"));
  education.forEach((e) => {
    eduPanel.appendChild(
      el(
        "div",
        "edu-entry",
        `<p class="edu-school">${e.school}</p>
         <p class="edu-degree">${e.degree}</p>
         <p class="edu-meta">${e.location} · ${e.dates}</p>`
      )
    );
  });
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
function renderExperience() {
  const wrap = $("#experience-timeline");
  experience.forEach((job) => {
    const bullets = job.bullets.map((b) => `<li>${b}</li>`).join("");
    const item = el(
      "article",
      "timeline-item reveal",
      `<div class="timeline-marker"></div>
       <div class="timeline-content">
         <div class="timeline-head">
           <h3>${job.role}</h3>
           <span class="timeline-dates">${job.dates}</span>
         </div>
         <p class="timeline-company">${job.company} — ${job.location}</p>
         <ul class="timeline-bullets">${bullets}</ul>
       </div>`
    );
    wrap.appendChild(item);
  });
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
function renderSkills() {
  const wrap = $("#skills-grid");
  Object.entries(skills).forEach(([category, items]) => {
    const chips = items.map((s) => `<span class="chip">${s}</span>`).join("");
    wrap.appendChild(
      el(
        "div",
        "skill-card reveal",
        `<p class="skill-cat">// ${category.toUpperCase()}</p>
         <div class="chip-row">${chips}</div>`
      )
    );
  });
}

// ---------------------------------------------------------------------------
// Projects + 3D viewers
// ---------------------------------------------------------------------------
function buildViewerControls(viewerInstance, hud) {
  const statusEl = hud.querySelector(".viewer-status");
  const buttons = hud.querySelectorAll("[data-action]");

  viewerInstance.onStatus = (state, message) => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "reset") viewerInstance.resetView();
      if (action === "wireframe") {
        const on = viewerInstance.toggleWireframe();
        btn.classList.toggle("active", on);
      }
      if (action === "rotate") {
        const on = viewerInstance.toggleAutoRotate();
        btn.classList.toggle("active", on);
      }
      if (action === "fullscreen") {
        const canvasWrap = hud.closest(".project-viewer");
        if (!document.fullscreenElement) canvasWrap.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });
  });
}

function renderProjects() {
  const wrap = $("#projects-list");

  for (const project of projects) {
    const bullets = project.bullets.map((b) => `<li>${b}</li>`).join("");
    const tags = (project.tags || []).map((t) => `<span class="tag">${t}</span>`).join("");

    const card = el(
      "article",
      "project-card reveal",
      `<div class="project-info">
         <h3>${project.name}</h3>
         <p class="project-meta">${project.tool}${project.dates ? " · " + project.dates : ""}</p>
         <p class="project-summary">${project.summary}</p>
         <ul class="project-bullets">${bullets}</ul>
         <div class="tags">${tags}</div>
       </div>
       <div class="project-viewer">
         <div class="viewer-canvas"></div>
         <div class="viewer-hud">
           <span class="viewer-status" data-state="idle">SCROLL TO LOAD 3D MODEL</span>
           <div class="viewer-toolbar">
             <button data-action="reset" title="Reset view">RESET</button>
             <button data-action="wireframe" title="Toggle wireframe">WIRE</button>
             <button data-action="rotate" title="Toggle auto-rotate">ROTATE</button>
             <button data-action="fullscreen" title="Fullscreen">⛶</button>
           </div>
         </div>
         <div class="viewer-corner tl"></div>
         <div class="viewer-corner tr"></div>
         <div class="viewer-corner bl"></div>
         <div class="viewer-corner br"></div>
       </div>`
    );

    wrap.appendChild(card);

    if (!project.model) continue;

    const canvasEl = card.querySelector(".viewer-canvas");
    const hud = card.querySelector(".viewer-hud");

    let viewer = null;
    const loadObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !viewer) {
            viewer = new StepViewer(canvasEl, { modelUrl: project.model });
            buildViewerControls(viewer, hud);
            viewer.load();
            loadObserver.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: "200px" }
    );
    loadObserver.observe(canvasEl);
  }
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
function renderContact() {
  const wrap = $("#contact-links");
  const items = [
    { label: "EMAIL", value: profile.email, href: `mailto:${profile.email}` },
    { label: "LINKEDIN", value: "hardy-wang", href: profile.linkedin },
    { label: "RESUME", value: "download PDF", href: profile.resumeFile, download: true },
  ];
  items.forEach(({ label, value, href, download }) => {
    const a = el(
      "a",
      "contact-card",
      `<span class="contact-label">${label}</span><span class="contact-value">${value}</span>`
    );
    a.href = href;
    if (download) a.setAttribute("download", "");
    else if (href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    wrap.appendChild(a);
  });
}

// ---------------------------------------------------------------------------
// Nav + scroll behaviour
// ---------------------------------------------------------------------------
function initNav() {
  const nav = $("#nav");
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");

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

  const sections = [...document.querySelectorAll("main .section, #hero")];
  const navAnchors = [...links.querySelectorAll("a")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          const match = links.querySelector(`a[href="#${entry.target.id}"]`);
          match?.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
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

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
renderHero();
renderAbout();
renderExperience();
renderProjects();
renderSkills();
renderContact();
initNav();
initReveal();
$("#year").textContent = new Date().getFullYear();
