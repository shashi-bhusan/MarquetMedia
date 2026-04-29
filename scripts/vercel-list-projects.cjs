/**
 * List Vercel projects (names + ids) to find VERCEL_PROJECT slug.
 * Read-only; does not modify or delete anything.
 *
 *   VERCEL_TOKEN=xxx node scripts/vercel-list-projects.cjs
 *   VERCEL_TEAM_ID=team_xxx VERCEL_TOKEN=xxx node scripts/vercel-list-projects.cjs
 */
require('dotenv').config({ path: '.env.local' });

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

async function main() {
  if (!token) {
    console.error('Set VERCEL_TOKEN (https://vercel.com/account/tokens)');
    process.exit(1);
  }

  const q = new URLSearchParams({ limit: '50' });
  if (teamId) q.set('teamId', teamId);

  const res = await fetch(`https://api.vercel.com/v9/projects?${q}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(res.status, text);
    process.exit(1);
  }

  const data = JSON.parse(text);
  const projects = data.projects || data;
  const list = Array.isArray(projects) ? projects : [];
  if (list.length === 0) {
    console.log('No projects returned. If this is a team scope, set VERCEL_TEAM_ID.');
    return;
  }

  for (const p of list) {
    console.log(`${p.name}\t${p.id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
