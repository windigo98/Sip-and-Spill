# Sip & Spill

A phone-first Progressive Web App drinking game for parties: sexy truth or dare, never have I ever, most likely to, couples and friends rounds, trivia, would-you-rather, icebreakers, and chaos dares. It's shareable, installable, and built for big tap targets.

**21+ only.** Drink responsibly. Never drink and drive.

**Play it:** [https://windigo98.github.io/Sip-and-Spill/](https://windigo98.github.io/Sip-and-Spill/)

The project path is case-sensitive: `Sip-and-Spill` (capital S). **Share** copies or sends that URL when the game is opened on GitHub Pages.

**Tip on Cash App** on the home screen opens [https://cash.app/$windigo98](https://cash.app/$windigo98).

## How to play

1. Open the app and confirm you are **21 or older** (saved in `localStorage`).
2. Read the **How it works** panel on the home screen, then pick a **genre chip** (or **All**). Each chip shows its prompt count, and a blurb under the chips explains how that genre plays.
3. Optionally add **2–12 player names**. Cards that fit will address a random player (`Alex: …`). With fewer than 2 names, addressing is skipped.
4. Choose a mode:
   - **Pass the phone**: one big card. Do what the card says or follow its drink rule, then tap **Next** (or **Skip**) and hand the phone on.
   - **Host mode**: bigger text so one person can read aloud to the group. No Skip; just **Next**.
5. Every card shows:
   - a **genre badge**,
   - a **hint line** for the style of play (truth vs dare vs trivia vs vote, etc.),
   - a **🍹 drink rule**.
6. **Trivia** cards hide the answer until you **tap to reveal** (Space also reveals first). Drink if wrong / sip if right.
7. Prompts don't repeat until the selected deck has been fully cycled. Then it reshuffles.
8. Use **Share** to send the link (Web Share API) or copy it to the clipboard.

Keyboard: Space / Enter / → = Next (on Trivia, Space reveals the answer first).

## Genres

**418 prompts** total. Each prompt has exactly one primary genre.

| Genre | Prompts | How it plays |
|-------|--------:|--------------|
| **Mild** | 42 | Witty PG-13 truths, absurd roasts, party comedy. Answer, then follow the sip rule. |
| **Spicy** | 50 | Explicit adult-party questions. Answer or drink. |
| **Chaos** | 35 | Dares, "everyone drinks if…", physical silliness. |
| **Sexy Truth** | 35 | Filthy steamy questions. Spill or sip to pass. |
| **Sexy Dare** | 30 | NSFW-leaning flirty dares, consent first. Do it or drink. |
| **Never Have I Ever** | 35 | Read the statement. Anyone who **has** done it drinks. |
| **Most Likely To** | 32 | Everyone points on 3. The person picked drinks. |
| **Couples** | 29 | Partner prompts (including spicy). Singles sip or pair up. |
| **Friends** | 22 | Group lore, loyalty, kind roasts. |
| **Wild Card** | 29 | House rules and mini-games (some spicy). The host enforces them. |
| **Trivia** | 28 | Fun party trivia (pop culture, weird facts). Guess, tap to reveal. Drink if wrong / sip if right. |
| **Would You Rather** | 23 | Two spicy/funny options. Group picks; minority (or loser) drinks. |
| **Icebreaker** | 28 | Funny warmer starter prompts for mixed groups. Easy shares, light sips. |

### Heat levels

- **Mild / Icebreaker** — comedy-first, roast-friendly, still milder (no explicit sex focus).
- **Spicy / Sexy Truth / Sexy Dare / Couples** (and hotter **Never Have I Ever**, **Most Likely**, **Wild Card** cards) — explicit, dirty, adult-party NSFW. Pick these chips when the room wants heat.
- **Chaos / Friends / Trivia / Would You Rather** — mixed energy; not the main NSFW lanes.

**Content rules:** adults only (21+), consensual-only adult vibe. Nothing involves minors, and nothing is non-consensual or illegal. Every sexy dare can be refused: anyone who doesn't want to do it takes the drink instead (**refuse = drink**), and anything involving another person needs that person's OK.

## Art

Prompt cards scale type and watermark art by length: short prompts get larger title text and a bigger silhouette so the card doesn't look sparse; long prompts shrink slightly. Host mode uses especially large type.

Each genre has an original inline **SVG silhouette** scene in `art.js` (party crowd, cheers, chili, lightning dancer, lips + whisper bubble, dancing couple, raised hand, crowned pick, couple + heart, friends celebrating, wild cards, trivia podium, forked A/B path, icebreaker wave). The scenes are tasteful and not explicit. They use `currentColor`, so CSS tints them with the genre color.

- **Home:** hero art that changes with the selected genre.
- **Cards:** a faint watermark in the bottom-right corner.
- **Wide screens (≥900px):** glowing art panels on both sides of the card.

There are no image downloads; the art is a few KB of vector paths. Animation is turned off when the device has `prefers-reduced-motion` set.

## GitHub Pages

The site is the repository root. `.github/workflows/pages.yml` deploys to GitHub Pages on every push to `main` (same workflow as Net-pulse): checkout, copy the site, upload the Pages artifact, deploy.

Live URL: **https://windigo98.github.io/Sip-and-Spill/**

Pages is not enabled on this repo yet, so the first **Deploy GitHub Pages** run failed with `Not Found` / “Ensure GitHub Pages has been enabled.” This account cannot turn Pages on. You need to set the source yourself:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.
3. Re-run **Deploy GitHub Pages** from the Actions tab (or push any commit to `main`).

After that, the share URL above should load the game.

Asset links stay relative (`./`) and the service worker scope follows the page directory, so `/Sip-and-Spill/` is the app root. A `<base>` tag is added only when the URL has no trailing slash.

## Run locally

From the repository root, start any static file server:

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080/** in a browser (phone or desktop).

Other options:

```bash
npx --yes serve -l 8080
# or
php -S localhost:8080
```

> PWA install + service worker need `http://` or `https://` (not `file://`).

## Install as PWA

On supported mobile browsers: **Add to Home Screen** / **Install app**. The manifest and icons are included, and the service worker (cache `sip-spill-v8`) caches the core assets, including `art.js` and the full deck, so the game works offline. When you change assets, bump `CACHE` in `sw.js`.

## Project layout

```
index.html      # UI shells (gate, home + how-to + genre chips + players, play)
styles.css      # Dark party UI
app.js          # Modes, genre filters, players, trivia reveal, shuffle, share, age gate
prompts.js      # Prompt deck (SIP_PROMPTS) + genre metadata (SIP_GENRES)
art.js          # Inline SVG silhouette art per genre (SIP_ART)
manifest.json   # PWA manifest
sw.js           # Service worker
icons/          # SVG + PNG icons
.nojekyll
.github/workflows/pages.yml
README.md
```

## License

Partyware — use freely with friends. Stay safe.

## Adding prompts

Add an entry to `window.SIP_PROMPTS` in `prompts.js`:

```js
{ id: "st26", category: "sexy_truth", text: "…", hint: "Sexy Truth — spill the tea or sip to pass.", rule: "Sip if you pass." }
```

Optional fields:

- `answer` — for **Trivia**: shown after tap-to-reveal.
- `{player}` in `text` — replaced with a random name when 2–12 players are set; otherwise the `Name: ` prefix is stripped.

`category` must be a key in `window.SIP_GENRES`. To add a whole new genre, add it to `SIP_GENRES`, add a chip in `index.html`, add a color in `CAT_COLORS` (`app.js`), and optionally add a scene in `art.js` (it falls back to the party crowd). Then bump the SW cache.

