import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';
import HomeNav from './HomeNav';
import logo from './Images/logo.png';
import Likes from './Likes';

function Home() {
  const [Post, setPost] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      Feed();
    } else {
      console.log('No user is logged in.');
    }
  }, []);

  async function Feed() {
    try {
      const feed = await getDocs(collection(firestore, 'Posts'));

      const postPromises = feed.docs.map(async (obj) => {
        const post = obj.data();
        post.id = obj.id;

        try {
          // Ensure post.userid exists
          if (post.userid) {
            const userRef = doc(firestore, 'users', post.userid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              post.username = userData?.username || 'Unknown User';
            } else {
            //   console.log('No user document found');
              post.username = 'Unknown User';
            }
          } else {
            // console.log('No userid in post');
            post.username = 'Unknown User';
          }
        } catch (err) {
          console.log('Error fetching user data:', err);
          post.username = 'Unknown User';
        }

        return post;
      });

      let postsWithUsernames = await Promise.all(postPromises);
      postsWithUsernames = shuffleArray(postsWithUsernames);

      setPost(postsWithUsernames);
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  }

  // Fisher-Yates (Knuth) Shuffle Algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <div>
      <HomeNav />
      <div className='flex flex-col items-center justify-start gap-y-2'>
        {Post.length > 0 ? (
          Post.map((obj, index) => (
            <div key={obj.id}
              className={`w-[90%] mx-8 md:w-1/2 border-2 h-full rounded-lg mb-10 ${index === 0 ? 'mt-20' : ''}`}
            >
              <div className='flex gap-x-4 h-11 p-2'>
                <img src={logo} alt='user' className='rounded-full size-8' />
                <p className='font-bold'>{obj.username}</p>
              </div>
              <hr />
              <div className='p-2 font-serif'>
                <p className='text-lg font-bold'>{obj.title}</p>
                <br />
                <p>{obj.content}</p>
              </div>
              <hr />
              <div>
                <Likes post={obj} />
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
