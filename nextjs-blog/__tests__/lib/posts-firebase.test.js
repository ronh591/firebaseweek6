import { getSortedPostsData, getAllPostIds, getPostData } from '../../lib/posts-firebase';

// Mock firebase/firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  documentId: jest.fn(),
}));

// Mock the local firebase.js module so it doesn't try to initialize Firebase
jest.mock('../../lib/firebase', () => ({
  db: {},
}));

import { getDocs, getDoc, collection, doc } from 'firebase/firestore';

const mockDocs = [
  { id: 'post-a', data: () => ({ title: 'AAA', date: '2025-01-01', contentHtml: '<p>A</p>' }) },
  { id: 'post-b', data: () => ({ title: 'BBB', date: '2025-06-15', contentHtml: '<p>B</p>' }) },
];

beforeEach(() => {
  getDocs.mockResolvedValue({ docs: mockDocs });
  collection.mockReturnValue('postsCollectionRef');
  doc.mockReturnValue('postDocRef');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getSortedPostsData', () => {
  it('returns all posts sorted by title (localeCompare)', async () => {
    const result = await getSortedPostsData();
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('AAA');
    expect(result[1].title).toBe('BBB');
  });

  it('maps Firestore document IDs to the id field', async () => {
    const result = await getSortedPostsData();
    expect(result[0].id).toBe('post-a');
    expect(result[1].id).toBe('post-b');
  });

  it('handles empty collection', async () => {
    getDocs.mockResolvedValue({ docs: [] });
    const result = await getSortedPostsData();
    expect(result).toEqual([]);
  });
});

describe('getAllPostIds', () => {
  it('returns IDs in Next.js getStaticPaths format', async () => {
    const result = await getAllPostIds();
    expect(result).toEqual([
      { params: { id: 'post-a' } },
      { params: { id: 'post-b' } },
    ]);
  });

  it('returns empty array for empty collection', async () => {
    getDocs.mockResolvedValue({ docs: [] });
    const result = await getAllPostIds();
    expect(result).toEqual([]);
  });
});

describe('getPostData', () => {
  it('returns formatted post when document exists', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: 'post-a',
      data: () => ({ title: 'AAA', date: '2025-01-01', contentHtml: '<p>A</p>' }),
    });

    const result = await getPostData('post-a');
    expect(result).toEqual({
      id: 'post-a',
      title: 'AAA',
      date: '2025-01-01',
      contentHtml: '<p>A</p>',
    });
  });

  it('returns null when document does not exist', async () => {
    getDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await getPostData('nonexistent');
    expect(result).toBeNull();
  });
});
