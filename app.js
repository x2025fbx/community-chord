(() => {
  const data = window.COMMUNITY_CHORD_DATA;
  const connected = new Set();
  const joined = new Set();
  const rsvps = new Set();
  const listPreviewLimit = 4;
  const workingOnPreviewLimit = 5;
  const musicianPreviewLimit = 12;
  let matchOffset = 0;
  let musiciansExpanded = false;
  let communitiesExpanded = false;
  let eventsExpanded = false;
  let activeChatId = null;
  const chatMessages = new Map();

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const formatCount = (value) => new Intl.NumberFormat("en-US").format(value);

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function displayList(value) {
    return value.split(",").map((item) => item.trim()).filter(Boolean).join(" · ");
  }

  function initialsAvatar(initials, color, extraClass = "") {
    return `<span class="avatar avatar-${escapeHtml(color)} ${extraClass}" aria-hidden="true">${escapeHtml(initials)}</span>`;
  }

  function matchScore(musician) {
    const currentProfile = data.currentUser;
    const sharedGenres = musician.genres.filter((genre) => currentProfile.genres.includes(genre)).length;
    const complementary = currentProfile.lookingFor.some((role) => {
      const wanted = role.toLowerCase();
      const instrument = musician.instrument.toLowerCase();
      return wanted === instrument || (wanted === "singer" && instrument === "vocals");
    }) ? 2 : 0;
    return sharedGenres + complementary;
  }

  function renderMatches() {
    const ranked = data.musicians
      .filter((person) => true)
      .sort((a, b) => matchScore(b) - matchScore(a) || a.name.localeCompare(b.name));
    const picks = Array.from({ length: 6 }, (_, index) => ranked[(index + matchOffset) % ranked.length]);
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
      <div class="musician-footer"><button class="view-profile-button" type="button" data-view-profile="${escapeHtml(person.id)}">View profile</button><span>Looking for <strong>${escapeHtml(person.lookingFor.slice(0, 2).join(", "))}</strong></span>
      <button class="icon-button ${connected.has(person.id) ? "is-connected" : ""}" type="button" data-connect="${escapeHtml(person.id)}" aria-label="${connected.has(person.id) ? "Connected with" : "Connect with"} ${escapeHtml(person.name)}">${connected.has(person.id) ? "✓" : "↗"}</button></div></div>
    </article>`;
  }

  function renderMusicianProfile(id) {
    const person = data.musicians.find((musician) => musician.id === id);
    if (!person) return;
    document.querySelector("#musician-dialog").innerHTML = `
      <div class="account-dialog-heading">
        <div><p class="eyebrow">MUSICIAN PROFILE</p><h2 id="musician-dialog-title">${escapeHtml(person.name)}</h2></div>
        <button class="account-close" type="button" aria-label="Close musician profile" data-musician-close>×</button>
      </div>
      <p class="account-dialog-description">${escapeHtml(person.instrument)} · ${escapeHtml(person.location)} · ${escapeHtml(person.skill)}</p>
      <p>${escapeHtml(person.bio)}</p>
      <div class="profile-view-details">
        <p><strong>Genres</strong><br>${escapeHtml(person.genres.join(" · "))}</p>
        <p><strong>Favorite artists</strong><br>${escapeHtml(person.artists.join(" · "))}</p>
        <p><strong>Looking to meet</strong><br>${escapeHtml(person.lookingFor.join(" · "))}</p>
      </div>
      <button class="button ${connected.has(person.id) ? "button-connected" : "button-primary"} profile-connect-button" type="button" data-connect="${escapeHtml(person.id)}">${connected.has(person.id) ? "Connected ✓" : "Connect with " + escapeHtml(person.name)}</button>`;
    document.querySelector("#musician-dialog").showModal();
  }

  document.querySelector("#musician-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget || event.target.closest("[data-musician-close]")) {
      event.currentTarget.close();
    }
  });

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
    const visible = hasSearchOrFilters || musiciansExpanded
      ? filtered
      : filtered.slice(0, musicianPreviewLimit);
    document.querySelector("#musician-list").innerHTML = visible.map(musicianCard).join("");
    document.querySelector("#musician-count").textContent = `${filtered.length} ${filtered.length === 1 ? "musician" : "musicians"}`;
    document.querySelector("#musician-empty").hidden = filtered.length !== 0;
    document.querySelector("#refresh-musicians").hidden = hasSearchOrFilters || filtered.length <= musicianPreviewLimit;
    updateExpansionControl(document.querySelector("#refresh-musicians"), musiciansExpanded, "All musicians");
  }

  function fillFilters() {
    const instruments = [...new Set(data.musicians.map((person) => person.instrument))].sort();
    const genres = [...new Set(data.musicians.flatMap((person) => person.genres))].sort();
    const instrumentFilter = document.querySelector("#instrument-filter");
    const genreFilter = document.querySelector("#genre-filter");
    const selectedInstrument = instrumentFilter.value;
    const selectedGenre = genreFilter.value;
    instrumentFilter.innerHTML = '<option value="">All instruments</option>' + instruments.map((item) => `<option>${escapeHtml(item)}</option>`).join("");
    genreFilter.innerHTML = '<option value="">All genres</option>' + genres.map((item) => `<option>${escapeHtml(item)}</option>`).join("");
    instrumentFilter.value = selectedInstrument;
    genreFilter.value = selectedGenre;
  }

  function renderCommunities() {
    const communities = communitiesExpanded ? data.communities : data.communities.slice(0, listPreviewLimit);
    document.querySelector("#community-list").innerHTML = communities.map((community) => `
      <article class="community-card ${escapeHtml(community.color)}">
        <div class="community-card-top"><span class="community-mark" aria-hidden="true">${escapeHtml(community.mark)}</span><span class="community-category">${escapeHtml(community.category)}</span></div>
        <h3>${escapeHtml(community.name)}</h3><p>${escapeHtml(community.description)}</p>
        <div class="community-card-bottom"><span>${formatCount(community.members + (joined.has(community.id) ? 1 : 0))} members</span>
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
    document.querySelector("#idea-list").innerHTML = data.ideas.slice(0, workingOnPreviewLimit).map((idea) => `
      <article class="idea-item">${initialsAvatar(idea.initials, idea.color, "idea-avatar")}<div><span class="idea-author">${escapeHtml(idea.author)} <span>· ${escapeHtml(idea.time || "just now")}</span></span><p>${escapeHtml(idea.text)}</p></div></article>`).join("");
  }

  function renderChats() {
    const connectedPeople = data.musicians.filter((person) => connected.has(person.id));
    const chatList = document.querySelector("#chat-list");
    const chatWindow = document.querySelector("#chat-window");

    if (!connectedPeople.length) {
      chatList.innerHTML = '<p class="chat-empty">No conversations yet.</p>';
      chatWindow.innerHTML = '<p class="chat-empty">Connect with a musician to start a chat.</p>';
      activeChatId = null;
      return;
    }

    if (!activeChatId || !connected.has(activeChatId)) activeChatId = connectedPeople[0].id;
    chatList.innerHTML = connectedPeople.map((person) => `
      <button class="chat-person ${activeChatId === person.id ? "is-active" : ""}" type="button" data-open-chat="${escapeHtml(person.id)}">
        ${initialsAvatar(person.initials, person.color)}
        <span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.instrument)} · ${escapeHtml(person.location)}</small></span>
      </button>
    `).join("");

    const person = connectedPeople.find((item) => item.id === activeChatId);
    const messages = chatMessages.get(person.id) || [];
    chatWindow.innerHTML = `
      <div class="chat-header">${initialsAvatar(person.initials, person.color)}<div><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.instrument)} · ${escapeHtml(person.location)}</small></div></div>
      <div class="chat-messages" id="chat-messages" aria-live="polite">
        ${messages.length ? messages.map((message) => `<p class="chat-message ${message.sent ? "is-sent" : ""}">${escapeHtml(message.text)}</p>`).join("") : '<p class="chat-empty">Say hello to start the conversation.</p>'}
      </div>
      <form class="chat-form" id="chat-form">
        <label class="sr-only" for="chat-input">Message ${escapeHtml(person.name)}</label>
        <input id="chat-input" type="text" maxlength="240" placeholder="Write a message..." required>
        <button class="button button-primary" type="submit">Send</button>
      </form>
    `;
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
    musiciansExpanded = !musiciansExpanded;
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
    const openChatButton = event.target.closest("[data-open-chat]");
    if (openChatButton) {
      activeChatId = openChatButton.dataset.openChat;
      renderChats();
      document.querySelector("#chats").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const viewProfileButton = event.target.closest("[data-view-profile]");
    if (viewProfileButton) {
      renderMusicianProfile(viewProfileButton.dataset.viewProfile);
      return;
    }

    const connectButton = event.target.closest("[data-connect]");
    if (connectButton) {
      const id = connectButton.dataset.connect;
      const person = data.musicians.find((item) => item.id === id);
      if (!person) return;
      if (connected.has(id)) connected.delete(id);
      else connected.add(id);
      const profileConnectButton = document.querySelector(`#musician-dialog [data-connect="${id}"]`);
      if (profileConnectButton) {
        profileConnectButton.classList.toggle("button-connected", connected.has(id));
        profileConnectButton.classList.toggle("button-primary", !connected.has(id));
        profileConnectButton.textContent = connected.has(id) ? "Connected ✓" : `Connect with ${person.name}`;
      }
      if (connected.has(id)) activeChatId = id;
      else if (activeChatId === id) activeChatId = null;
      renderMatches();
      renderMusicians();
      renderChats();
      showToast(connected.has(id)
        ? `You’re connected with ${person.name}! Opened in Chats.`
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
    data.ideas.unshift({ author: "Community member", initials: "C", color: "lilac", time: "just now", text });
    renderIdeas();
    input.value = "";
    showToast("Your idea is out there. Let the collaboration begin!");
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "chat-form") return;
    event.preventDefault();
    if (!activeChatId) return;
    const input = event.target.querySelector("#chat-input");
    const text = input.value.trim();
    if (!text) return;
    const messages = chatMessages.get(activeChatId) || [];
    messages.push({ text, sent: true });
    chatMessages.set(activeChatId, messages);
    renderChats();
  });

  fillFilters();
  renderMatches();
  renderMusicians();
  renderCommunities();
  renderEvents();
  renderIdeas();
})();
