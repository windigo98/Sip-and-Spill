(function () {
  "use strict";

  const AGE_KEY = "sipspill_age_ok";
  const FILTER_KEY = "sipspill_filter";
  const PLAYERS_KEY = "sipspill_players";
  const MAX_PLAYERS = 12;
  const MIN_PLAYERS = 2;
  const CAT_COLORS = {
    all: "#a78bfa",
    mild: "#34d399",
    spicy: "#fb7185",
    chaos: "#fbbf24",
    sexy_truth: "#f472b6",
    sexy_dare: "#e11d48",
    never_have_i_ever: "#38bdf8",
    most_likely: "#c084fc",
    couples: "#fda4af",
    friends: "#4ade80",
    wild_card: "#f97316",
    trivia: "#67e8f9",
    would_you_rather: "#f0abfc",
    icebreaker: "#86efac",
  };
  const GENRES = window.SIP_GENRES || {};
  const CAT_LABELS = Object.fromEntries(
    Object.values(GENRES).map((g) => [g.id, g.label])
  );
  const art = (g) => (typeof window.SIP_ART === "function" ? window.SIP_ART(g) : "");

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  const state = {
    mode: null, // "pass" | "host"
    filter: GENRES[localStorage.getItem(FILTER_KEY)] ? localStorage.getItem(FILTER_KEY) : "all",
    deck: [],
    index: 0,
    shownInCycle: 0,
    players: loadPlayers(),
    answerRevealed: false,
  };

  function loadPlayers() {
    try {
      const raw = JSON.parse(localStorage.getItem(PLAYERS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .map((n) => String(n || "").trim())
        .filter(Boolean)
        .slice(0, MAX_PLAYERS);
    } catch {
      return [];
    }
  }

  function savePlayers() {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(state.players));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function filteredPrompts() {
    const all = window.SIP_PROMPTS || [];
    if (state.filter === "all") return all.slice();
    return all.filter((p) => p.category === state.filter);
  }

  function rebuildDeck() {
    state.deck = shuffle(filteredPrompts());
    state.index = 0;
    state.shownInCycle = 0;
  }

  function currentPrompt() {
    if (!state.deck.length) rebuildDeck();
    return state.deck[state.index];
  }

  function randomPlayer() {
    if (!state.players.length) return null;
    return state.players[Math.floor(Math.random() * state.players.length)];
  }

  /** Substitute {player} when 2+ names exist; strip addressing otherwise. */
  function formatPromptText(text) {
    if (!text) return "";
    const name = state.players.length >= MIN_PLAYERS ? randomPlayer() : null;
    if (name) {
      return text.replaceAll("{player}", name);
    }
    // No names (or fewer than 2): drop "Alex: " prefixes; bare {player} -> "Someone"
    return text
      .replace(/\{player\}:\s*/g, "")
      .replaceAll("{player}", "Someone");
  }

  function advance(skip = false) {
    state.shownInCycle++;
    state.index++;
    state.answerRevealed = false;
    if (state.index >= state.deck.length) {
      rebuildDeck();
      toast(skip ? "Deck reshuffled" : "Deck complete — reshuffled!");
    }
    renderCard();
  }

  function toast(msg, ms = 2200) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), ms);
  }

  function showScreen(id) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  }

  function renderAnswerBlock(p) {
    const block = $("#answer-block");
    const label = $("#answer-label");
    const text = $("#answer-text");
    if (!p || !p.answer) {
      block.hidden = true;
      block.classList.remove("revealed");
      text.textContent = "";
      return;
    }
    block.hidden = false;
    block.classList.toggle("revealed", state.answerRevealed);
    if (state.answerRevealed) {
      label.textContent = "Answer";
      text.textContent = p.answer;
    } else {
      label.textContent = "Tap to reveal answer";
      text.textContent = "•••";
    }
  }

  function renderCard() {
    const p = currentPrompt();
    const card = $("#prompt-card");
    const play = $("#screen-play");
    play.classList.toggle("host-mode", state.mode === "host");
    const selectionLabel = CAT_LABELS[state.filter] || "All";
    $("#play-genre").textContent = selectionLabel;
    $("#play-mode-label").textContent = state.mode === "host" ? "Host mode" : "Pass the phone";
    play.style.setProperty("--sel-color", CAT_COLORS[state.filter] || "#a78bfa");
    $("#btn-skip").hidden = state.mode === "host";

    if (!p) {
      $("#prompt-text").textContent = "No prompts in this genre.";
      $("#rule-line").textContent = "";
      $("#hint-line").textContent = "";
      $("#cat-badge").textContent = "—";
      $("#cat-badge").hidden = false;
      $("#play-card-genre").hidden = true;
      renderAnswerBlock(null);
      return;
    }

    const color = CAT_COLORS[p.category] || "#a78bfa";
    card.style.setProperty("--cat-color", color);
    play.style.setProperty("--cat-color", color);
    const cardLabel = CAT_LABELS[p.category] || p.category;
    const cardGenre = $("#play-card-genre");
    const mixedDeck = cardLabel !== selectionLabel;
    cardGenre.textContent = mixedDeck ? cardLabel : "";
    cardGenre.hidden = !mixedDeck;
    const badge = $("#cat-badge");
    badge.textContent = cardLabel;
    // Title lives in the header now (selection, plus this card's genre when the
    // deck is All). Don't repeat it as a small badge on the card.
    badge.hidden = true;
    const promptDisplay = formatPromptText(p.text);
    $("#prompt-text").textContent = promptDisplay;

    // Responsive type + art: short prompts fill the card, long ones shrink slightly
    const len = promptDisplay.length;
    const lenClass = len < 70 ? "short" : len < 140 ? "medium" : "long";
    card.dataset.len = lenClass;

    // Genre art: watermark inside card + side panel on wide screens
    if (card.dataset.art !== p.category) {
      card.dataset.art = p.category;
      $("#card-watermark").innerHTML = art(p.category);
      $("#card-art").innerHTML = art(p.category);
      $("#card-art-right").innerHTML = art(p.category);
    }
    card.classList.remove("flip-in");
    void card.offsetWidth;
    card.classList.add("flip-in");

    const hintEl = $("#hint-line");
    hintEl.textContent = p.hint || "";
    hintEl.hidden = !p.hint;

    const ruleEl = $("#rule-line");
    ruleEl.textContent = p.rule ? "🍹 " + p.rule : "";
    ruleEl.hidden = !p.rule;

    renderAnswerBlock(p);

    const total = state.deck.length;
    const n = Math.min(state.index + 1, total);
    $("#play-progress").textContent = `${n} / ${total}`;
  }

  function startMode(mode) {
    state.mode = mode;
    state.answerRevealed = false;
    rebuildDeck();
    showScreen("screen-play");
    renderCard();
    const g = GENRES[state.filter];
    if (g) toast(`${g.label}: ${g.blurb}`, 3800);
  }

  function setFilter(f) {
    if (!GENRES[f]) f = "all";
    state.filter = f;
    localStorage.setItem(FILTER_KEY, f);
    $$(".chip").forEach((c) => {
      const on = c.dataset.filter === f;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const counts = countByCategory();
    const n = f === "all" ? counts.all : counts[f] || 0;
    $("#filter-count").textContent =
      f === "all" ? `${n} prompts` : `${n} ${CAT_LABELS[f]} prompts`;

    const g = GENRES[f];
    const blurb = $("#genre-blurb");
    blurb.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = g.label + ": ";
    blurb.append(strong, document.createTextNode(g.blurb));
    const home = $("#screen-home");
    home.style.setProperty("--cat-color", CAT_COLORS[f] || "#a78bfa");
    $("#hero-art").innerHTML = art(f);
  }

  function countByCategory() {
    const all = window.SIP_PROMPTS || [];
    const out = { all: all.length };
    all.forEach((p) => (out[p.category] = (out[p.category] || 0) + 1));
    return out;
  }

  function decorateChips() {
    const counts = countByCategory();
    $$(".chip").forEach((c) => {
      const f = c.dataset.filter;
      c.style.setProperty("--chip-color", CAT_COLORS[f] || "#a78bfa");
      const n = f === "all" ? counts.all : counts[f] || 0;
      let label = c.querySelector(".chip-label");
      let span = c.querySelector(".chip-n");
      if (!label) {
        const name = c.textContent.replace(/\s+/g, " ").trim();
        c.textContent = "";
        label = document.createElement("span");
        label.className = "chip-label";
        label.textContent = name;
        c.append(label);
        span = null;
      }
      if (!span) {
        span = document.createElement("span");
        span.className = "chip-n";
        c.append(span);
      }
      span.textContent = String(n);
    });
  }

  function renderPlayers() {
    const list = $("#player-list");
    const hint = $("#player-hint");
    const input = $("#player-input");
    list.innerHTML = "";
    state.players.forEach((name, i) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "player-chip";
      chip.setAttribute("aria-label", `Remove ${name}`);
      chip.innerHTML = `<span>${escapeHtml(name)}</span><span class="player-x" aria-hidden="true">×</span>`;
      chip.addEventListener("click", () => {
        state.players.splice(i, 1);
        savePlayers();
        renderPlayers();
      });
      list.append(chip);
    });
    const n = state.players.length;
    if (n === 0) {
      hint.textContent = "Optional — add 2–12 names so cards can call someone out.";
    } else if (n < MIN_PLAYERS) {
      hint.textContent = `${n} name${n === 1 ? "" : "s"} — add at least ${MIN_PLAYERS} for call-outs (or clear).`;
    } else {
      hint.textContent = `${n} players — cards may address someone at random.`;
    }
    input.disabled = n >= MAX_PLAYERS;
    $("#btn-add-player").disabled = n >= MAX_PLAYERS;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function addPlayer() {
    const input = $("#player-input");
    const name = (input.value || "").trim();
    if (!name) return;
    if (state.players.length >= MAX_PLAYERS) {
      toast(`Max ${MAX_PLAYERS} players`);
      return;
    }
    if (state.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      toast("Already added");
      input.value = "";
      return;
    }
    state.players.push(name.slice(0, 24));
    savePlayers();
    input.value = "";
    renderPlayers();
    input.focus();
  }

  /* Published project site. Capital S matches the GitHub repo name. */
  const PAGES_SHARE_URL = "https://windigo98.github.io/Sip-and-Spill/";

  function appBaseUrl() {
    let path = location.pathname;
    if (path.endsWith("/index.html")) path = path.slice(0, -"index.html".length);
    if (!path.endsWith("/")) path += "/";
    return new URL(path, location.origin);
  }

  function shareUrl() {
    if (location.hostname.endsWith("github.io")) return PAGES_SHARE_URL;
    return appBaseUrl().href;
  }

  async function shareGame() {
    const url = shareUrl();
    const data = {
      title: "Sip & Spill",
      text: "Party drinking game — truths, trivia, would-you-rather, sexy dares & chaos. 21+ only.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied!");
    } catch {
      toast(url);
    }
  }

  function initAgeGate() {
    if (localStorage.getItem(AGE_KEY) === "1") {
      showScreen("screen-home");
      return;
    }
    showScreen("screen-gate");
  }

  function bind() {
    $("#btn-age-yes").addEventListener("click", () => {
      localStorage.setItem(AGE_KEY, "1");
      showScreen("screen-home");
    });
    $("#btn-age-no").addEventListener("click", () => {
      showScreen("screen-blocked");
    });

    $("#btn-mode-pass").addEventListener("click", () => startMode("pass"));
    $("#btn-mode-host").addEventListener("click", () => startMode("host"));

    $$(".chip").forEach((chip) => {
      chip.addEventListener("click", () => setFilter(chip.dataset.filter));
    });

    $("#btn-next").addEventListener("click", () => advance(false));
    $("#btn-skip").addEventListener("click", () => advance(true));
    $("#btn-back").addEventListener("click", () => showScreen("screen-home"));
    $("#btn-share").addEventListener("click", shareGame);
    $("#btn-share-home").addEventListener("click", shareGame);

    $("#btn-add-player").addEventListener("click", addPlayer);
    $("#player-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addPlayer();
      }
    });
    $("#btn-clear-players").addEventListener("click", () => {
      state.players = [];
      savePlayers();
      renderPlayers();
    });

    $("#answer-block").addEventListener("click", () => {
      const p = currentPrompt();
      if (!p || !p.answer || state.answerRevealed) return;
      state.answerRevealed = true;
      renderAnswerBlock(p);
    });

    // Keyboard: space / arrow = next (unless focusing an input)
    document.addEventListener("keydown", (e) => {
      if (!$("#screen-play").classList.contains("active")) return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        // Space on trivia: reveal first if hidden
        const p = currentPrompt();
        if (e.key === " " && p && p.answer && !state.answerRevealed) {
          state.answerRevealed = true;
          renderAnswerBlock(p);
          return;
        }
        advance(false);
      }
    });
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    // Only register when served over http(s), not file://
    if (!/^https?:$/.test(location.protocol)) return;
    // Scope follows the page directory so /Sip-and-Spill/ (capital S) is the
    // app root on GitHub Pages, not the user-site root.
    const basePath = appBaseUrl();
    navigator.serviceWorker.register(new URL("sw.js", basePath), { scope: basePath.href }).catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", () => {
    decorateChips();
    bind();
    renderPlayers();
    setFilter(state.filter);
    initAgeGate();
    registerSW();
  });
})();
