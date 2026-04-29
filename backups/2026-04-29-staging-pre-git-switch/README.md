# Staging Git / Vercel state — backup (2026-04-29)

Created before pointing the **Vercel staging** project at  
`https://github.com/shashi-bhusan/MarquetMedia` (branch **`staging`**).

## What is in this folder

| File | Purpose |
|------|--------|
| `GIT_SNAPSHOT.txt` | `git remote`, branches, and log output from the machine that created this backup |
| `ls-remote-origin.txt` | `git ls-remote` for **`origin`** (`spnsrk/marquetmedia`) |
| `ls-remote-shashi.txt` | `git ls-remote` for **`shashi`** (`shashi-bhusan/MarquetMedia`) |
| `staging-tree-a633e28-shashi.zip` | **`git archive`** of **`staging`** at commit **`a633e28`** (full tree snapshot, no `.git`) |

Vercel’s **connected repository** is **not** stored in Git; it only exists in the Vercel dashboard. Before you disconnect the old repo, open the project → **Settings → Git** and **screenshot** or note the **currently connected** repository and branch.

## Remote comparison (at backup time)

| Remote | URL | `staging` @ SHA | `main` @ SHA |
|--------|-----|-----------------|--------------|
| **origin** | `github.com/spnsrk/marquetmedia` | `b2344a4` | `296e9f0` |
| **shashi** | `github.com/shashi-bhusan/MarquetMedia` | `a633e28` | `17c257c` |

If Vercel was connected to **`spnsrk/marquetmedia`**, it was building **`staging` at `b2344a4`**, which is **not** the same commit as **`shashi/staging` at `a633e28`** (partner logo work).

---

## Switch Vercel staging to your repo (`shashi-bhusan/MarquetMedia`)

1. **GitHub → Vercel access**  
   Under the GitHub account/org that **owns** `shashi-bhusan/MarquetMedia`, ensure the **Vercel** GitHub App is installed and can access that repository.

2. **Vercel → staging project**  
   Open the project that serves the staging URL (e.g. `marquetmedia-staging-…`).

3. **Settings → Git**  
   - **Disconnect** the current repository (e.g. `spnsrk/marquetmedia`), if shown.  
   - **Connect** repository → select **`shashi-bhusan/MarquetMedia`**.

4. **Branch behavior (choose one model)**  
   - **Option A — Staging = previews from `staging`:**  
     Keep **Production Branch** as `main` for your *production* project; enable **Preview** deployments for branch **`staging`** (default on many teams). The staging URL may be a **Preview** deployment for the latest `staging` commit.  
   - **Option B — Dedicated staging project:**  
     Set this project’s **Production Branch** to **`staging`** so the primary domain for *this* project always tracks **`staging`**.

5. **Environment variables**  
   Copy **Settings → Environment Variables** from the old setup if needed (they stay on the **same** Vercel project when you only change Git; if you created a **new** project, paste them manually).

6. **Redeploy**  
   **Deployments → Redeploy** the latest deployment, **or** push to **`staging`** on `shashi-bhusan/MarquetMedia`:

   ```bash
   git checkout staging
   git pull shashi staging
   git push shashi staging
   ```

7. **Verify**  
   Open the staging URL, hard-refresh (or use an incognito window) and confirm partner logos / UI match commit **`a633e28`** (or newer on `staging`).

---

## Restore from `staging-tree-a633e28-shashi.zip`

Unzip to a new folder; it is a full source tree without history. To attach history again, clone `shashi-bhusan/MarquetMedia` and replace the working tree, or cherry-pick as needed.
