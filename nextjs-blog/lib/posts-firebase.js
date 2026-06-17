// Import the firebase app instance...posts-firebase.js
import { db } from './firebase'; // load from firebase.js in same dir
import { 
    collection, 
    getDocs, 
    getDoc,        // Needed for fetching single document
    doc,           // Needed for creating single document reference
    query, 
    where, 
    documentId 
} from 'firebase/firestore';

/**
 * Fetches all posts, maps the Document ID to the 'id' field, and sorts them.
 * This retrieves id, title, date, and contentHtml for all posts.
 * @returns {Promise<Array<Object>>} An array of post objects formatted for rendering.
 */
export async function getSortedPostsData() {
    let snapshot;
    try {
        const postsCollectionRef = collection(db, "posts");
        snapshot = await getDocs(postsCollectionRef);
    } catch (error) {
        throw new Error(`Failed to fetch posts from Firestore: ${error.message}`);
    }
    
    const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        if (!data.title) {
            console.warn(`Post document "${doc.id}" is missing a "title" field.`);
        }
        return {
            id: doc.id,
            ...data
        };
    });
    
    postsData.sort((a, b) => {
        if (!a.title || !b.title) return 0;
        return a.title.localeCompare(b.title);
    });
    
    return postsData;
}

/**
 * Fetches the IDs of all posts for use by Next.js's getStaticPaths.
 * @returns {Promise<Array<Object>>} An array of objects in the format { params: { id: '...' } }.
 */
export async function getAllPostIds() {
    let snapshot;
    try {
        const postsCollectionRef = collection(db, "posts");
        snapshot = await getDocs(postsCollectionRef);
    } catch (error) {
        throw new Error(`Failed to fetch post IDs from Firestore: ${error.message}`);
    }
    
    return snapshot.docs.map(doc => {
        return {
            params: {
                id: doc.id,
            },
        };
    });
}

/**
 * Fetches a single post document by its ID.
 * @param {string} id The unique Firestore Document ID of the post.
 * @returns {Promise<Object>} The formatted post object.
 * @throws {Error} If the document is not found or Firestore fails.
 */
export async function getPostData(id) {
    if (!id) {
        throw new Error('getPostData requires a non-empty post ID.');
    }

    let docSnap;
    try {
        const postDocRef = doc(db, "posts", id);
        docSnap = await getDoc(postDocRef);
    } catch (error) {
        throw new Error(`Failed to fetch post "${id}" from Firestore: ${error.message}`);
    }

    if (!docSnap.exists()) {
        throw new Error(`Post with ID "${id}" not found in Firestore.`);
    }

    const data = docSnap.data();
    return {
        id: docSnap.id,
        title: data.title,
        date: data.date,
        contentHtml: data.contentHtml,
    };
}
