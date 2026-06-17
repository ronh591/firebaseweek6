/**
 * Shared utilities for post data manipulation.
 * Used by posts.js, posts-json.js, and posts-firebase.js to avoid duplicated logic.
 */

/**
 * Sorts posts by date in descending order (newest first).
 * @param {Array<Object>} posts - Array of post objects with a `date` field.
 * @returns {Array<Object>} Sorted array (mutates and returns the original).
 */
export function sortPostsByDate(posts) {
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Formats an array of posts into the structure required by Next.js getStaticPaths.
 * @param {Array<Object>} posts - Array of post objects with an `id` field.
 * @returns {Array<{params: {id: string}}>}
 */
export function formatPostIds(posts) {
  return posts.map((post) => ({
    params: { id: post.id },
  }));
}

/**
 * Normalizes a post object to the standard shape used for rendering.
 * @param {Object} post - Raw post object (must have id, title, date, contentHtml).
 * @returns {{id: string, title: string, date: string, contentHtml: string}}
 */
export function formatPostData(post) {
  return {
    id: post.id,
    title: post.title,
    date: post.date,
    contentHtml: post.contentHtml,
  };
}
