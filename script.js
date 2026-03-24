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

function buildRepoCard(repo, featured, index) {
  const accent = featured?.accent || ["warm", "cool", "neutral"][index % 3];
  const tagline = featured?.tagline || repo.language || "Repository";
  const description =
    repo.description ||
    "这个仓库还没有填写描述，你可以在 GitHub 上补一段更清晰的项目说明。";
  const language = repo.language || "Unspecified";
  const stars = typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;

  return `
    <article class="project-card shell-card">
      <div class="project-icon ${escapeHtml(accent)}">${String(index + 1).padStart(2, "0")}</div>
      <p class="project-kicker">${escapeHtml(tagline)}</p>
      <h3>${escapeHtml(repo.name)}</h3>
      <p>${escapeHtml(description)}</p>
      <div class="repo-stats">
        <span class="project-meta">${escapeHtml(language)}</span>
        <span class="project-meta">★ ${escapeHtml(stars)}</span>
      </div>
      <a class="repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">
        查看仓库
      </a>
    </article>
  `;
}

function renderRepoFallback() {
  if (!repoGrid) return;

  const fallbackCards = featuredRepos
    .map((repo, index) => {
      const name = repo.name || `repo-${index + 1}`;
      const url = `${profileConfig.profileUrl || "https://github.com"}/${name}`;
      return `
        <article class="project-card shell-card">
          <div class="project-icon ${escapeHtml(repo.accent || "neutral")}">${String(index + 1).padStart(2, "0")}</div>
          <p class="project-kicker">${escapeHtml(repo.tagline || "Repository")}</p>
          <h3>${escapeHtml(name)}</h3>
          <p>GitHub API 暂时不可用时，页面会先按你的手动配置展示仓库入口。</p>
          <div class="repo-stats">
            <span class="project-meta">Manual listing</span>
          </div>
          <a class="repo-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">
            查看仓库
          </a>
        </article>
      `;
    })
    .join("");

  repoGrid.innerHTML = fallbackCards;
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

    const finalRepos = orderedRepos.length > 0 ? orderedRepos : repos.slice(0, 6);
    const languages = new Set(finalRepos.map((repo) => repo.language).filter(Boolean));

    repoGrid.innerHTML = finalRepos
      .map((repo, index) => buildRepoCard(repo, featuredRepoMap.get(repo.name), index))
      .join("");

    if (repoCountNode) repoCountNode.textContent = String(finalRepos.length);
    if (languageCountNode) languageCountNode.textContent = String(languages.size || 1);
  } catch (error) {
    renderRepoFallback();
    if (languageCountNode) languageCountNode.textContent = "--";
  }
}

loadGitHubRepos();
