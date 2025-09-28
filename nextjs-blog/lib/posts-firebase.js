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
    const postsCollectionRef = collection(db, "posts");
    const snapshot = await getDocs(postsCollectionRef);
    
    // Map the documents, ensuring the critical 'id' field is created
    const postsData = snapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data() // Retrieves title, date, contentHtml, etc.
        };
    });
    
    // Sort the data locally (e.g., by title)
    postsData.sort((a, b) => {
        return a.title.localeCompare(b.title);
    });
    
    // CRITICAL: Return the processed data
    return postsData;
}

/**
 * Fetches the IDs of all posts for use by Next.js's getStaticPaths.
 * @returns {Promise<Array<Object>>} An array of objects in the format { params: { id: '...' } }.
 */
export async function getAllPostIds() {
    const postsCollectionRef = collection(db, "posts");
    const snapshot = await getDocs(postsCollectionRef);
    
    return snapshot.docs.map(doc => {
        return {
            params: {
                id: doc.id, // The Document ID is the unique slug for the URL
            },
        };
    });
}

/**
 * Fetches a single post document by its ID.
 * @param {string} id The unique Firestore Document ID of the post.
 * @returns {Promise<Object | null>} The formatted post object or null if not found.
 */
export async function getPostData(id) {
    // Get a reference to the specific document path: posts/{id}
    const postDocRef = doc(db, "posts", id);
    
    // Fetch the document
    const docSnap = await getDoc(postDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Return the formatted single post data (id, title, date, contentHtml)
        return {
            id: docSnap.id,
            title: data.title,
            date: data.date,
            contentHtml: data.contentHtml,
        };
    } else {
        // Handle case where the document ID is not found
        return null;
    }
}
