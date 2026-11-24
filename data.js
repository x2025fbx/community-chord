// Fictional sample content for the Community Chord prototype.
window.COMMUNITY_CHORD_DATA = {
  currentUser: {
    name: "Jordan Lee",
    instruments: ["Guitar"],
    genres: ["Indie rock", "Dream pop", "Alternative"],
    skill: "Intermediate",
    lookingFor: ["Singer", "Drums", "Bass", "Songwriter"],
    artists: ["Alvvays", "Big Thief", "Slow Pulp"]
  },
  musicians: [
    { id: "maya-chen", name: "Maya Chen", instrument: "Vocals", genres: ["Indie rock", "Dream pop", "Shoegaze"], skill: "Advanced", location: "Portland, OR", artists: ["Japanese Breakfast", "Beach House"], lookingFor: ["Guitar", "Drums"], initials: "MC", color: "coral", bio: "Big harmonies, tiny venues, and songs that feel like a long drive home." },
    { id: "eli-rivera", name: "Eli Rivera", instrument: "Drums", genres: ["Indie rock", "Alternative", "Punk"], skill: "Intermediate", location: "Portland, OR", artists: ["IDLES", "The Strokes"], lookingFor: ["Vocals", "Guitar"], initials: "ER", color: "blue", bio: "Pocket-first drummer. Down for loud choruses and dependable practice nights." },
    { id: "nina-brooks", name: "Nina Brooks", instrument: "Bass", genres: ["Dream pop", "Indie rock", "R&B"], skill: "Advanced", location: "Portland, OR", artists: ["Men I Trust", "Crumb"], lookingFor: ["Vocals", "Guitar"], initials: "NB", color: "gold", bio: "Bass lines with a little bounce. Always carrying a notebook full of half-songs." },
    { id: "leo-martin", name: "Leo Martin", instrument: "Keys", genres: ["Jazz", "Soul", "Indie rock"], skill: "Intermediate", location: "Portland, OR", artists: ["Hiatus Kaiyote", "BADBADNOTGOOD"], lookingFor: ["Drums", "Vocals"], initials: "LM", color: "lilac", bio: "Keys player looking to bring a little color to a new project." },
    { id: "ava-williams", name: "Ava Williams", instrument: "Vocals", genres: ["Folk", "Indie rock", "Americana"], skill: "Beginner", location: "Beaverton, OR", artists: ["Mitski", "Adrianne Lenker"], lookingFor: ["Guitar", "Songwriter"], initials: "AW", color: "mint", bio: "Learning out loud. Hoping to find a patient co-writer and kind people." },
    { id: "sam-patel", name: "Sam Patel", instrument: "Guitar", genres: ["Alternative", "Punk", "Shoegaze"], skill: "Advanced", location: "Portland, OR", artists: ["DIIV", "Turnstile"], lookingFor: ["Bass", "Vocals"], initials: "SP", color: "orange", bio: "Pedalboard tinkerer. I like noisy guitars, good coffee, and sharing the aux." },
    { id: "theo-james", name: "Theo James", instrument: "Bass", genres: ["Funk", "Soul", "Jazz"], skill: "Intermediate", location: "Milwaukie, OR", artists: ["Vulfpeck", "Khruangbin"], lookingFor: ["Drums", "Keys"], initials: "TJ", color: "teal", bio: "Groove enthusiast looking for a tight rhythm section and low-stakes gigs." },
    { id: "robin-kim", name: "Robin Kim", instrument: "Drums", genres: ["Indie rock", "Dream pop", "Folk"], skill: "Beginner", location: "Portland, OR", artists: ["Big Thief", "The Japanese House"], lookingFor: ["Vocals", "Bass"], initials: "RK", color: "pink", bio: "New to the kit, not new to the feelings. Looking for a friendly first band." }
  ],
  communities: [
    { id: "pdx-indie", name: "PDX Indie Club", category: "INDIE ROCK · PORTLAND", members: 284, description: "For bedroom demos, basement shows, and the people who make them happen.", color: "community-purple", mark: "✳" },
    { id: "dream-pop", name: "Dream Pop Daydreamers", category: "DREAM POP · ONLINE + PDX", members: 176, description: "Soft focus, big reverb, and a community for making hazy things together.", color: "community-blue", mark: "☾" },
    { id: "song-circle", name: "The Song Circle", category: "SONGWRITING · PORTLAND", members: 132, description: "Trade a verse, find a co-writer, and get that half-finished song unstuck.", color: "community-orange", mark: "✎" }
  ],
  events: [
    { id: "porch-sessions", day: "29", month: "NOV", name: "Porchlight Sessions", venue: "The Get Down · Portland", detail: "Local artists · Doors at 7:30", tag: "LIVE MUSIC" },
    { id: "song-swap", day: "02", month: "DEC", name: "Sunday Song Swap", venue: "Rose City Book Pub · Portland", detail: "Bring one song, leave with three ideas.", tag: "COMMUNITY" },
    { id: "open-stage", day: "06", month: "DEC", name: "Open Stage: New Voices", venue: "Fixin’ To · Portland", detail: "A welcoming stage for works in progress.", tag: "OPEN MIC" }
  ],
  ideas: [
    { author: "Maya Chen", initials: "MC", color: "coral", text: "I have a chorus stuck in my head that needs a fuzzy guitar line. Anyone want to trade voice notes?" },
    { author: "Eli Rivera", initials: "ER", color: "blue", text: "Looking for someone to help turn a 90-second drum loop into a whole song. Lo-fi welcome." }
  ]
};
