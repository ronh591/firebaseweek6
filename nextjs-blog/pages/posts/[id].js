import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts-json';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';

export default function Post({ postData }) {
  if (!postData) {
    return (
      <Layout>
        <Head>
          <title>Post Not Found</title>
        </Head>
        <p>Sorry, this post could not be found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          {postData.date} {/* display division directly */}
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Failed to get post paths in getStaticPaths:', error.message);
    throw new Error(`Failed to generate post paths: ${error.message}`);
  }
}

export async function getStaticProps({ params }) {
  try {
    const postData = await getPostData(params.id);
    return {
      props: {
        postData,
      },
    };
  } catch (error) {
    console.error(`Failed to load post "${params.id}" in getStaticProps:`, error.message);
    throw new Error(`Post page build failed for "${params.id}": ${error.message}`);
  }
}
