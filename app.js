(() => {
  const data = window.COMMUNITY_CHORD_DATA;
  const connected = new Set();
  const joined = new Set();
  const rsvps = new Set();
  const listPreviewLimit = 2;
  let demoProfile = null;
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

  function showAccountDialog(mode) {
    if (mode === "login") {
      document.querySelector("#account-dialog").showModal();
      return;
    }

    const form = document.querySelector("#demo-profile-form");
    if (demoProfile) {
      form.elements.name.value = demoProfile.name;
      form.elements.location.value = demoProfile.location;
      form.elements.instrument.value = demoProfile.instrument;
      form.elements.genres.value = demoProfile.genres.join(", ");
      form.elements.skill.value = demoProfile.skill;
      form.elements.role.value = demoProfile.roles[0];
      form.elements.lookingFor.value = demoProfile.lookingFor.join(", ");
      form.elements.artists.value = demoProfile.artists.join(", ");
      form.elements.bio.value = demoProfile.bio;
    } else {
      form.reset();
    }
    document.querySelector("#demo-profile-title").textContent = demoProfile ? "Edit your demo profile" : "Create a demo profile";
    form.querySelector('[type="submit"]').firstChild.textContent = demoProfile ? "Update my demo profile " : "Add my demo profile ";
    document.querySelector("#demo-profile-dialog").showModal();
  }

  function displayList(value) {
    return value.split(",").map((item) => item.trim()).filter(Boolean).join(" · ");
  }

  function renderConnections() {
    const panel = document.querySelector("#profile-connections");
    const list = document.querySelector("#connections-list");
    const eventsList = document.querySelector("#signed-up-events-list");
    const communitiesList = document.querySelector("#joined-communities-list");
    if (!demoProfile) {
      panel.hidden = true;
      list.innerHTML = "";
      eventsList.innerHTML = "";
      communitiesList.innerHTML = "";
      return;
    }
    panel.hidden = false;
    const connections = data.musicians.filter((person) => connected.has(person.id));
    const signedUpEvents = data.events.filter((item) => rsvps.has(item.id));
    const joinedCommunities = data.communities.filter((item) => joined.has(item.id));
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
      : '<p class="connections-empty">No connected bandmates yet.</p>';
    eventsList.innerHTML = signedUpEvents.length
      ? signedUpEvents.map((item) => `
        <article class="connection-card">
          <div class="connection-card-copy">
            <h4>${escapeHtml(item.name)}</h4>
            <p>${escapeHtml(item.day)} ${escapeHtml(item.month)} · ${escapeHtml(item.venue)}</p>
          </div>
        </article>
      `).join("")
      : '<p class="connections-empty">No event sign-ups yet.</p>';
    communitiesList.innerHTML = joinedCommunities.length
      ? joinedCommunities.map((item) => `
        <article class="connection-card">
          <div class="connection-card-copy">
            <h4>${escapeHtml(item.name)}</h4>
            <p>${escapeHtml(item.category)}</p>
          </div>
        </article>
      `).join("")
      : '<p class="connections-empty">No communities joined yet.</p>';
  }

  function renderDemoProfile() {
    const name = demoProfile?.name || "Guest musician";
    const initials = demoProfile
      ? demoProfile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
      : "G";
    document.querySelector(".header-profile .avatar").textContent = initials;
    document.querySelector(".header-name").textContent = demoProfile?.name || "Guest";
    document.querySelector(".header-profile").setAttribute("aria-label", `View ${demoProfile ? `${name}'s demo` : "guest"} profile`);
    document.querySelector("#profile-avatar").textContent = initials;
    document.querySelector("#profile-title").textContent = name;
    document.querySelector("#profile-location").textContent = demoProfile
      ? `${demoProfile.location || "Community musician"} · Demo profile, not saved`
      : "Create a demo profile to introduce your sound";
    document.querySelector("#profile-instruments").textContent = demoProfile
      ? demoProfile.instrument
      : "Add your instruments to your demo profile";
    document.querySelector("#profile-music").textContent = demoProfile
      ? displayList(demoProfile.genres.join(", "))
      : "Add your favorite genres to your demo profile";
    document.querySelector("#profile-artists").textContent = demoProfile
      ? displayList(demoProfile.artists.join(", ")) || "Add your favorite artists"
      : "Add your favorite artists to your demo profile";
    document.querySelector("#profile-roles").textContent = demoProfile
      ? demoProfile.roles.join(" · ")
      : "Musician, singer, songwriter, or music lover";
    const profileAction = document.querySelector("#profile-action");
    profileAction.textContent = demoProfile ? "Edit demo profile" : "Create a demo profile";
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
  document.querySelectorAll("[data-demo-profile-close]").forEach((button) => {
    button.addEventListener("click", () => document.querySelector("#demo-profile-dialog").close());
  });
  document.querySelector("#demo-profile-dialog").addEventListener("click", (event) => {
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
    const currentProfile = demoProfile
      ? { genres: demoProfile.genres, lookingFor: demoProfile.lookingFor, instruments: [demoProfile.instrument] }
      : data.currentUser;
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
      .filter((person) => person.id !== demoProfile?.id)
      .sort((a, b) => matchScore(b) - matchScore(a) || a.name.localeCompare(b.name));
    const picks = Array.from({ length: 3 }, (_, index) => ranked[(index + matchOffset) % ranked.length]);
    document.querySelector("#match-list").innerHTML = picks.map((person, index) => `
      <article class="match-card">
        <div class="match-card-top"><span class="match-number">0${index + 1}</span><span class="match-score">✦ ${Math.min(99, 78 + matchScore(person) * 5)}% your sound</span></div>
        <div class="match-person">
          ${initialsAvatar(person.initials, person.color, "match-avatar")}
          <div><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(person.instrument)} <span>·</span> ${escapeHtml(person.location)}</p></div>
        </div>
        <p class="match-reason">${escapeHtml(person.instrument)} + ${escapeHtml(demoProfile?.instrument || data.currentUser.instruments[0])} could be a good sound. Into ${escapeHtml(person.genres.slice(0, 2).join(" and "))}.</p>
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

  document.querySelector("#demo-profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const splitList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
    const name = form.elements.name.value.trim();
    const instrument = form.elements.instrument.value.trim();
    const genres = splitList(form.elements.genres.value);
    if (!name || !instrument) {
      showToast("Add your name and an instrument or music role.");
      form.elements[!name ? "name" : "instrument"].focus();
      return;
    }
    if (!genres.length) {
      showToast("Add at least one genre to your demo profile.");
      form.elements.genres.focus();
      return;
    }

    demoProfile = {
      id: "demo-profile",
      name,
      location: form.elements.location.value.trim(),
      instrument,
      genres,
      skill: form.elements.skill.value,
      roles: [form.elements.role.value],
      lookingFor: splitList(form.elements.lookingFor.value),
      artists: splitList(form.elements.artists.value),
      bio: form.elements.bio.value.trim() || "Open to meeting local musicians and making something together.",
      initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      color: "lilac"
    };
    const existingIndex = data.musicians.findIndex((person) => person.id === demoProfile.id);
    if (existingIndex === -1) data.musicians.push(demoProfile);
    else data.musicians[existingIndex] = demoProfile;

    document.querySelector("#demo-profile-dialog").close();
    fillFilters();
    renderDemoProfile();
    renderMatches();
    renderMusicians();
    renderGrowthStats();
    showToast(existingIndex === -1 ? "Your demo profile is in the community!" : "Your demo profile has been updated.");
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
    const instrumentFilter = document.querySelector("#instrument-filter");
    const genreFilter = document.querySelector("#genre-filter");
    const selectedInstrument = instrumentFilter.value;
    const selectedGenre = genreFilter.value;
    instrumentFilter.innerHTML = '<option value="">All instruments</option>' + instruments.map((item) => `<option>${escapeHtml(item)}</option>`).join("");
    genreFilter.innerHTML = '<option value="">All genres</option>' + genres.map((item) => `<option>${escapeHtml(item)}</option>`).join("");
    instrumentFilter.value = selectedInstrument;
    genreFilter.value = selectedGenre;
  }

  function renderGrowthStats() {
    document.querySelector("#growth-musicians").textContent = data.musicians.length;
    document.querySelector("#growth-collaborations").textContent = data.growth.collaborations;
    document.querySelector("#growth-communities").textContent = data.communities.length;
    document.querySelector("#growth-events").textContent = data.events.length;
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
    const viewProfileButton = event.target.closest("[data-view-profile]");
    if (viewProfileButton) {
      renderMusicianProfile(viewProfileButton.dataset.viewProfile);
      return;
    }

    const connectButton = event.target.closest("[data-connect]");
    if (connectButton) {
      const id = connectButton.dataset.connect;
      const person = data.musicians.find((item) => item.id === id);
      if (!person || id === demoProfile?.id) return;
      if (connected.has(id)) connected.delete(id);
      else connected.add(id);
      const profileConnectButton = document.querySelector(`#musician-dialog [data-connect="${id}"]`);
      if (profileConnectButton) {
        profileConnectButton.classList.toggle("button-connected", connected.has(id));
        profileConnectButton.classList.toggle("button-primary", !connected.has(id));
        profileConnectButton.textContent = connected.has(id) ? "Connected ✓" : `Connect with ${person.name}`;
      }
      renderMatches();
      renderMusicians();
      renderConnections();
      showToast(connected.has(id)
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
      renderConnections();
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
      renderConnections();
      showToast(rsvps.has(id) ? `You're on the list for ${eventInfo.name}.` : `RSVP removed for ${eventInfo.name}.`);
    }
  });

  document.querySelector("#idea-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#idea-input");
    const text = input.value.trim();
    if (!text) return;
    data.ideas.unshift({ author: demoProfile?.name || "Guest musician", initials: demoProfile?.initials || "G", color: "lilac", text });
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
  renderGrowthStats();
  renderDemoProfile();
})();
