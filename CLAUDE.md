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

# Run unit tests once in headless Chrome (no watch)
npm run test:ci

# Lint
npm run lint

# SSR server (port 4000)
npm run serve:ssr:hvtdp

# Move PHP API data into Strapi (downloads the PHP JSON, runs the Strapi migration scripts; safe to re-run)
scripts/migrate-to-strapi.sh [area ...]      # --list shows the areas, --help the options

# Angular component/service generation
ng generate component src/app/<name>
ng generate service src/app/services/<name>
```

## Architecture

**Framework**: Angular 21 with Angular Material and Tailwind CSS (an Express SSR setup exists, see Deployment).

**Routing**: Hash-based (`#`) routing defined in `src/app/app-routing/routes.ts` with 30+ routes.

**API**: Almost all data comes from a self-hosted **Strapi 5 CMS** (`environment.cmsUrl`: `http://localhost:1337` in dev, `https://cms.hvtdpstainz.at` in production; admin at `/admin`). `src/app/services/cms.service.ts` loads collections page by page (100 per request) and caches them with `shareReplay`; feature services map the Strapi data to the models in `src/app/shared/`:
- `championship.service.ts`: seasons, standings, season scorers, matches (with goal scorers; `toMatchInfo` is shared)
- `video.service.ts`: goal videos, attached to matches (events like the Entenrennen are matches of competition `Event`)
- `poll.service.ts`: Tor des Jahres / Spieler der Saison / Torschuss Challenge votings; votes via `POST /api/poll-options/:documentId/vote` (vote counts are private in Strapi)
- `gallery.service.ts`: photo albums (photos in the media library, `small`/`medium`/`large` formats via `shared/utils/media.util.ts`)
- `club.service.ts`, `shop.service.ts`, `document.service.ts` (protected documents are downloaded with the members' password via `POST /api/documents/:documentId/download`)
- `page.service.ts`: Hallenturnier, Torschuss Challenge, Advent calendar and event pages (`club-event`: Bocciaturnier, Kleinfeldturnier, Big Darts, Entenrennen — one `ClubEventComponent`, the route passes the slug), plus their registrations (`POST /api/hallenturnier-registrations/register`, `/api/golden-shot-registrations/register`, `/api/club-event-registrations/register` — Strapi stores them and mails the club and the registrant)

Only surveys (`src/app/services/mysql.service.ts`) and the visit statistics (`statistics.service.ts`) still use the legacy PHP endpoints at `https://www.hvtdpstainz.at/api/` (sources in `serverscripts/api/`). The other scripts left in `serverscripts/api/` are data sources of the Flowise chatbot until it reads Strapi (see `DEPLOY-VPS.md` in the Strapi repo, section 5c).

Season/year lists (chips, newest-first) are derived from the Strapi data; routes like `/championship`, `/gallery`, `/social`, `/advent` without a parameter show the newest season.

**News content**: `News.content` is Markdown, rendered in `NewsComponent` with `marked` (`breaks: true`, `gfm: true`) and bound via `[innerHTML]` so Angular's sanitizer applies — don't bypass it. Image URLs are absolute CMS URLs; relative `/uploads/...` paths are resolved with `CmsService.resolveUrl()`. Deep links `/news/:newsId` use the numeric `newsId` field, which Strapi assigns automatically for new items.

**Strapi project**: lives in the sibling repo `../strapi-cloud-template-blog-49970f95ac` (content types in `src/api/`, readable admin titles for relations in `src/admin-titles.js`, VPS runbook `DEPLOY-VPS.md`). The legacy PHP data was moved there area by area with `scripts/migrate-to-strapi.sh [area ...]` (this repo; it downloads the PHP JSON and runs the Strapi repo's `scripts/migrate-<area>.js`, safe to re-run; `--list` shows the areas). Media (photos, videos, documents) live in the Strapi media library, not in `src/assets`.

**Postman**: `postman/` holds a collection of all public CMS requests (with tests) plus `local` and `production` environments — add a request for every new CMS endpoint. Requests marked "local only" (votes, registrations) create data and send mails.

**Data models**: Shared TypeScript interfaces live in `src/app/shared/` (MatchInfo, Standing, Scorer, Season, News with category, Album, Poll, Player, Member, page models, etc.).

**Components**: 47 feature components declared in `AppModule` (`src/app/app.module.ts`). Each feature (e.g. gallery, tournament, team) has its own directory under `src/app/`.

**Deployment**: Production is served as static files by nginx (CloudPanel) on the VPS. Run `npm run build` and upload the *contents* of `dist/hvtdp/` (`index.html`, hashed `*.js`/`*.css`, `assets/`) directly into the site's document root, keeping the existing `api/` folder (remaining PHP endpoints). Strapi changes (content types, migrations, SMTP/password settings) are deployed separately, see `DEPLOY-VPS.md` in the Strapi repo — its checklist in section 5b comes before the website deploy. Verify with `curl -I https://www.hvtdpstainz.at/<main.[hash].js>` — a 404 means the files went to the wrong folder. `server.ts` (Express SSR, `npm run serve:ssr:hvtdp`) exists but is not used in production.

**Third-party integrations and privacy**:
- Flowise AI chatbot (`src/index.html`; the embed script is served from this site via the npm package `flowise-embed`, see `angular.json` assets)
- Google Analytics 4 is loaded by `src/app/services/analytics.service.ts` **only after consent** in the cookie banner (`cookieconsent_status` cookie); never add tracking snippets to `index.html`
- SurveyHero surveys: the embed script is loaded only on `/surveys` (`SurveysComponent`)
- Google Maps on the contact page loads only after "Karte laden"; YouTube videos use youtube-nocookie and load on play
- Fonts (Inter, Material Icons) are self-hosted via npm (`@fontsource/inter`, `material-icons` in `angular.json` styles) — no Google Fonts
- Impressum and Datenschutzerklärung are Strapi `legal-page` entries (`/impressum`, `/datenschutz`); update the privacy text when adding a new third-party service

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
- Cookie consent is handled by `CookieBannerComponent` (`src/app/ui/cookie-banner/`), which switches Analytics on or off.
