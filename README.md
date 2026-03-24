# Apple-Style Personal Homepage

一个可直接打开的静态个人主页项目，视觉方向偏 Apple 风格，并且适合直接发布成 GitHub Pages：

- 玻璃化卡片和分层面板
- 柔和浅色背景与环境光晕
- 精致圆角、轻阴影和克制动效
- 适配桌面与移动端
- 支持从 GitHub API 读取仓库并展示为首页内容
- 无需安装依赖，直接打开 `index.html` 即可预览

## Files

- `index.html`: 页面结构与内容
- `styles.css`: 视觉样式、响应式布局和动效
- `script.js`: 实时时钟、滚动显现和轻交互
- `site-config.js`: GitHub 用户名、展示名称和精选仓库配置
- `GITHUB_COPY.md`: 给 GitHub 仓库和 README 使用的文案稿
- `.github/workflows/deploy-pages.yml`: GitHub Pages 自动部署工作流
- `PROFILE-README.md`: GitHub 个人资料页 README 模板

## Preview

在本地预览：

1. 进入项目目录
2. 直接用浏览器打开 `index.html`

如果你更喜欢本地服务器，也可以运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`

## Customize

你大概率会想先改这些内容：

- `site-config.js` 里的 `githubUsername`
- `site-config.js` 里的 `featuredRepos`
- Hero 标题和介绍文案
- 联系邮箱和 GitHub 链接
- 时间区域、能力列表和时间线内容

## GitHub Homepage Structure

如果你的目标是“GitHub 个人主页”，建议分成两部分：

1. `用户名/用户名`
   这个同名仓库用于 `README.md`，会显示在 GitHub Profile 页顶部。
2. `用户名.github.io`
   这个仓库用于 GitHub Pages 网站，也就是这个苹果风主页。

这两个仓库可以同时存在，而且职责不同。

## GitHub Pages

最推荐的做法是把当前项目放进：

```text
<your-username>.github.io
```

例如：

```text
Badelement.github.io
```

推上去后，默认访问地址通常就是：

```text
https://<your-username>.github.io
```

仓库里已经包含：

- GitHub Pages Actions 工作流
- `.nojekyll`
- 可单独复用的 Profile README 模板

## GitHub Commands

初始化并推送到 GitHub 的常见流程：

```bash
git init
git add .
git commit -m "Initial commit: Apple-style personal homepage"
```

之后把远程仓库地址换成你自己的：

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

如果你要把它作为用户主页仓库，远程仓库名应该是：

```bash
git remote add origin https://github.com/Badelement/Badelement.github.io.git
```

然后到 GitHub 仓库设置里：

1. 打开 `Settings`
2. 打开 `Pages`
3. 在 `Build and deployment` 里把 `Source` 设为 `GitHub Actions`

这是 GitHub 目前推荐的 Pages 自定义工作流方式。

## Notes

- 如果 GitHub API 读取失败，页面会退回到 `site-config.js` 里的手动仓库列表
- 如果你要把它作为真正的 GitHub 个人主页，最好再单独准备一个 Profile README 仓库
