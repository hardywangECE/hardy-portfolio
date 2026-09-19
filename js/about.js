import { profile, education } from "./data.js";
import { $, el, initPage } from "./common.js";

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

renderAbout();
initPage();
