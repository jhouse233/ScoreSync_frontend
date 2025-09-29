# The Project
A web app for writing, reviewing, and collaborating on music.

### Features
- Editor powered by VexFlow for notation (measures, clefs, time signatures)
- Comments sidebar: add/edit/delete notes tied to selected measures
- Measure badges on each measure 
- Realtime & persistence via Firebase Firestore (Anonymous auth by default)
- Dates-safe rendering


### Tools and Technologies
- HTML, CSS, JavaScript, React
- VexFlow (notation), Tonejs (planned playback), Nanoid
- Firebase 

### Future updates
- Auth UX: Add Google/Email login, attribute comments by user and restrict edits/deletes to the author
- Collaboration: Allow invited collaborators to leave notes
- Playback: Integrate Tone.js transport synced to measures
- More instruments and clefs; part scores
- Export/share: PDF/PNG export; shareable read-only links
