import React from 'react'
import { doc,updateDoc,arrayUnion, getDoc,arrayRemove } from 'firebase/firestore';
import { firestore } from './firebase';
import { getAuth } from 'firebase/auth';
function Likes(props) {
    const auth=getAuth();
    // console.log(props.post);

    
    async function handlelike() {
      try {
          const ref = doc(firestore, 'Posts', props.post.id);
          
          const snap = await getDoc(ref);
          const data = snap.data();
          
          if (data.Likes && data.Likes.includes(auth.currentUser.uid)) {
            await updateDoc(ref, {
              Likes: arrayRemove(auth.currentUser.uid)
          });
         
          // console.log('Like removed');
          // alert('Like removed');
          } else {
              await updateDoc(ref, {
                  Likes: arrayUnion(auth.currentUser.uid) 
              });
              // console.log('Post liked successfully!');
          }
      } catch (error) {
          console.error('Error updating likes:', error);
      }
  }
  

    const hasLiked = props.post.Likes?.includes(auth.currentUser.uid);

   
  return (
    <div className='flex items-center justify-between px-5'>
      <button
      className={`p-2  font-sans hover:font-bold ${hasLiked ? 'text-blue-600':'text-blcak'} `} 
      onClick={handlelike}
      >Like 👍
      </button>
      <p className='text-blue-600'>
      {props.post.Likes ? props.post.Likes.length : 0}  Likes    </p>
      
    </div>
  )
}

export default Likes
