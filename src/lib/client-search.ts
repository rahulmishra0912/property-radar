export type SearchProjectHit = {
  id: string;
  slug: string;
  name: string;
  locality: string;
  reraId: string;
  reraStatus: string;
  delayMonths: number;
  developer: { name: string; shortName: string; slug: string };
};

export type SearchDeveloperHit = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
};

export type SearchIndex = {
  projects: SearchProjectHit[];
  developers: SearchDeveloperHit[];
};

export function filterSearchIndex(index: SearchIndex, query: string, take = 12) {
  const q = query.trim().toLowerCase();
  if (q.length < 1) {
    return { projects: [] as SearchProjectHit[], developers: [] as SearchDeveloperHit[] };
  }

  const projects = index.projects
    .filter((p) =>
      [p.name, p.reraId, p.locality, p.developer.name, p.developer.shortName].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
    .sort((a, b) => b.delayMonths - a.delayMonths)
    .slice(0, take);

  const developers = index.developers
    .filter((d) => [d.name, d.shortName].some((value) => value.toLowerCase().includes(q)))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6);

  return { projects, developers };
}
