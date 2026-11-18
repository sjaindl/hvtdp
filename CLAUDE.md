# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Behavior**: See [SOUL.md](./SOUL.md) for guidelines on tone, autonomy, and trust.

## Project Overview

Angular website for the HV TDP Stainz football club. Covers news, team info, championship standings, photo galleries, tournaments, voting, membership, and more.

## Commands

```bash
# Development server (http://localhost:4200)
npm start

# Production build (output: dist/hvtdp)
npm run build

# Run unit tests (Karma/Jasmine)
npm test

# Lint
npm run lint

# SSR server (port 4000)
npm run serve:ssr:hvtdp

# Angular component/service generation
ng generate component src/app/<name>
ng generate service src/app/services/<name>
```

## Architecture

**Framework**: Angular 21 with Angular Material and Tailwind CSS (an Express SSR setup exists, see Deployment).

**Routing**: Hash-based (`#`) routing defined in `src/app/app-routing/routes.ts` with 30+ routes.

**API**: Two backends, both remote (no local backend):
- **News** comes from a self-hosted Strapi 5 CMS at `https://cms.hvtdpstainz.at` via `src/app/services/cms.service.ts` (`GET /api/news-items`, paged at 100 per request and cached with `shareReplay`). The CMS URL is `environment.cmsUrl` (`src/environments/`): `http://localhost:1337` in dev, `https://cms.hvtdpstainz.at` in production. News are edited in the Strapi admin (`https://cms.hvtdpstainz.at/admin`).
- **Everything else** goes through `src/app/services/mysql.service.ts`, which hits the PHP endpoints at `https://www.hvtdpstainz.at/api/` (sources in `serverscripts/api/`).

**News content**: `News.content` is Markdown, rendered in `NewsComponent` with `marked` (`breaks: true`, `gfm: true`) and bound via `[innerHTML]` so Angular's sanitizer applies — don't bypass it. Image URLs are absolute CMS URLs; relative `/uploads/...` paths are resolved with `CmsService.resolveUrl()`. Deep links `/news/:newsId` use the numeric `newsId` field, which Strapi assigns automatically for new items.

**Strapi project**: lives in the sibling repo `../strapi-cloud-template-blog-49970f95ac` (content type `news-item`, migration script `scripts/migrate-news.js`, VPS runbook `DEPLOY-VPS.md`).

**Data models**: Shared TypeScript interfaces live in `src/app/shared/` (Player, Game, Standing, News, Album, Member, etc.).

**Components**: 47 feature components declared in `AppModule` (`src/app/app.module.ts`). Each feature (e.g. gallery, tournament, team) has its own directory under `src/app/`.

**Deployment**: Production is served as static files by nginx (CloudPanel) on the VPS. Run `npm run build` and upload the *contents* of `dist/hvtdp/` (`index.html`, hashed `*.js`/`*.css`, `assets/`) directly into the site's document root, keeping the existing `api/` folder (PHP endpoints). Verify with `curl -I https://www.hvtdpstainz.at/<main.[hash].js>` — a 404 means the files went to the wrong folder. `server.ts` (Express SSR, `npm run serve:ssr:hvtdp`) exists but is not used in production.

**Third-party integrations embedded in `src/index.html`**:
- Flowise AI chatbot
- Google Analytics (UA + GA4)
- SurveyHero surveys
- Cookie consent (ngx-cookieconsent)

## NotebookLM Skill

The `/notebooklm` skill is installed project-locally (`.claude/commands/notebooklm.md`). It uses `notebooklm-py` to automate Google NotebookLM for content generation (podcasts, videos, quizzes, etc.).

```bash
# One-time authentication (interactive browser login)
notebooklm login

# Typical workflow
notebooklm create "Notebook Title"
notebooklm source add /path/to/file.md -n <notebook-id>
notebooklm generate video -n <notebook-id>
notebooklm artifact list -n <notebook-id>          # check status
notebooklm download video ./output.mp4 -a <artifact-id> -n <notebook-id>
```

Video generation takes 15–45 minutes. Auth state is stored in `~/.notebooklm/`.

## Key Conventions

- All new routes must be added to both `src/app/app-routing/routes.ts` and declared/imported in `src/app/app.module.ts`.
- Photo album import tooling lives in `scripts/` — shell scripts produce CSV data consumed by the backend.
- Angular Material is the primary component library; Tailwind is used for layout/spacing utilities.
- Cookie consent is initialized in `AppComponent.ngOnInit()`.
