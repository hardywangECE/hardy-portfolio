import { experience } from "./data.js";
import { $, el, initPage } from "./common.js";

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

renderExperience();
initPage();
