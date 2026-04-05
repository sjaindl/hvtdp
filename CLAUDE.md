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

**Framework**: Angular 21 with Angular Material, Tailwind CSS, and SSR (Angular Universal/Express).

**Routing**: Hash-based (`#`) routing defined in `src/app/app-routing/routes.ts` with 30+ routes.

**API**: All backend calls go through `src/app/services/mysql.service.ts` which hits PHP endpoints at `https://www.hvtdpstainz.at/api/`. No local backend — data comes from a live remote server.

**Data models**: Shared TypeScript interfaces live in `src/app/shared/` (Player, Game, Standing, News, Album, Member, etc.).

**Components**: 47 feature components declared in `AppModule` (`src/app/app.module.ts`). Each feature (e.g. gallery, tournament, team) has its own directory under `src/app/`.

**SSR**: `server.ts` runs an Express server serving the Angular app. Static assets are served with a 1-year cache header. Deploy with `npm run build` then `npm run serve:ssr:hvtdp`.

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
