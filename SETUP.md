# Goyo Games — Setup Summary (as of 2026-07-06)

## GitHub
- Repo: https://github.com/viek-ctrl/goyo-games
- Branch: `main`
- Auto-deploy: `.github/workflows/deploy.yml` runs on every push to `main`, deploys to Cloudflare Pages via `wrangler`
- Secrets stored in repo (Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

## SSH access
- Key added to GitHub account `viek-ctrl` under Settings → SSH and GPG keys (titled "UNIVERSAL SSH")
- Local key: `~/.ssh/id_ed25519` (used for git push/pull over SSH)

## Cloudflare
- Account: "Viek@goyogames.gg's Account" — account ID `e2d4b37200082bad7a21855619a3f8f2`
- Pages project: `goyo-games` → live at https://goyo-games.pages.dev
- Zone: `goyogames.gg` — zone ID `db121e27475e482b0515fa904236da07`
- Cloudflare-assigned nameservers: `kayden.ns.cloudflare.com`, `kenia.ns.cloudflare.com`
- Status as of last check: zone **pending** — GoDaddy panel shows custom nameservers set correctly, but public DNS (8.8.8.8 / 1.1.1.1) still resolves to old GoDaddy nameservers (`ns75`/`ns76.domaincontrol.com`). Waiting on propagation.
- TODO once active: attach `goyogames.gg` as a custom domain to the `goyo-games` Pages project.

## Local project
- Path: `~/projects/goyo-games/`
- Files: `index.html`, `style.css`, `script.js` (all three required — the site is NOT a single-file bundle)

## Google Workspace / Email
- Domain mail (MX) records already point to Google correctly.
- Admin/super-admin account: **`viek@goyogames.gg`** (not `vivek@` — matches GitHub handle, not full name). This already exists.
- `vivek@goyogames.gg` does NOT exist and bounces with `550 5.1.1 address not found` — was never created as a separate user/alias.
- Open question: does the user want `vivek@goyogames.gg` created as an additional user/alias, or is `viek@goyogames.gg` the intended address going forward?

## Security notes
- Two GitHub PATs and one Cloudflare API token were pasted directly in chat during setup — recommend rotating/revoking all three:
  - GitHub fine-grained PAT (had zero repo access, likely already unusable)
  - GitHub classic PAT (`ghp_...`) — used for repo creation, Actions secrets setup, and workflow polling
  - Cloudflare API token (`cfut_...`) — used for Pages project creation/deploy, zone lookup
