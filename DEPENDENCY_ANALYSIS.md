# Dependency Analysis Report

**Project:** Money Changer App
**Date:** 2026-02-18
**Node modules size:** ~23 MB (130 packages)

---

## Current Dependencies

| Package | Declared | Installed | Latest | Status |
|---|---|---|---|---|
| bcrypt | ^6.0.0 | 6.0.0 | 6.0.0 | Up to date |
| ejs | ^3.1.10 | 3.1.10 | 4.0.1 | Major version behind |
| express | ^4.21.2 | 4.22.1 | 5.2.1 | Major version behind |
| express-session | ^1.18.1 | 1.18.2 | 1.19.0 | Minor version behind |
| pg | ^8.13.1 | 8.16.3 | 8.18.0 | Minor versions behind |
| sequelize | ^6.37.5 | 6.37.7 | 6.37.7 | Up to date (v7 still alpha) |

---

## 1. Security Vulnerabilities

### 1.1 npm audit: `qs` denial-of-service (Low severity)

- **Package:** qs 6.7.0–6.14.1 (transitive via express)
- **Advisory:** [GHSA-w7fw-mjwx-w883](https://github.com/advisories/GHSA-w7fw-mjwx-w883) — arrayLimit bypass in comma parsing allows denial of service
- **Fix:** `npm audit fix` (updates qs to a patched version)

### 1.2 Hardcoded session secret

- **File:** `app.js:11`
- **Issue:** The session secret is hardcoded as `"moneychangergood"`. This should be loaded from an environment variable. A weak or exposed secret allows session forgery.
- **Recommendation:** Use `process.env.SESSION_SECRET` and set it in a `.env` file (already gitignored).

### 1.3 Database credentials in config.json

- **File:** `config/config.json`
- **Issue:** PostgreSQL username/password (`postgres`/`postgres`) are committed to source control.
- **Recommendation:** Migrate to environment variables or use Sequelize's `config.js` with `dotenv`.

### 1.4 express-session using MemoryStore

- **File:** `app.js:9-18`
- **Issue:** No session store is configured, so `express-session` defaults to `MemoryStore`. This leaks memory over time and does not work across multiple processes.
- **Recommendation:** For production, use a persistent store such as `connect-pg-simple` (reuses your existing PostgreSQL database).

---

## 2. Outdated Packages

### 2.1 Express 4 → 5 (Recommended: plan migration)

Express 5 became the default on npm in March 2025. Express 4 is now in **maintenance mode** with a 12-month support window.

**Breaking changes to evaluate:**
- Requires Node.js >= 18
- Path route matching changes (regex sub-expressions no longer supported)
- Built-in async error handling (no more uncaught promise rejections silently ignored)
- `req.host` returns the full `Host` header value
- Removed deprecated `req.param()` method

**Impact on this project:** Low-moderate. Route definitions in `routes/route.js` use simple string paths (no regex), so migration should be straightforward.

### 2.2 EJS 3.x → 4.x (Evaluate before upgrading)

EJS 4.0.1 is available. The 3.1.10 version you have is patched against the known prototype pollution vulnerability (CVE-2024-33883). EJS 4.x does not have a corresponding GitHub release tag yet, so review the changelog carefully before upgrading.

### 2.3 express-session, pg (Minor bumps)

These can be updated immediately with `npm update`:
- `express-session`: 1.18.2 → 1.19.0
- `pg`: 8.16.3 → 8.18.0

---

## 3. Dependency Bloat

### 3.1 Sequelize's heavy transitive dependencies

Sequelize v6 pulls in `moment`, `moment-timezone`, and `lodash` as transitive dependencies. None of these are used directly in project source code.

| Package | Size | Notes |
|---|---|---|
| moment | 4.4 MB | Deprecated library; not imported in project code |
| moment-timezone | 2.8 MB | Not imported in project code |
| lodash | 1.7 MB | Not imported in project code |
| **Total** | **8.9 MB** | **39% of total node_modules** |

These cannot be removed while using Sequelize v6 — they are internal dependencies. The upcoming Sequelize v7 removes the moment dependency, but v7 is still in alpha (v7.0.0-alpha.47) with no stable release date.

### 3.2 `pg` — Required but never directly imported

`pg` is listed as a direct dependency but is never `require()`d in the source code. It is used internally by Sequelize as the PostgreSQL driver. While this is the standard Sequelize setup and `pg` must remain installed, it could optionally be moved to a peer dependency declaration to make the relationship explicit.

### 3.3 `jake` — Unnecessary transitive dependency from EJS

EJS pulls in `jake` (a build tool) as a runtime dependency, along with `async`, `filelist`, and `picocolors`. This is a known issue with the EJS package — jake is only needed for EJS development, not for using EJS as a template engine. EJS 4.x may address this.

---

## 4. Recommendations Summary

### Immediate (no risk)

| Action | Command/Change |
|---|---|
| Fix qs vulnerability | `npm audit fix` |
| Update minor versions | `npm update` (picks up pg 8.18.0, express-session 1.19.0) |
| Move secrets to env vars | Replace hardcoded session secret and DB credentials with `process.env.*` |

### Short-term (low risk, moderate effort)

| Action | Notes |
|---|---|
| Add a production session store | Install `connect-pg-simple` to use PostgreSQL for sessions |
| Evaluate Express 5 migration | Express 4 is in maintenance mode; routes in this project are simple enough for a straightforward migration |
| Add `dotenv` to devDependencies | Use `.env` files for configuration management |

### Long-term (evaluate when stable)

| Action | Notes |
|---|---|
| Sequelize v7 migration | Will eliminate moment/moment-timezone bloat (~7.2 MB); wait for stable release |
| EJS 4.x upgrade | Review breaking changes when GitHub release is published |

### Not recommended

| Action | Reason |
|---|---|
| Replace bcrypt with bcryptjs | bcrypt v6 is current and performant; bcryptjs is slower. Only switch if native compilation becomes a deployment issue |
| Remove pg from package.json | While not directly imported, Sequelize requires it as a peer dependency for PostgreSQL. Removing it would break the application |
