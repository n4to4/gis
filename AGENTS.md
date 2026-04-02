# AGENTS.md

This file provides guidance to AI agents (Claude Code, Codex, etc.) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview the built site locally
```

No test or lint commands are configured — Astro handles TypeScript type checking at build time.

## Architecture

This is a GIS documentation wiki built with **Astro** and **Starlight**. It is a static site deployed to GitHub Pages at `https://n4to4.github.io/gis`.

**Content system:** All documentation lives in `src/content/docs/` as Markdown/MDX files. Starlight's `docsLoader()` (configured in `content.config.ts`) automatically discovers files there and generates routes. The main content is in `src/content/docs/index.mdx`.

**Configuration:** `astro.config.mjs` controls site title, base path (`/gis`), GitHub social link, and sidebar structure. The base path matters for all asset and route references.

**Deployment:** GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` on push to `main` and deploys the `dist/` artifact to GitHub Pages.

## Writing Guidelines

When creating or editing documentation content, follow these rules:

- [文体ルール](docs/writing-style.md) — 日本語の文体・用語の統一
- [ページ作成ルール](docs/page-rules.md) — 1ページ1概念、ファイル配置、索引への追記
- [概念ページ テンプレート](docs/templates/concept.md) — 新規ページを作るときに使うテンプレート
