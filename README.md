# Escuela de Español UDLA demo

Complete static source for the updated Miltu Studios learning-platform demonstration. This export matches the latest published demo (version 2, source commit `0dba1504cd39c29fc23eb901bbcad58df291eec2`).

The site runs independently of ChatGPT Sites. It needs no build step, package installation, API keys, login service, or backend. HTML, CSS, course data, icons, the favicon, and all application code are included.

## Deploy to GitHub Pages

1. Extract the ZIP on your computer.
2. Create or open the GitHub repository you want to use. For a free GitHub Pages deployment, use a public repository.
3. Upload the **extracted files**, including `index.html`, to the repository's top level on the `main` branch. Do not upload only the ZIP or put the files inside another folder. Include `.nojekyll`; your file manager may hide it. If necessary, create an empty `.nojekyll` file directly in the repository.
4. In **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, and click **Save**.
5. Open the URL GitHub shows after deployment completes. A project repository normally uses `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. No code changes are needed for the repository name.

Official instructions: [Configure a GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Included files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, Spanish labels, dialogs, embedded favicon, and relative stylesheet/script references. |
| `styles.css` | Complete responsive layout and visual styles; uses system fonts. |
| `content.js` | Original A2/B1 course content and proposals for further levels. |
| `academic.js` | Illustrative learner data and additional academic activities. |
| `app.js` | Student and teacher views, quizzes, progress, assignments, writing reviews, listening playback, oral practice, and timed DELE samples. Includes inline SVG icons. |
| `.nojekyll` | Tells GitHub Pages to serve the static files directly. |
| `README.md` | These deployment and usage instructions. |

All required assets are embedded or included. There are no remote fonts, images, CDN scripts, or audio-file downloads. The UDLA and Instituto Cervantes links are informational references, not application dependencies. The optional browser `navigator.modelContext` integration is feature-detected; normal browsers work without it.

## Local use

For a reliable local test, open a terminal in the extracted folder and run:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. On Windows, use `py -m http.server 8000` if `python` is not available. Stop the server with Ctrl+C. A server is preferable to opening `index.html` directly because browser storage and microphone permissions work differently for local files.

## Demo behavior

- The interface is in Spanish. Use **Estudiante** and **Docente** to switch experiences.
- A2 and B1 contain working activities. B2, C1 and C2 are conceptual outlines awaiting academic review.
- Student profiles and starting results are fictional. Progress, drafts, assignments and teacher feedback are stored in that browser's `localStorage`; they are not shared between devices or different visitors. Data from the existing ChatGPT Site is not transferred automatically to the GitHub Pages origin.
- Listening uses the browser's speech synthesis and an available Spanish voice. There are no prerecorded audio files. Availability and voice quality depend on the browser and device; a transcript is provided.
- Speaking recording uses the browser microphone and requires permission and a supported browser. GitHub Pages provides an HTTPS origin. Recordings are temporary browser-session objects, not uploaded or retained as files after a reload. A practice-without-recording option is available.
- The writing guide is a checklist, and teacher feedback is entered in the demo; it is not an AI assessment service.
- The timed DELE activities are original short samples, not complete official exams.
- Use **Sobre la propuesta → Reiniciar datos de demostración** to restore the initial sample data.

## Asset paths and routing

The page loads `styles.css`, `content.js`, `academic.js` and `app.js` using relative paths. Keep them next to `index.html` and preserve the script order in that file. Navigation uses URL fragments such as `#inicio` and `#estudiantes`, so GitHub Pages does not need route rewrites or a custom `404.html`. The export excludes hosting manifests, repository metadata, credentials, and generated runtime state.
