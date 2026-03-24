const timeNode = document.querySelector("#localTime");
const pulseButton = document.querySelector("#themePulseButton");
const revealNodes = document.querySelectorAll(".reveal");
const repoGrid = document.querySelector("#repoGrid");
const repoCountNode = document.querySelector("#repoCount");
const languageCountNode = document.querySelector("#languageCount");
const githubIdentityNode = document.querySelector("#githubIdentity");
const githubProfileLink = document.querySelector("#githubProfileLink");
const siteConfig = window.SITE_CONFIG || {};
const profileConfig = siteConfig.profile || {};
const featuredRepos = Array.isArray(siteConfig.featuredRepos)
  ? siteConfig.featuredRepos
  : [];

function updateShanghaiTime() {
  if (!timeNode) return;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  });

  timeNode.textContent = formatter.format(new Date());
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealNodes.forEach((node) => observer.observe(node));
updateShanghaiTime();
window.setInterval(updateShanghaiTime, 30000);

if (pulseButton) {
  pulseButton.addEventListener("click", () => {
    document.documentElement.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.997)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 380,
        easing: "ease-out",
      }
    );

    const hero = document.querySelector(".hero");
    hero?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return map[char];
  });
}

function observeRevealNodes(root = document) {
  root.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

function getToneClass(featured) {
  return featured?.visual?.tone || "blue";
}

function buildMeta(repo, featured, index, isFallback = false) {
  const language = repo.language || "Unspecified";
  const stars = typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;
  const url =
    repo.html_url ||
    `${profileConfig.profileUrl || "https://github.com"}/${featured?.name || repo.name || ""}`;
  const status = featured?.status || "Building";
  const headline = featured?.headline || "Small project. Clear intention.";
  const intro =
    featured?.intro ||
    "这是一个正在持续完善中的项目，你可以点进仓库看更完整的代码、说明和更新记录。";
  const description = isFallback
    ? "GitHub API 暂时不可用时，页面会先按你的手动配置展示这个仓库。"
    : repo.description ||
      "这个仓库还没有填写描述，你可以在 GitHub 上补一段更清晰的项目说明。";
  const tags = Array.isArray(featured?.tags) ? featured.tags.slice(0, 4) : [];

  return {
    accent: featured?.accent || ["warm", "cool", "neutral"][index % 3],
    tagline: featured?.tagline || repo.language || "Repository",
    headline,
    intro,
    description,
    language,
    stars,
    status,
    tags,
    url,
    eyebrow: featured?.visual?.eyebrow || "Project",
    tone: getToneClass(featured),
  };
}

function buildSpotlightRepo(repo, featured, index, isFallback = false) {
  const meta = buildMeta(repo, featured, index, isFallback);
  const tags = meta.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
  return `
    <article class="repo-spotlight shell-card reveal repo-panel tone-${escapeHtml(meta.tone)}">
      <div class="repo-copy">
        <p class="eyebrow">${escapeHtml(meta.eyebrow)}</p>
        <div class="repo-card-topline">
          <div class="project-icon ${escapeHtml(meta.accent)}">${String(index + 1).padStart(2, "0")}</div>
          <span class="repo-status">${escapeHtml(meta.status)}</span>
        </div>
        <p class="project-kicker">${escapeHtml(meta.tagline)}</p>
        <h3>${escapeHtml(repo.name)}</h3>
        <p class="repo-headline spotlight-headline">${escapeHtml(meta.headline)}</p>
        <p class="repo-intro">${escapeHtml(meta.intro)}</p>
        <p class="repo-description">${escapeHtml(meta.description)}</p>
        ${tags ? `<ul class="repo-tag-row">${tags}</ul>` : ""}
        <div class="repo-stats">
          <span class="project-meta">${escapeHtml(meta.language)}</span>
          <span class="project-meta">★ ${escapeHtml(meta.stars)}</span>
        </div>
        <a class="repo-link" href="${escapeHtml(meta.url)}" target="_blank" rel="noreferrer">
          查看仓库
        </a>
      </div>
      <div class="repo-visual">
        <div class="repo-glow"></div>
        <div class="repo-orbit orbit-one"></div>
        <div class="repo-orbit orbit-two"></div>
        <div class="repo-stripes">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="repo-visual-core">
          <p>${escapeHtml(meta.tagline)}</p>
          <h4>${escapeHtml(repo.name)}</h4>
          <span>${escapeHtml(meta.headline)}</span>
        </div>
      </div>
    </article>
  `;
}

function buildShowcaseRepo(repo, featured, index, isFallback = false) {
  const meta = buildMeta(repo, featured, index, isFallback);
  const tags = meta.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
  return `
    <article class="repo-showcase-card shell-card reveal repo-panel tone-${escapeHtml(meta.tone)}">
      <div class="repo-card-topline">
        <div class="project-icon ${escapeHtml(meta.accent)}">${String(index + 1).padStart(2, "0")}</div>
        <span class="repo-status">${escapeHtml(meta.status)}</span>
      </div>
      <p class="project-kicker">${escapeHtml(meta.tagline)}</p>
      <h3>${escapeHtml(repo.name)}</h3>
      <p class="repo-headline">${escapeHtml(meta.headline)}</p>
      <p class="repo-intro">${escapeHtml(meta.intro)}</p>
      <p class="repo-description">${escapeHtml(meta.description)}</p>
      ${tags ? `<ul class="repo-tag-row">${tags}</ul>` : ""}
      <div class="repo-bottom-row">
        <div class="repo-stats">
          <span class="project-meta">${escapeHtml(meta.language)}</span>
          <span class="project-meta">★ ${escapeHtml(meta.stars)}</span>
        </div>
        <a class="repo-link" href="${escapeHtml(meta.url)}" target="_blank" rel="noreferrer">
          查看仓库
        </a>
      </div>
      <div class="repo-card-bg">
        <span></span>
        <span></span>
      </div>
    </article>
  `;
}

function renderRepoShowcase(repos, featuredRepoMap, isFallback = false) {
  if (!repoGrid) return;
  if (!Array.isArray(repos) || repos.length === 0) return;

  const [spotlight, ...rest] = repos;
  const spotlightFeatured = featuredRepoMap.get(spotlight.name) || featuredRepos[0];
  const restMarkup = rest
    .map((repo, index) =>
      buildShowcaseRepo(repo, featuredRepoMap.get(repo.name), index + 1, isFallback)
    )
    .join("");

  repoGrid.innerHTML = `
    ${buildSpotlightRepo(spotlight, spotlightFeatured, 0, isFallback)}
    <div class="repo-showcase-grid">
      ${restMarkup}
    </div>
  `;

  observeRevealNodes(repoGrid);
  attachRepoMotion();
}

function attachRepoMotion() {
  document.querySelectorAll(".repo-panel").forEach((panel) => {
    panel.addEventListener("mousemove", (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      panel.style.setProperty("--tilt-x", `${x * 7}deg`);
      panel.style.setProperty("--tilt-y", `${y * -7}deg`);
      panel.style.setProperty("--glow-shift-x", `${x * 18}px`);
      panel.style.setProperty("--glow-shift-y", `${y * 18}px`);
    });

    panel.addEventListener("mouseleave", () => {
      panel.style.setProperty("--tilt-x", "0deg");
      panel.style.setProperty("--tilt-y", "0deg");
      panel.style.setProperty("--glow-shift-x", "0px");
      panel.style.setProperty("--glow-shift-y", "0px");
    });
  });
}

function renderRepoFallback() {
  if (!repoGrid) return;

  const fallbackRepos = featuredRepos.map((repo) => ({
    name: repo.name,
    language: repo.tags?.[0] || "Configured",
    stargazers_count: 0,
  }));
  const featuredRepoMap = new Map(featuredRepos.map((repo) => [repo.name, repo]));
  renderRepoShowcase(fallbackRepos, featuredRepoMap, true);
  if (repoCountNode) repoCountNode.textContent = String(featuredRepos.length || "--");
}

async function loadGitHubRepos() {
  const username = profileConfig.githubUsername;
  if (!username || !repoGrid) return;

  if (githubIdentityNode) {
    githubIdentityNode.textContent = `${profileConfig.displayName || username} / @${username}`;
  }

  if (githubProfileLink && profileConfig.profileUrl) {
    githubProfileLink.href = profileConfig.profileUrl;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const repos = await response.json();
    const featuredRepoMap = new Map(featuredRepos.map((repo) => [repo.name, repo]));
    const selectedRepos = repos.filter((repo) => featuredRepoMap.has(repo.name));
    const orderedRepos = featuredRepos
      .map((repo) => selectedRepos.find((item) => item.name === repo.name))
      .filter(Boolean);
    const fallbackRepos = repos
      .filter((repo) => !orderedRepos.some((item) => item.name === repo.name))
      .slice(0, 6 - orderedRepos.length);
    const finalRepos = orderedRepos.length > 0 ? [...orderedRepos, ...fallbackRepos] : repos.slice(0, 6);
    const languages = new Set(finalRepos.map((repo) => repo.language).filter(Boolean));
    renderRepoShowcase(finalRepos, featuredRepoMap);

    if (repoCountNode) repoCountNode.textContent = String(finalRepos.length);
    if (languageCountNode) languageCountNode.textContent = String(languages.size || 1);
  } catch (error) {
    renderRepoFallback();
    if (languageCountNode) languageCountNode.textContent = "--";
  }
}

loadGitHubRepos();
