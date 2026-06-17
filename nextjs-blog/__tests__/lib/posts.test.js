import fs from 'fs';

// Mock remark and remark-html before importing the module under test
jest.mock('remark', () => ({
  remark: () => ({
    use: () => ({
      process: async (content) => ({
        toString: () => `<p>${content}</p>`,
      }),
    }),
  }),
}));
jest.mock('remark-html', () => ({}));
jest.mock('fs');

const { getSortedPostsData, getAllPostIds, getPostData } = require('../../lib/posts');

const mdFileA = `---
title: 'Alpha Post'
date: '2025-01-01'
---

Alpha content here.`;

const mdFileB = `---
title: 'Beta Post'
date: '2025-06-15'
---

Beta **bold** content.`;

const mdFileC = `---
title: 'Gamma Post'
date: '2025-03-10'
---

Gamma content.`;

beforeEach(() => {
  fs.readdirSync.mockReturnValue(['alpha.md', 'beta.md', 'gamma.md']);
  fs.readFileSync.mockImplementation((filePath) => {
    if (filePath.includes('alpha.md')) return mdFileA;
    if (filePath.includes('beta.md')) return mdFileB;
    if (filePath.includes('gamma.md')) return mdFileC;
    throw new Error(`Unexpected file: ${filePath}`);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getSortedPostsData', () => {
  it('returns posts sorted by date descending', () => {
    const result = getSortedPostsData();
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('beta');  // 2025-06-15
    expect(result[1].id).toBe('gamma'); // 2025-03-10
    expect(result[2].id).toBe('alpha'); // 2025-01-01
  });

  it('strips .md extension from filename to create id', () => {
    const result = getSortedPostsData();
    expect(result.map((p) => p.id)).toEqual(['beta', 'gamma', 'alpha']);
  });

  it('includes parsed frontmatter fields', () => {
    const result = getSortedPostsData();
    expect(result[0]).toMatchObject({ title: 'Beta Post', date: '2025-06-15' });
    expect(result[1]).toMatchObject({ title: 'Gamma Post', date: '2025-03-10' });
    expect(result[2]).toMatchObject({ title: 'Alpha Post', date: '2025-01-01' });
  });

  it('handles a single post', () => {
    fs.readdirSync.mockReturnValue(['alpha.md']);
    const result = getSortedPostsData();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('alpha');
  });

  it('handles empty directory', () => {
    fs.readdirSync.mockReturnValue([]);
    const result = getSortedPostsData();
    expect(result).toEqual([]);
  });

  it('sorts posts with equal dates consistently', () => {
    const mdSame1 = `---\ntitle: 'Same A'\ndate: '2025-01-01'\n---\nContent A`;
    const mdSame2 = `---\ntitle: 'Same B'\ndate: '2025-01-01'\n---\nContent B`;
    fs.readdirSync.mockReturnValue(['same-a.md', 'same-b.md']);
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('same-a.md')) return mdSame1;
      if (filePath.includes('same-b.md')) return mdSame2;
      throw new Error(`Unexpected file: ${filePath}`);
    });
    const result = getSortedPostsData();
    expect(result).toHaveLength(2);
    // Both posts present regardless of order
    const ids = result.map((p) => p.id);
    expect(ids).toContain('same-a');
    expect(ids).toContain('same-b');
  });
});

describe('getAllPostIds', () => {
  it('returns IDs in Next.js getStaticPaths format', () => {
    const result = getAllPostIds();
    expect(result).toEqual([
      { params: { id: 'alpha' } },
      { params: { id: 'beta' } },
      { params: { id: 'gamma' } },
    ]);
  });

  it('returns empty array for empty directory', () => {
    fs.readdirSync.mockReturnValue([]);
    expect(getAllPostIds()).toEqual([]);
  });
});

describe('getPostData', () => {
  it('returns post data with id, contentHtml, and frontmatter', async () => {
    const result = await getPostData('alpha');
    expect(result.id).toBe('alpha');
    expect(result.title).toBe('Alpha Post');
    expect(result.date).toBe('2025-01-01');
    expect(result.contentHtml).toBeDefined();
    expect(typeof result.contentHtml).toBe('string');
  });

  it('returns contentHtml from remark processing', async () => {
    const result = await getPostData('beta');
    expect(result.contentHtml).toContain('Beta');
  });
});
