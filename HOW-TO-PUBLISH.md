# How to publish & update this website

This site is **static** (just HTML/CSS/JS files), so hosting is free and simple.
Two options below — the quick one, and the recommended one for easy updates.

---

## Option 1 — Netlify Drop (quickest, ~1 minute)

Best if you just want it online fast.

1. Go to **https://app.netlify.com/drop**
2. Drag your whole **Catholic Website** folder onto the page.
3. You instantly get a live link like `https://your-name.netlify.app`.
4. (Optional) Make a free Netlify account to keep the site and rename it.

**To update later:** change your files, then drag the folder onto Netlify again.
Downside: no history/backup, and you re-upload every time.

---

## Option 2 — GitHub + GitHub Pages (recommended for ongoing updates)

A little setup once, then updating is: **edit → commit → push → site updates itself.**
You also get version history and a cloud backup.

### One-time setup

1. **Make a free GitHub account:** https://github.com/signup
2. **Create a new repository:** click the **+** (top right) → **New repository**.
   - Name it something like `catholic-faith`.
   - Set it to **Public**.
   - Don't add a README (you already have files).
   - Click **Create repository**.
3. **Put your files on GitHub.** In VS Code, open a terminal in this folder
   (Terminal → New Terminal) and run these one at a time:

   ```bash
   git init
   git add .
   git commit -m "First version of the site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/catholic-faith.git
   git push -u origin main
   ```

   (Replace `YOUR-USERNAME` with your GitHub username. GitHub may ask you to
   sign in the first time.)

4. **Turn on free hosting.** On GitHub, go to your repository →
   **Settings** → **Pages** (left sidebar) → under **Branch** choose **main**
   and **/ (root)** → **Save**.
5. Wait ~1 minute. Your site is live at:
   `https://YOUR-USERNAME.github.io/catholic-faith/`

### Updating after a change (the everyday loop)

Whenever you edit a file (add a saint, a verse, a page…):

```bash
git add .
git commit -m "Describe what you changed"
git push
```

That's it — the live site updates on its own within a minute.

> In VS Code you can also do this with clicks: the **Source Control** panel
> (the branch icon on the left) lets you type a message and hit **Commit**,
> then **Sync/Push** — no typing commands needed.

---

## Later: your own domain name (optional)

Both Netlify and GitHub Pages let you connect a custom address like
`catholicfaith.org` (you'd buy the domain ~$10–15/year from a registrar like
Namecheap or Cloudflare, then point it at your host). Ask me when you're ready
and I'll walk you through it.

---

## Notes for this site

- No build step is needed — the files run as-is.
- Keep all files together (the `.html`, `style.css`, `script.js`) — they link
  to each other by relative paths.
- The home page is `index.html`, which hosts use as the front page automatically.
