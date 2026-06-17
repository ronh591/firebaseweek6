import fs from 'fs';
import { getSortedPostsData, getAllPostIds, getPostData } from '../../lib/posts-json';

jest.mock('fs');

const samplePosts = [
  { id: 'alpha', title: 'Alpha Post', date: '2025-01-01', contentHtml: '<p>A</p>' },
  { id: 'beta', title: 'Beta Post', date: '2025-06-15', contentHtml: '<p>B</p>' },
  { id: 'gamma', title: 'Gamma Post', date: '2025-03-10', contentHtml: '<p>G</p>' },
];

beforeEach(() => {
  fs.readFileSync.mockReturnValue(JSON.stringify(samplePosts));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getSortedPostsData', () => {
  it('returns posts sorted by date descending (newest first)', () => {
    const result = getSortedPostsData();
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('beta');   // 2025-06-15
    expect(result[1].id).toBe('gamma');  // 2025-03-10
    expect(result[2].id).toBe('alpha');  // 2025-01-01
  });

  it('returns only id, title, date, contentHtml fields', () => {
    const result = getSortedPostsData();
    result.forEach((post) => {
      expect(Object.keys(post)).toEqual(
        expect.arrayContaining(['id', 'title', 'date', 'contentHtml']),
      );
    });
  });

  it('handles an empty posts array', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const result = getSortedPostsData();
    expect(result).toEqual([]);
  });

  it('handles a single post', () => {
    fs.readFileSync.mockReturnValue(
      JSON.stringify([{ id: 'only', title: 'Only', date: '2025-01-01', contentHtml: '<p>Only</p>' }]),
    );
    const result = getSortedPostsData();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('only');
  });
});

describe('getAllPostIds', () => {
  it('returns post IDs in the Next.js getStaticPaths format', () => {
    const result = getAllPostIds();
    expect(result).toEqual([
      { params: { id: 'alpha' } },
      { params: { id: 'beta' } },
      { params: { id: 'gamma' } },
    ]);
  });

  it('returns empty array for empty posts file', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    expect(getAllPostIds()).toEqual([]);
  });
});

describe('getPostData', () => {
  it('returns the correct post by id', () => {
    const result = getPostData('beta');
    expect(result).toEqual({
      id: 'beta',
      title: 'Beta Post',
      date: '2025-06-15',
      contentHtml: '<p>B</p>',
    });
  });

  it('returns null for a non-existent id', () => {
    const result = getPostData('nonexistent');
    expect(result).toBeNull();
  });

  it('returns correct fields (id, title, date, contentHtml)', () => {
    const result = getPostData('alpha');
    expect(result).toEqual({
      id: 'alpha',
      title: 'Alpha Post',
      date: '2025-01-01',
      contentHtml: '<p>A</p>',
    });
  });
});
