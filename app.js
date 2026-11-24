(() => {
  const data = window.COMMUNITY_CHORD_DATA;
  const connected = new Set();
  const joined = new Set();
  const rsvps = new Set();
  const listPreviewLimit = 2;
  const accountStorageKey = "communityChordAccounts";
  const accountSessionStorageKey = "communityChordActiveAccount";
  let currentAccount = null;
  let signupCredentials = null;
  let matchOffset = 0;
  let musicianOffset = 0;
  let communitiesExpanded = false;
  let eventsExpanded = false;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function setAccountMessage(message) {
    document.querySelector("#account-message").textContent = message;
  }

  function readAccounts() {
    try {
      const saved = window.localStorage.getItem(accountStorageKey);
      const accounts = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(accounts) || accounts.some((account) =>
        !account ||
        typeof account.name !== "string" ||
        typeof account.music !== "string" ||
        typeof account.instruments !== "string" ||
        typeof account.artists !== "string" ||
        !Array.isArray(account.roles) ||
        (account.email !== undefined && typeof account.email !== "string") ||
        (account.passwordHash !== undefined && typeof account.passwordHash !== "string") ||
        (account.passwordSalt !== undefined && typeof account.passwordSalt !== "string") ||
        (account.connections !== undefined && (!Array.isArray(account.connections) ||
          account.connections.some((id) => typeof id !== "string")))
      )) throw new Error("Saved accounts are not in the expected format.");
      return accounts;
    } catch (error) {
      console.error("Could not read saved Community Chord accounts.", error);
      setAccountMessage("Saved accounts could not be read in this browser. Check browser storage and try again.");
      return null;
    }
  }

  function restoreAccountSession() {
    try {
      const email = window.sessionStorage.getItem(accountSessionStorageKey);
      if (!email) return;
      const accounts = readAccounts();
      if (!accounts) return;
      currentAccount = accounts.find((account) => account.email?.toLowerCase() === email) || null;
      if (!currentAccount) {
        window.sessionStorage.removeItem(accountSessionStorageKey);
        return;
      }
      connected.clear();
      (currentAccount.connections || []).forEach((id) => {
        if (data.musicians.some((person) => person.id === id)) connected.add(id);
      });
    } catch (error) {
      console.error("Could not restore the Community Chord login session.", error);
      setAccountMessage("Your login session could not be restored in this browser.");
    }
  }

  function saveAccountSession(email) {
    try {
      window.sessionStorage.setItem(accountSessionStorageKey, email);
      return true;
    } catch (error) {
      console.error("Could not save the Community Chord login session.", error);
      return false;
    }
  }

  function clearAccountSession() {
    try {
      window.sessionStorage.removeItem(accountSessionStorageKey);
      return true;
    } catch (error) {
      console.error("Could not clear the Community Chord login session.", error);
      return false;
    }
  }

  function showAccountDialog(mode) {
    const dialog = document.querySelector("#account-dialog");
    const isSignup = mode === "signup";
    document.querySelector("#account-dialog-title").textContent = isSignup ? "Sign up unavailable" : "Log in unavailable";
    document.querySelector("#account-dialog-description").textContent = isSignup
      ? "This is a student prototype. You cannot actually sign up or create an account."
      : "This is a student prototype. You cannot actually log in.";
    dialog.showModal();
  }

  function setSignupStep(step) {
    const showCredentials = step === "credentials";
    const credentialsStep = document.querySelector("#signup-credentials");
    const profileStep = document.querySelector("#signup-profile");
    credentialsStep.hidden = !showCredentials;
    profileStep.hidden = showCredentials;
    credentialsStep.querySelectorAll("input").forEach((input) => { input.disabled = !showCredentials; });
    profileStep.querySelectorAll("input").forEach((input) => { input.disabled = showCredentials; });
  }

  async function hashPassword(password) {
    if (!window.crypto?.subtle) throw new Error("Secure password hashing is unavailable in this browser.");
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256);
    const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return { salt: toHex(salt), hash: toHex(new Uint8Array(bits)) };
  }

  async function verifyPassword(password, saltHex, expectedHash) {
    if (!window.crypto?.subtle) throw new Error("Secure password hashing is unavailable in this browser.");
    if (!/^[\da-f]{32}$/i.test(saltHex)) return false;
    const salt = new Uint8Array(saltHex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
    const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256);
    const hash = Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
    return hash === expectedHash;
  }

  function displayList(value) {
    return value.split(",").map((item) => item.trim()).filter(Boolean).join(" · ");
  }

  function saveCurrentAccountConnections() {
    if (!currentAccount) return true;
    const accounts = readAccounts();
    if (!accounts) return false;
    currentAccount.connections = [...connected];
    const accountIndex = accounts.findIndex((account) =>
      account.email?.toLowerCase() === currentAccount.email?.toLowerCase());
    if (accountIndex === -1) return false;
    accounts[accountIndex] = currentAccount;
    try {
      window.localStorage.setItem(accountStorageKey, JSON.stringify(accounts));
      return true;
    } catch (error) {
      console.error("Could not save Community Chord connections.", error);
      return false;
    }
  }

  function renderConnections() {
    const panel = document.querySelector("#profile-connections");
    const list = document.querySelector("#connections-list");
    if (!currentAccount) {
      panel.hidden = true;
      list.innerHTML = "";
      return;
    }
    const connections = data.musicians.filter((person) => connected.has(person.id));
    list.innerHTML = connections.length
      ? connections.map((person) => `
        <article class="connection-card">
          ${initialsAvatar(person.initials, person.color)}
          <div class="connection-card-copy">
            <h4>${escapeHtml(person.name)}</h4>
            <p>${escapeHtml(person.instrument)} · ${escapeHtml(person.location)}</p>
          </div>
        </article>
      `).join("")
      : '<p class="connections-empty">You have no connections yet.</p>';
  }

  function renderAccount() {
    const name = currentAccount?.name || "Guest musician";
    const initials = currentAccount
      ? currentAccount.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
      : "G";
    document.querySelector(".header-profile .avatar").textContent = initials;
    document.querySelector(".header-name").textContent = currentAccount?.name || "Guest";
    document.querySelector(".header-profile").setAttribute("aria-label", `View ${currentAccount ? `${name}'s` : "guest"} profile`);
    document.querySelectorAll('[data-account-action="signup"], [data-account-action="login"]')
      .forEach((button) => { button.hidden = Boolean(currentAccount); });
    document.querySelector("#logout-button").hidden = !currentAccount;
    document.querySelector("#profile-avatar").textContent = initials;
    document.querySelector("#profile-title").textContent = name;
    document.querySelector("#profile-location").textContent = currentAccount
      ? "Community musician · Here to make music"
      : "Sign up to create your profile";
    document.querySelector("#profile-instruments").textContent = currentAccount
      ? displayList(currentAccount.instruments)
      : "Add your instruments when you sign up";
    document.querySelector("#profile-music").textContent = currentAccount
      ? displayList(currentAccount.music)
      : "Add your favorite music when you sign up";
    document.querySelector("#profile-artists").textContent = currentAccount
      ? displayList(currentAccount.artists)
      : "Add your favorite artists when you sign up";
    document.querySelector("#profile-roles").textContent = currentAccount
      ? currentAccount.roles.join(" · ")
      : "Singer, songwriter, musician, and more";
    const profileAction = document.querySelector("#profile-action");
    profileAction.dataset.accountAction = currentAccount ? "" : "signup";
    profileAction.textContent = currentAccount ? "Find my bandmates ↗" : "Sign up to create your profile";
    renderConnections();
  }

  document.querySelectorAll('[data-account-action="signup"], [data-account-action="login"]').forEach((button) => {
    button.addEventListener("click", () => {
      showAccountDialog(button.dataset.accountAction);
    });
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => document.querySelector("#account-dialog").close());
  });
  document.querySelector("#account-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
  const membershipDialog = document.querySelector("#membership-dialog");
  document.querySelector("#membership-button").addEventListener("click", () => {
    membershipDialog.showModal();
  });
  document.querySelector("#membership-close").addEventListener("click", () => {
    membershipDialog.close();
  });
  membershipDialog.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
  document.querySelector("#membership-purchase").addEventListener("click", () => {
    membershipDialog.close();
  });

  function initialsAvatar(initials, color, extraClass = "") {
    return `<span class="avatar avatar-${escapeHtml(color)} ${extraClass}" aria-hidden="true">${escapeHtml(initials)}</span>`;
  }

  function matchScore(musician) {
    const sharedGenres = musician.genres.filter((genre) => data.currentUser.genres.includes(genre)).length;
    const complementary = data.currentUser.lookingFor.some((role) => {
      const wanted = role.toLowerCase();
      const instrument = musician.instrument.toLowerCase();
      return wanted === instrument || (wanted === "singer" && instrument === "vocals");
    }) ? 2 : 0;
    return sharedGenres + complementary;
  }

  function renderMatches() {
    const ranked = [...data.musicians].sort((a, b) => matchScore(b) - matchScore(a) || a.name.localeCompare(b.name));
    const picks = Array.from({ length: 3 }, (_, index) => ranked[(index + matchOffset) % ranked.length]);
    document.querySelector("#match-list").innerHTML = picks.map((person, index) => `
      <article class="match-card">
        <div class="match-card-top"><span class="match-number">0${index + 1}</span><span class="match-score">✦ ${Math.min(99, 78 + matchScore(person) * 5)}% your sound</span></div>
        <div class="match-person">
          ${initialsAvatar(person.initials, person.color, "match-avatar")}
          <div><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(person.instrument)} <span>·</span> ${escapeHtml(person.location)}</p></div>
        </div>
        <p class="match-reason">${escapeHtml(person.instrument)} + ${escapeHtml(data.currentUser.instruments[0])} could be a good sound. Into ${escapeHtml(person.genres.slice(0, 2).join(" and "))}.</p>
        <button class="button button-small ${connected.has(person.id) ? "button-connected" : "button-outline"}" type="button" data-connect="${escapeHtml(person.id)}">${connected.has(person.id) ? "Connected ✓" : "Say hello ↗"}</button>
      </article>
    `).join("");
  }

  function musicianCard(person) {
    return `<article class="musician-card">
      <div class="musician-card-top">${initialsAvatar(person.initials, person.color, "musician-avatar")}<span class="online-label"><span class="online-dot"></span> Open to connect</span></div>
      <div class="musician-main"><div class="musician-name-line"><h3>${escapeHtml(person.name)}</h3><span class="skill-badge">${escapeHtml(person.skill)}</span></div>
      <p class="musician-role">${escapeHtml(person.instrument)} <span>·</span> ${escapeHtml(person.location)}</p>
      <p class="musician-bio">${escapeHtml(person.bio)}</p>
      <div class="tag-row">${person.genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("")}</div>
      <div class="musician-footer"><span>Looking for <strong>${escapeHtml(person.lookingFor.slice(0, 2).join(", "))}</strong></span>
      <button class="icon-button ${connected.has(person.id) ? "is-connected" : ""}" type="button" data-connect="${escapeHtml(person.id)}" aria-label="${connected.has(person.id) ? "Connected with" : "Connect with"} ${escapeHtml(person.name)}">${connected.has(person.id) ? "✓" : "↗"}</button></div></div>
    </article>`;
  }

  function renderMusicians() {
    const query = document.querySelector("#musician-search").value.trim().toLowerCase();
    const instrument = document.querySelector("#instrument-filter").value;
    const genre = document.querySelector("#genre-filter").value;
    const skill = document.querySelector("#skill-filter").value;
    const filtered = data.musicians.filter((person) => {
      const searchable = [person.name, person.instrument, person.location, person.bio, ...person.genres, ...person.artists, ...person.lookingFor].join(" ").toLowerCase();
      return (!query || searchable.includes(query)) &&
        (!instrument || person.instrument === instrument) &&
        (!genre || person.genres.includes(genre)) &&
        (!skill || person.skill === skill);
    });
    const hasSearchOrFilters = Boolean(query || instrument || genre || skill);
    const musicianPreviewLimit = 8;
    const visible = hasSearchOrFilters
      ? filtered
      : filtered.length <= musicianPreviewLimit
        ? filtered
        : Array.from({ length: musicianPreviewLimit }, (_, index) =>
            filtered[(musicianOffset + index) % filtered.length]);
    document.querySelector("#musician-list").innerHTML = visible.map(musicianCard).join("");
    document.querySelector("#musician-count").textContent = `${filtered.length} ${filtered.length === 1 ? "musician" : "musicians"}`;
    document.querySelector("#musician-empty").hidden = filtered.length !== 0;
    document.querySelector("#refresh-musicians").hidden = hasSearchOrFilters || filtered.length <= musicianPreviewLimit;
  }

  function fillFilters() {
    const instruments = [...new Set(data.musicians.map((person) => person.instrument))].sort();
    const genres = [...new Set(data.musicians.flatMap((person) => person.genres))].sort();
    document.querySelector("#instrument-filter").insertAdjacentHTML("beforeend", instruments.map((item) => `<option>${escapeHtml(item)}</option>`).join(""));
    document.querySelector("#genre-filter").insertAdjacentHTML("beforeend", genres.map((item) => `<option>${escapeHtml(item)}</option>`).join(""));
  }

  function renderCommunities() {
    const communities = communitiesExpanded ? data.communities : data.communities.slice(0, listPreviewLimit);
    document.querySelector("#community-list").innerHTML = communities.map((community) => `
      <article class="community-card ${escapeHtml(community.color)}">
        <div class="community-card-top"><span class="community-mark" aria-hidden="true">${escapeHtml(community.mark)}</span><span class="community-category">${escapeHtml(community.category)}</span></div>
        <h3>${escapeHtml(community.name)}</h3><p>${escapeHtml(community.description)}</p>
        <div class="community-card-bottom"><span>${community.members + (joined.has(community.id) ? 1 : 0)} members</span>
          <button class="join-button ${joined.has(community.id) ? "is-joined" : ""}" type="button" data-join="${escapeHtml(community.id)}">${joined.has(community.id) ? "Joined ✓" : "Join community ↗"}</button>
        </div>
      </article>`).join("");
  }

  function renderEvents() {
    const events = eventsExpanded ? data.events : data.events.slice(0, listPreviewLimit);
    document.querySelector("#event-list").innerHTML = events.map((event) => `
      <article class="event-item">
        <div class="event-date"><span>${escapeHtml(event.month)}</span><strong>${escapeHtml(event.day)}</strong></div>
        <div class="event-copy"><span class="event-tag">${escapeHtml(event.tag)}</span><h3>${escapeHtml(event.name)}</h3><p>${escapeHtml(event.venue)} <span>·</span> ${escapeHtml(event.detail)}</p></div>
        <button class="rsvp-button ${rsvps.has(event.id) ? "is-rsvped" : ""}" type="button" data-rsvp="${escapeHtml(event.id)}" aria-label="${rsvps.has(event.id) ? "Going to" : "RSVP to"} ${escapeHtml(event.name)}">${rsvps.has(event.id) ? "✓" : "+"}</button>
      </article>`).join("");
  }

  function renderIdeas() {
    document.querySelector("#idea-list").innerHTML = data.ideas.map((idea) => `
      <article class="idea-item">${initialsAvatar(idea.initials, idea.color, "idea-avatar")}<div><span class="idea-author">${escapeHtml(idea.author)} <span>· just now</span></span><p>${escapeHtml(idea.text)}</p></div></article>`).join("");
  }

  function updateExpansionControl(button, expanded, collapsedLabel) {
    button.setAttribute("aria-expanded", String(expanded));
    button.querySelector(".toggle-label").textContent = expanded ? "View less" : collapsedLabel;
    button.querySelector(".toggle-icon").textContent = expanded ? "↑" : "→";
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  document.querySelector("#musician-filters").addEventListener("submit", (event) => event.preventDefault());
  ["#musician-search", "#instrument-filter", "#genre-filter", "#skill-filter"].forEach((selector) => {
    document.querySelector(selector).addEventListener(selector === "#musician-search" ? "input" : "change", renderMusicians);
  });
  document.querySelector("#clear-filters").addEventListener("click", () => {
    document.querySelector("#musician-search").value = "";
    document.querySelector("#instrument-filter").value = "";
    document.querySelector("#genre-filter").value = "";
    document.querySelector("#skill-filter").value = "";
    renderMusicians();
  });
  document.querySelector("#refresh-musicians").addEventListener("click", () => {
    musicianOffset = (musicianOffset + 8) % data.musicians.length;
    renderMusicians();
  });
  document.querySelector("#refresh-matches").addEventListener("click", () => {
    matchOffset = (matchOffset + 3) % data.musicians.length;
    renderMatches();
  });
  document.querySelector("#toggle-communities").hidden = data.communities.length <= listPreviewLimit;
  document.querySelector("#toggle-communities").addEventListener("click", (event) => {
    communitiesExpanded = !communitiesExpanded;
    renderCommunities();
    updateExpansionControl(event.currentTarget, communitiesExpanded, "All communities");
  });
  document.querySelector("#toggle-events").hidden = data.events.length <= listPreviewLimit;
  document.querySelector("#toggle-events").addEventListener("click", (event) => {
    eventsExpanded = !eventsExpanded;
    renderEvents();
    updateExpansionControl(event.currentTarget, eventsExpanded, "All events");
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#profile-action") && currentAccount) {
      renderConnections();
      document.querySelector("#profile-connections").hidden = false;
      document.querySelector("#profile-connections").scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const connectButton = event.target.closest("[data-connect]");
    if (connectButton) {
      const id = connectButton.dataset.connect;
      const person = data.musicians.find((item) => item.id === id);
      if (connected.has(id)) connected.delete(id);
      else connected.add(id);
      const connectionsSaved = saveCurrentAccountConnections();
      renderMatches();
      renderMusicians();
      renderConnections();
      showToast(!connectionsSaved
        ? "This change could not be saved in browser storage."
        : connected.has(id)
          ? `You’re connected with ${person.name}!`
          : `Connection with ${person.name} removed.`);
      return;
    }

    const joinButton = event.target.closest("[data-join]");
    if (joinButton) {
      const id = joinButton.dataset.join;
      const community = data.communities.find((item) => item.id === id);
      if (joined.has(id)) joined.delete(id);
      else joined.add(id);
      renderCommunities();
      showToast(joined.has(id) ? `You joined ${community.name}.` : `You left ${community.name}.`);
      return;
    }

    const rsvpButton = event.target.closest("[data-rsvp]");
    if (rsvpButton) {
      const id = rsvpButton.dataset.rsvp;
      const eventInfo = data.events.find((item) => item.id === id);
      if (rsvps.has(id)) rsvps.delete(id);
      else rsvps.add(id);
      renderEvents();
      showToast(rsvps.has(id) ? `You're on the list for ${eventInfo.name}.` : `RSVP removed for ${eventInfo.name}.`);
    }
  });

  document.querySelector("#idea-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#idea-input");
    const text = input.value.trim();
    if (!text) return;
    data.ideas.unshift({ author: currentAccount?.name || "Guest musician", initials: currentAccount ? currentAccount.name[0].toUpperCase() : "G", color: "lilac", text });
    renderIdeas();
    input.value = "";
    showToast("Your idea is out there. Let the collaboration begin!");
  });

  fillFilters();
  renderMatches();
  renderMusicians();
  renderCommunities();
  renderEvents();
  renderIdeas();
  renderAccount();
})();
