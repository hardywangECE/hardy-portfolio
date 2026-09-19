import { profile, skills } from "./data.js";
import { $, el, initPage } from "./common.js";

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

renderHero();
renderSkills();
renderContact();
initPage();
