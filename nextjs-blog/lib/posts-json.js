import fs from 'fs';
import path from 'path';
import { sortPostsByDate, formatPostIds, formatPostData } from './post-utils';

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
  return sortPostsByDate(allPosts.map(formatPostData));
}

/**
 * Get all post IDs in the format required by Next.js getStaticPaths
 */
export function getAllPostIds() {
  const allPosts = readPostsFile();
  return formatPostIds(allPosts);
}

/**
 * Get a single post's data by ID
 */
export function getPostData(id) {
  const allPosts = readPostsFile();
  const post = allPosts.find((p) => p.id === id);

  if (!post) {
    return null;
  }

  return formatPostData(post);
}
