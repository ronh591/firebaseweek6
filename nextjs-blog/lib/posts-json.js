import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

/**
 * Reads and parses the posts.json file
 */
function readPostsFile() {
  const fileContents = fs.readFileSync(postsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

/**
 * Get all posts, sorted by date (newest first)
 */
export function getSortedPostsData() {
  const allPosts = readPostsFile();

  return allPosts
    .map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date,
      contentHtml: post.contentHtml,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Get all post IDs in the format required by Next.js getStaticPaths
 */
export function getAllPostIds() {
  const allPosts = readPostsFile();

  return allPosts.map((post) => ({
    params: { id: post.id },
  }));
}

/**
 * Get a single post’s data by ID
 */
export function getPostData(id) {
  const allPosts = readPostsFile();
  const post = allPosts.find((p) => p.id === id);

  if (!post) {
    return null; // Gracefully handle missing ID
  }

  return {
    id: post.id,
    title: post.title,
    date: post.date,
    contentHtml: post.contentHtml,
  };
}

