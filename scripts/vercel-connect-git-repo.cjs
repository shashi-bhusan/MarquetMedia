/**
 * Attach GitHub repo to an existing Vercel project (updates Git connection only).
 * Does not delete the project, env vars, or past deployments.
 *
 * Prereqs:
 * - Vercel token: https://vercel.com/account/tokens (scope: full account or at least project read/write)
 * - GitHub: Vercel GitHub App installed for https://github.com/shashi-bhusan/MarquetMedia
 *
 * Usage:
 *   VERCEL_TOKEN=xxx VERCEL_PROJECT=your-staging-project-slug node scripts/vercel-connect-git-repo.cjs
 *
 * Optional env:
 *   VERCEL_TEAM_ID   — if the project is under a team (Settings → Team ID)
 *   GIT_REPO         — default shashi-bhusan/MarquetMedia
 *   PRODUCTION_BRANCH — default staging (branch Vercel treats as "Production" for this project)
 *
 * Or pass project slug as first CLI argument.
 */
require('dotenv').config({ path: '.env.local' });

const token = process.env.VERCEL_TOKEN;
const project = process.env.VERCEL_PROJECT || process.argv[2];
const teamId = process.env.VERCEL_TEAM_ID;
const repo = process.env.GIT_REPO || 'shashi-bhusan/MarquetMedia';
const productionBranch = process.env.PRODUCTION_BRANCH || 'staging';

async function main() {
  if (!token) {
    console.error(
      'Missing VERCEL_TOKEN. Create one at https://vercel.com/account/tokens then run:\n' +
        '  VERCEL_TOKEN=xxx VERCEL_PROJECT=<staging-project-slug> node scripts/vercel-connect-git-repo.cjs'
    );
    process.exit(1);
  }
  if (!project) {
    console.error(
      'Missing VERCEL_PROJECT (Vercel project name from dashboard URL) or pass it as the first argument.'
    );
    process.exit(1);
  }

  const q = new URLSearchParams();
  if (teamId) q.set('teamId', teamId);

  const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(project)}?${q.toString()}`;

  const body = {
    gitRepository: {
      type: 'github',
      repo: repo,
    },
    productionBranch,
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('Vercel API error', res.status, text);
    console.error('\nIf you see repoId / permissions errors, connect once via the dashboard (Settings → Git) so the GitHub App is authorized, then retry.');
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.log(text);
    process.exit(0);
  }

  console.log('Updated project:', json.name || project);
  const link = json.link || json.gitRepository;
  if (link) console.log('Git link:', JSON.stringify(link, null, 2));
  else console.log('Response OK (see full JSON if needed).');
  console.log('\nNext: Vercel → Deployments → Redeploy, or push to branch', productionBranch + '.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
