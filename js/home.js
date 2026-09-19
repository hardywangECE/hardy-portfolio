import { profile, skills } from "./data.js";
import { $, el, initPage } from "./common.js";

function renderHero() {
  $("#hero-role").textContent = profile.role;
  $("#hero-tagline").textContent = profile.tagline;

  const resumeLink = $("#resume-link");
  resumeLink.href = profile.resumeFile;

  const links = [
    { label: "Email", href: `mailto:${profile.email}` },
    { label: "LinkedIn", href: profile.linkedin },
  ];
  if (profile.github) links.push({ label: "GitHub", href: profile.github });

  const wrap = $("#hero-links");
  links.forEach(({ label, href }) => {
    const a = el("a", "hero-link", label);
    a.href = href;
    if (href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    wrap.appendChild(a);
  });
}

function renderSkills() {
  const wrap = $("#skills-grid");
  Object.entries(skills).forEach(([category, items]) => {
    const chips = items.map((s) => `<span class="chip">${s}</span>`).join("");
    wrap.appendChild(
      el(
        "div",
        "skill-card reveal",
        `<p class="skill-cat">${category}</p>
         <div class="chip-row">${chips}</div>`
      )
    );
  });
}

function renderContact() {
  const wrap = $("#contact-links");
  const items = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "LinkedIn", value: "hardy-wang", href: profile.linkedin },
    { label: "Résumé", value: "Download PDF", href: profile.resumeFile, download: true },
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

renderHero();
renderSkills();
renderContact();
initPage();
