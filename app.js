(() => {
  const data = window.COMMUNITY_CHORD_DATA;
  const connected = new Set();
  const joined = new Set();
  const rsvps = new Set();
  let matchOffset = 0;

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
    document.querySelector("#musician-list").innerHTML = filtered.map(musicianCard).join("");
    document.querySelector("#musician-count").textContent = `${filtered.length} ${filtered.length === 1 ? "musician" : "musicians"}`;
    document.querySelector("#musician-empty").hidden = filtered.length !== 0;
  }

  function fillFilters() {
    const instruments = [...new Set(data.musicians.map((person) => person.instrument))].sort();
    const genres = [...new Set(data.musicians.flatMap((person) => person.genres))].sort();
    document.querySelector("#instrument-filter").insertAdjacentHTML("beforeend", instruments.map((item) => `<option>${escapeHtml(item)}</option>`).join(""));
    document.querySelector("#genre-filter").insertAdjacentHTML("beforeend", genres.map((item) => `<option>${escapeHtml(item)}</option>`).join(""));
  }

  function renderCommunities() {
    document.querySelector("#community-list").innerHTML = data.communities.map((community) => `
      <article class="community-card ${escapeHtml(community.color)}">
        <div class="community-card-top"><span class="community-mark" aria-hidden="true">${escapeHtml(community.mark)}</span><span class="community-category">${escapeHtml(community.category)}</span></div>
        <h3>${escapeHtml(community.name)}</h3><p>${escapeHtml(community.description)}</p>
        <div class="community-card-bottom"><span>${community.members + (joined.has(community.id) ? 1 : 0)} members</span>
          <button class="join-button ${joined.has(community.id) ? "is-joined" : ""}" type="button" data-join="${escapeHtml(community.id)}">${joined.has(community.id) ? "Joined ✓" : "Join community ↗"}</button>
        </div>
      </article>`).join("");
  }

  function renderEvents() {
    document.querySelector("#event-list").innerHTML = data.events.map((event) => `
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
  document.querySelector("#refresh-matches").addEventListener("click", () => {
    matchOffset = (matchOffset + 3) % data.musicians.length;
    renderMatches();
  });

  document.addEventListener("click", (event) => {
    const connectButton = event.target.closest("[data-connect]");
    if (connectButton) {
      const id = connectButton.dataset.connect;
      const person = data.musicians.find((item) => item.id === id);
      if (connected.has(id)) connected.delete(id);
      else connected.add(id);
      renderMatches();
      renderMusicians();
      showToast(connected.has(id) ? `You’re connected with ${person.name}!` : `Connection with ${person.name} removed.`);
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
    data.ideas.unshift({ author: "Jordan Lee", initials: "J", color: "lilac", text });
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
})();
