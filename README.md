# Community Chord

Community Chord helps musicians discover bandmates, join genre communities, find local events, and share collaboration ideas.

## Live website

Explore the prototype at **[x2025fbx.github.io/community-chord](https://x2025fbx.github.io/community-chord/)**.

## Features

- Discover musicians with search and instrument, genre, and skill filters.
- Browse suggested musician matches and connect with people.
- Join music communities, RSVP to events, and share collaboration ideas.
- Expand the communities and events previews to see all available listings, then collapse them with “View less.”
- View the $5/month membership and its demo purchase area; no real payments are processed.
- Sign up with an email and password, then add your instruments, favorite music, and artists.
- Log in with your email and password.
- Log out to return to the guest profile and show the sign-up and login buttons again.
- Use a responsive interface designed for desktop and mobile screens.

## Run locally

Open `index.html` in a modern browser. No build step, server, database, framework, or installation is required.

## Project files

- `index.html` contains the page structure and content sections.
- `styles.css` contains the responsive visual design.
- `data.js` contains fictional sample profiles, communities, events, and starter ideas.
- `app.js` implements search, filters, matches, connections, community joins, event RSVPs, and idea sharing.

This is a front-end prototype. Account details are stored in the browser and are available only in that browser; passwords are salted and hashed, but this is not secure production authentication. Signing up also logs you in. Your login session lasts until you log out or close the browser tab; other interactions reset when the page is reloaded. There is no backend.
