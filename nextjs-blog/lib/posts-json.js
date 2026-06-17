import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

/**
 * Reads and parses the posts.json file.
 * Throws descriptive errors if the file is missing or contains invalid JSON.
 */
function readPostsFile() {
  let fileContents;
  try {
    fileContents = fs.readFileSync(postsFilePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Posts data file not found at ${postsFilePath}. Ensure data/posts.json exists.`);
    }
    throw new Error(`Failed to read posts data file (${postsFilePath}): ${error.message}`);
  }

  try {
    const parsed = JSON.parse(fileContents);
    if (!Array.isArray(parsed)) {
      throw new Error(`Posts data file must contain a JSON array, but got ${typeof parsed}.`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in posts data file (${postsFilePath}): ${error.message}`);
    }
    throw error;
  }
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

  return allPosts.map((post) => {
    if (!post.id) {
      throw new Error(`Post entry is missing required "id" field: ${JSON.stringify(post)}`);
    }
    return {
      params: { id: post.id },
    };
  });
}

/**
 * Get a single post's data by ID.
 * Throws if the post is not found so callers can handle the error explicitly.
 */
export function getPostData(id) {
  if (!id) {
    throw new Error('getPostData requires a non-empty post ID.');
  }

  const allPosts = readPostsFile();
  const post = allPosts.find((p) => p.id === id);

  if (!post) {
    throw new Error(`Post with ID "${id}" not found in posts data.`);
  }

  return {
    id: post.id,
    title: post.title,
    date: post.date,
    contentHtml: post.contentHtml,
  };
}
