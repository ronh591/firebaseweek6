// Import the firebase app instance...posts-firebase.js
import { db } from './firebase'; // load from firebase.js in same dir
import { 
    collection, 
    getDocs, 
    getDoc,        // Needed for fetching single document
    doc,           // Needed for creating single document reference
} from 'firebase/firestore';
import { sortPostsByDate, formatPostIds, formatPostData } from './post-utils';

/**
 * Fetches all posts, maps the Document ID to the 'id' field, and sorts them.
 * This retrieves id, title, date, and contentHtml for all posts.
 * @returns {Promise<Array<Object>>} An array of post objects formatted for rendering.
 */
export async function getSortedPostsData() {
    const postsCollectionRef = collection(db, "posts");
    const snapshot = await getDocs(postsCollectionRef);
    
    const postsData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
    
    return sortPostsByDate(postsData.map(formatPostData));
}

/**
 * Fetches the IDs of all posts for use by Next.js's getStaticPaths.
 * @returns {Promise<Array<Object>>} An array of objects in the format { params: { id: '...' } }.
 */
export async function getAllPostIds() {
    const postsCollectionRef = collection(db, "posts");
    const snapshot = await getDocs(postsCollectionRef);
    
    const posts = snapshot.docs.map(docSnap => ({ id: docSnap.id }));
    return formatPostIds(posts);
}

/**
 * Fetches a single post document by its ID.
 * @param {string} id The unique Firestore Document ID of the post.
 * @returns {Promise<Object | null>} The formatted post object or null if not found.
 */
export async function getPostData(id) {
    const postDocRef = doc(db, "posts", id);
    const docSnap = await getDoc(postDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return formatPostData({ id: docSnap.id, ...data });
    } else {
        return null;
    }
}
