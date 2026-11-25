// Fictional sample content for the Community Chord prototype.
window.COMMUNITY_CHORD_DATA = {
  growth: {
    musicians: 12480,
    collaborations: 8420,
    communities: 1240,
    events: 3680
  },
  currentUser: {
    name: "Jordan Lee",
    instruments: ["Guitar"],
    genres: ["Indie rock", "Dream pop", "Alternative"],
    skill: "Intermediate",
    lookingFor: ["Singer", "Drums", "Bass", "Songwriter"],
    artists: ["Alvvays", "Big Thief", "Slow Pulp"]
  },
  musicians: [
    { id: "maya-chen", name: "Maya Chen", instrument: "Vocals", genres: ["Indie rock", "Dream pop", "Shoegaze"], skill: "Advanced", location: "North End, Halifax", artists: ["Japanese Breakfast", "Beach House"], lookingFor: ["Guitar", "Drums"], initials: "MC", color: "coral", bio: "Big harmonies, tiny venues, and songs that feel like a walk along the waterfront." },
    { id: "eli-rivera", name: "Eli Rivera", instrument: "Drums", genres: ["Indie rock", "Alternative", "Punk"], skill: "Intermediate", location: "Downtown Halifax", artists: ["IDLES", "The Strokes"], lookingFor: ["Vocals", "Guitar"], initials: "ER", color: "blue", bio: "Pocket-first drummer. Down for loud choruses and dependable practice nights." },
    { id: "nina-brooks", name: "Nina Brooks", instrument: "Bass", genres: ["Dream pop", "Indie rock", "R&B"], skill: "Advanced", location: "South End, Halifax", artists: ["Men I Trust", "Crumb"], lookingFor: ["Vocals", "Guitar"], initials: "NB", color: "gold", bio: "Bass lines with a little bounce. Always carrying a notebook full of half-songs." },
    { id: "leo-martin", name: "Leo Martin", instrument: "Keys", genres: ["Jazz", "Soul", "Indie rock"], skill: "Intermediate", location: "Downtown Dartmouth", artists: ["Hiatus Kaiyote", "BADBADNOTGOOD"], lookingFor: ["Drums", "Vocals"], initials: "LM", color: "lilac", bio: "Keys player looking to bring a little colour to a new project." },
    { id: "ava-williams", name: "Ava Williams", instrument: "Vocals", genres: ["Folk", "Indie rock", "Americana"], skill: "Beginner", location: "Bedford, NS", artists: ["Mitski", "Adrianne Lenker"], lookingFor: ["Guitar", "Songwriter"], initials: "AW", color: "mint", bio: "Learning out loud. Hoping to find a patient co-writer and kind people." },
    { id: "sam-patel", name: "Sam Patel", instrument: "Guitar", genres: ["Alternative", "Punk", "Shoegaze"], skill: "Advanced", location: "Clayton Park, Halifax", artists: ["DIIV", "Turnstile"], lookingFor: ["Bass", "Vocals"], initials: "SP", color: "orange", bio: "Pedalboard tinkerer. I like noisy guitars, good coffee, and sharing the aux." },
    { id: "theo-james", name: "Theo James", instrument: "Bass", genres: ["Funk", "Soul", "Jazz"], skill: "Intermediate", location: "Spryfield, Halifax", artists: ["Vulfpeck", "Khruangbin"], lookingFor: ["Drums", "Keys"], initials: "TJ", color: "teal", bio: "Groove enthusiast looking for a tight rhythm section and low-stakes gigs." },
    { id: "robin-kim", name: "Robin Kim", instrument: "Drums", genres: ["Indie rock", "Dream pop", "Folk"], skill: "Beginner", location: "Fairview, Halifax", artists: ["Big Thief", "The Japanese House"], lookingFor: ["Vocals", "Bass"], initials: "RK", color: "pink", bio: "New to the kit, not new to the feelings. Looking for a friendly first band." },
    { id: "jordan-baptiste", name: "Jordan Baptiste", instrument: "Guitar", genres: ["Hip-hop", "R&B", "Soul"], skill: "Advanced", location: "Downtown Halifax", artists: ["Kaytranada", "Frank Ocean"], lookingFor: ["Vocals", "Producer"], initials: "JB", color: "teal", bio: "Chill beats, soulful chords, and always looking for a strong verse." },
    { id: "tessa-macleod", name: "Tessa MacLeod", instrument: "Violin", genres: ["Folk", "Celtic", "Indie rock"], skill: "Intermediate", location: "Cole Harbour, NS", artists: ["The Paper Kites", "Crooked Still"], lookingFor: ["Guitar", "Vocals"], initials: "TM", color: "lilac", bio: "Fiddle player happy in either a kitchen session or a full-band rehearsal." },
    { id: "omar-hassan", name: "Omar Hassan", instrument: "Percussion", genres: ["World", "Soul", "Funk"], skill: "Advanced", location: "Spryfield, Halifax", artists: ["Burna Boy", "Tinariwen"], lookingFor: ["Drums", "Bass"], initials: "OH", color: "orange", bio: "Rhythm-first multi-percussionist open to high-energy collaborations." },
    { id: "chloe-singh", name: "Chloe Singh", instrument: "Saxophone", genres: ["Jazz", "Soul", "Funk"], skill: "Intermediate", location: "North End, Halifax", artists: ["Kamasi Washington", "Snarky Puppy"], lookingFor: ["Keys", "Drums"], initials: "CS", color: "coral", bio: "Looking for a tight groove, room to improvise, and Sunday jam sessions." },
    { id: "priya-nair", name: "Priya Nair", instrument: "Producer", genres: ["Electronic", "R&B", "Ambient"], skill: "Advanced", location: "Downtown Halifax", artists: ["Kelela", "James Blake"], lookingFor: ["Vocals", "Songwriter"], initials: "PN", color: "lilac", bio: "Building warm, spacious tracks and looking for voices to bring them to life." },
    { id: "lucas-murphy", name: "Lucas Murphy", instrument: "Guitar", genres: ["Folk", "Americana", "Indie rock"], skill: "Intermediate", location: "Dartmouth, NS", artists: ["Hozier", "The War on Drugs"], lookingFor: ["Vocals", "Bass"], initials: "LM", color: "mint", bio: "Fingerstyle guitar player up for acoustic sets, co-writing, and the occasional loud chorus." },
    { id: "imani-clarke", name: "Imani Clarke", instrument: "Vocals", genres: ["R&B", "Soul", "Jazz"], skill: "Advanced", location: "North End, Halifax", artists: ["Cleo Sol", "Sade"], lookingFor: ["Keys", "Producer"], initials: "IC", color: "pink", bio: "Singer with a soft spot for rich harmonies and relaxed late-night sessions." },
    { id: "ben-foster", name: "Ben Foster", instrument: "Drums", genres: ["Funk", "Indie rock", "Soul"], skill: "Intermediate", location: "Bedford, NS", artists: ["Anderson .Paak", "Khruangbin"], lookingFor: ["Bass", "Vocals"], initials: "BF", color: "blue", bio: "Steady pocket, easygoing rehearsals, and always happy to learn a new groove." },
    { id: "zoe-campbell", name: "Zoe Campbell", instrument: "Violin", genres: ["Celtic", "Folk", "Classical"], skill: "Advanced", location: "South End, Halifax", artists: ["The Gloaming", "Lankum"], lookingFor: ["Guitar", "Percussion"], initials: "ZC", color: "gold", bio: "Classically trained fiddler looking to mix traditional tunes with new arrangements." },
    { id: "marcus-reed", name: "Marcus Reed", instrument: "Bass", genres: ["Hip-hop", "Funk", "R&B"], skill: "Advanced", location: "Clayton Park, Halifax", artists: ["Thundercat", "D'Angelo"], lookingFor: ["Drums", "Producer"], initials: "MR", color: "teal", bio: "Bass player chasing deep pocket, inventive arrangements, and a dependable band." },
    { id: "ella-thompson", name: "Ella Thompson", instrument: "Songwriter", genres: ["Indie pop", "Folk", "Dream pop"], skill: "Intermediate", location: "Downtown Dartmouth", artists: ["Clairo", "Phoebe Bridgers"], lookingFor: ["Vocals", "Guitar"], initials: "ET", color: "coral", bio: "Collecting voice memos and half-finished choruses; looking for a co-writer." },
    { id: "noah-kim", name: "Noah Kim", instrument: "Keys", genres: ["Jazz", "Electronic", "Soul"], skill: "Advanced", location: "Downtown Halifax", artists: ["Floating Points", "BADBADNOTGOOD"], lookingFor: ["Saxophone", "Drums"], initials: "NK", color: "orange", bio: "Piano, synths, and odd little textures for jazz-adjacent projects." },
    { id: "fatima-yusuf", name: "Fatima Yusuf", instrument: "Percussion", genres: ["World", "Afrobeat", "Jazz"], skill: "Intermediate", location: "Fairview, Halifax", artists: ["Yussef Dayes", "Seun Kuti"], lookingFor: ["Bass", "Keys"], initials: "FY", color: "pink", bio: "Percussionist interested in building lively, collaborative rhythm sections." },
    { id: "owen-price", name: "Owen Price", instrument: "Guitar", genres: ["Punk", "Alternative", "Shoegaze"], skill: "Beginner", location: "Spryfield, Halifax", artists: ["Turnstile", "Slowdive"], lookingFor: ["Drums", "Bass"], initials: "OP", color: "blue", bio: "Newer guitarist with a big pedalboard and a soft spot for noisy indie bands." },
    { id: "sophie-leblanc", name: "Sophie LeBlanc", instrument: "Vocals", genres: ["Folk", "Celtic", "Americana"], skill: "Intermediate", location: "Cole Harbour, NS", artists: ["The Weather Station", "Martha Wainwright"], lookingFor: ["Fiddle", "Guitar"], initials: "SL", color: "gold", bio: "Singer-songwriter hoping to find a few people for warm, stripped-back arrangements." },
    { id: "gabriel-ross", name: "Gabriel Ross", instrument: "Trumpet", genres: ["Jazz", "Soul", "Funk"], skill: "Intermediate", location: "Downtown Halifax", artists: ["Roy Hargrove", "Robert Glasper"], lookingFor: ["Keys", "Bass"], initials: "GR", color: "orange", bio: "Trumpet player looking for a small group to explore jazz standards and new grooves." }
  ],
  communities: [
    { id: "hfx-indie", name: "Halifax Indie Collective", category: "INDIE ROCK · HALIFAX", members: 1284, description: "For bedroom demos, basement shows, and the people who make them happen.", color: "community-purple", mark: "✳" },
    { id: "dream-pop", name: "Dream Pop Daydreamers", category: "DREAM POP · ONLINE + HALIFAX", members: 1176, description: "Soft focus, big reverb, and a community for making hazy things together.", color: "community-blue", mark: "☾" },
    { id: "song-circle", name: "The Halifax Song Circle", category: "SONGWRITING · HRM", members: 1132, description: "Trade a verse, find a co-writer, and get that half-finished song unstuck.", color: "community-orange", mark: "✎" },
    { id: "celtic-jammers", name: "Celtic Kitchen Sessions", category: "FOLK · CELTIC · HRM", members: 1219, description: "For fiddle tunes, guitar players, and welcoming jam nights across Halifax.", color: "community-purple", mark: "♪" },
    { id: "jazz-after-dark", name: "Jazz After Dark", category: "JAZZ · SOUL · HALIFAX", members: 1158, description: "Meet improvisers, find a rhythm section, and plan late-night sessions.", color: "community-blue", mark: "♬" },
    { id: "beatmakers", name: "HRM Beatmakers", category: "BEATS · HIP-HOP · PRODUCER", members: 1246, description: "Share work-in-progress beats and connect with vocalists and visual artists.", color: "community-orange", mark: "◉" },
    { id: "acoustic-coastal", name: "Coastal Acoustic Circle", category: "ACOUSTIC · FOLK · HALIFAX", members: 1141, description: "Unplugged meetups for acoustic songwriters and laid-back performers.", color: "community-blue", mark: "≈" },
    { id: "punk-basement", name: "Halifax Basement Noise", category: "PUNK · SHOEGAZE · HRM", members: 1192, description: "Find bands, swap rehearsal spaces, and hear about DIY basement shows.", color: "community-purple", mark: "⚡" },
    { id: "classical-collabs", name: "Classical Crossovers", category: "CLASSICAL · AMBIENT · DARTMOUTH", members: 1116, description: "Classically trained musicians exploring modern, ambient, and cross-genre projects.", color: "community-orange", mark: "♩" },
    { id: "halifax-soul-club", name: "Halifax Soul Club", category: "SOUL · R&B · HALIFAX", members: 1203, description: "Vocalists, players, and listeners sharing deep cuts and finding a groove.", color: "community-blue", mark: "♡" },
    { id: "bedford-acoustic", name: "Bedford Acoustic Sessions", category: "ACOUSTIC · SONGWRITING · BEDFORD", members: 1097, description: "Low-key acoustic meetups for works in progress and new collaborations.", color: "community-orange", mark: "♫" },
    { id: "hrm-electronic", name: "HRM Electronic Producers", category: "ELECTRONIC · PRODUCERS · ONLINE", members: 1318, description: "Trade feedback, find vocal collaborators, and share new sounds in progress.", color: "community-purple", mark: "◉" },
    { id: "halifax-jazz-lab", name: "The Halifax Jazz Lab", category: "JAZZ · IMPROV · DARTMOUTH", members: 1164, description: "A welcoming spot for improvisers, small ensembles, and curious beginners.", color: "community-blue", mark: "♬" },
    { id: "indie-songwriters", name: "Atlantic Indie Songwriters", category: "INDIE · SONGWRITING · ATLANTIC CANADA", members: 1231, description: "Share demos, swap honest feedback, and find your next co-writer.", color: "community-purple", mark: "✎" }
  ],
  events: [
    { id: "porch-sessions", day: "29", month: "NOV", name: "Porchlight Sessions", venue: "The Lantern · Halifax", detail: "Local artists · Doors at 7:30", tag: "LIVE MUSIC" },
    { id: "song-swap", day: "02", month: "DEC", name: "Sunday Song Swap", venue: "North End Bookshop · Halifax", detail: "Bring one song, leave with three ideas.", tag: "COMMUNITY" },
    { id: "open-stage", day: "06", month: "DEC", name: "Open Stage: New Voices", venue: "Harbour House · Dartmouth", detail: "A welcoming stage for works in progress.", tag: "OPEN MIC" },
    { id: "bass-jam", day: "09", month: "DEC", name: "Funk & Soul Jam", venue: "Dartmouth Community Arts · Dartmouth", detail: "All instruments welcome · Starts at 8:00", tag: "JAM SESSION" },
    { id: "celtic-session", day: "13", month: "DEC", name: "Community Fiddle Session", venue: "The Bus Stop Theatre · Halifax", detail: "Bring an instrument or come listen.", tag: "FOLK" },
    { id: "beat-night", day: "17", month: "DEC", name: "Beat Exchange Night", venue: "Good Robot Brewing · Halifax", detail: "Headphones encouraged · Beat battles at 9:00", tag: "PRODUCER" },
    { id: "winter-song-circle", day: "20", month: "DEC", name: "Winter Song Circle", venue: "The Local · Halifax", detail: "Bring an original or a favorite · Starts at 6:30", tag: "SONGWRITING" },
    { id: "new-year-jam", day: "27", month: "DEC", name: "Year-End Open Jam", venue: "Dartmouth Community Arts · Dartmouth", detail: "All styles welcome · Doors at 7:00", tag: "JAM SESSION" },
    { id: "first-friday", day: "03", month: "JAN", name: "First Friday: Local Sounds", venue: "The Lantern · Halifax", detail: "Three local acts · Music starts at 8:00", tag: "LIVE MUSIC" },
    { id: "demo-listening", day: "10", month: "JAN", name: "Demo Listening Room", venue: "North End Bookshop · Halifax", detail: "Share a rough mix and get friendly feedback.", tag: "COMMUNITY" }
  ],
  ideas: [
    { author: "Maya Chen", initials: "MC", color: "coral", time: "12 min ago", text: "I have a chorus stuck in my head that needs a fuzzy guitar line. Anyone want to trade voice notes?" },
    { author: "Eli Rivera", initials: "ER", color: "blue", time: "18 min ago", text: "Looking for someone to help turn a 90-second drum loop into a whole song. Lo-fi welcome." },
    { author: "Nina Brooks", initials: "NB", color: "gold", time: "42 min ago", text: "Wrote a bass line that needs a soft, hazy guitar part. Anyone want to trade voice memos?" },
    { author: "Priya Nair", initials: "PN", color: "lilac", time: "1 hr ago", text: "I have a half-finished ambient beat looking for a vocalist who likes space and slow builds." },
    { author: "Tessa MacLeod", initials: "TM", color: "lilac", time: "2 hr ago", text: "Anyone up for trying a fiddle tune over a lo-fi drum pattern? Could be fun." },
    { author: "Jordan Baptiste", initials: "JB", color: "teal", time: "3 hr ago", text: "Looking for a singer to add a hook to a mellow, soul-inspired demo." },
    { author: "Ella Thompson", initials: "ET", color: "coral", time: "5 hr ago", text: "I have a chorus but no second verse. Happy to co-write over coffee this week." },
    { author: "Noah Kim", initials: "NK", color: "orange", time: "Yesterday", text: "Putting together a small keys-and-sax session. Any improvisers around Dartmouth?" },
    { author: "Sophie LeBlanc", initials: "SL", color: "gold", time: "Yesterday", text: "Would love to find a guitarist for a few stripped-back folk songs at an open mic." }
  ]
};
