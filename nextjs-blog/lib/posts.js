import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  let fileNames;
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Posts directory not found at ${postsDirectory}. Ensure the "posts" folder exists.`);
    }
    throw new Error(`Failed to read posts directory (${postsDirectory}): ${error.message}`);
  }

  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);

    let fileContents;
    try {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read post file "${fullPath}": ${error.message}`);
    }

    let matterResult;
    try {
      matterResult = matter(fileContents);
    } catch (error) {
      throw new Error(`Failed to parse front matter in "${fullPath}": ${error.message}`);
    }

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  let fileNames;
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Posts directory not found at ${postsDirectory}. Ensure the "posts" folder exists.`);
    }
    throw new Error(`Failed to read posts directory (${postsDirectory}): ${error.message}`);
  }

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  if (!id) {
    throw new Error('getPostData requires a non-empty post ID.');
  }

  const fullPath = path.join(postsDirectory, `${id}.md`);

  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Post file not found: "${fullPath}". No post exists with ID "${id}".`);
    }
    throw new Error(`Failed to read post file "${fullPath}": ${error.message}`);
  }

  let matterResult;
  try {
    matterResult = matter(fileContents);
  } catch (error) {
    throw new Error(`Failed to parse front matter for post "${id}": ${error.message}`);
  }

  let contentHtml;
  try {
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    contentHtml = processedContent.toString();
  } catch (error) {
    throw new Error(`Failed to convert markdown to HTML for post "${id}": ${error.message}`);
  }

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
