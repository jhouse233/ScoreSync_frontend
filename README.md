# The Project
A web app for writing, reviewing, and collaborating on music.

### DEMO
https://scoresync-app.netlify.app

### Features
- Music Editor powered by VexFlow for notation (measures, clefs, time signatures)
- Comments sidebar: add/edit/delete notes tied to selected measures
- Measure badges: Quick visual markers for measures with feedback
- Realtime & persistence via Firebase Firestore (Anonymous auth by default)
- Dates-safe rendering: Keep note and comment timestamps consistent


### Tools and Technologies
- Frontend: HTML, CSS, JavaScript, React
- Libraries: VexFlow (notation), Tonejs (planned playback), Nanoid
- Backend: Firebase 

### Future updates
- Auth UX: Add Google/Email login, attribute comments by user and restrict edits/deletes to the author
- Collaboration: Allow invited collaborators to leave notes
- Playback: Integrate Tone.js transport synced to measures
- More instruments and clefs; part scores
- Export/share: PDF/PNG export; shareable read-only links

### Author
- Jeremy House
- Builts as part of TripleTen's Software Engineering Program - blending a background in music
composition with full-stack web development
