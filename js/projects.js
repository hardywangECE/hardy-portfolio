import { projects } from "./data.js";
import { $, el, initPage } from "./common.js";
import { StepViewer } from "./viewer.js";

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
    const future = project.future
      ? `<div class="project-future">
           <p class="project-future-label">// PLANNED ITERATION</p>
           <p>${project.future}</p>
         </div>`
      : "";

    const card = el(
      "article",
      "project-card reveal",
      `<div class="project-info">
         <h3>${project.name}</h3>
         <p class="project-meta">${project.tool}${project.dates ? " · " + project.dates : ""}</p>
         <p class="project-summary">${project.summary}</p>
         <ul class="project-bullets">${bullets}</ul>
         <div class="tags">${tags}</div>
         ${future}
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

renderProjects();
initPage();
