import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from './Images/logo.png';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from './firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { doc,getDoc } from 'firebase/firestore';
import Likes from './Likes';

function Profile() {
    const [Post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState(logo); 
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        name: '',
        bio:''
      });
    const storage = getStorage();

    // Function to fetch user's posts and profile picture
    async function userPosts(user) {
        try {
            setLoading(true);
    
            // Query Firestore for posts where userid matches the current user
            const postsQuery = query(
                collection(firestore, 'Posts'), 
                where('userid', '==', user.uid),
                orderBy('createdat', 'desc')
            );
                        const querySnapshot = await getDocs(postsQuery);
    
            // Collecting posts data
            const postarr = querySnapshot.docs.map((doc) => {
                const post = doc.data();
                post.id = doc.id;
                return post;
            });
    
            setPost(postarr);
            setLoading(false);
    
            // Get the profile picture URL
            const imgRef = ref(storage, `profilePics/${user.uid}.png`);
            try {
                const url = await getDownloadURL(imgRef);
                setProfilePicUrl(url); 
            } catch (error) {
                console.error('Error fetching profile image:', error);
                // Optional: handle the case where the image doesn't exist or fails to load
                setProfilePicUrl(logo);
            }
    
        } catch (error) {
            console.log('Error fetching posts:', error);
            setLoading(false);
        }
    }

    // Effect to detect user authentication status
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if (user) {
                const docref=doc(firestore,'users',user.uid);
                const snap=await getDoc(docref);
                const data=snap.data();
                setUserDetails({
                  name: data.username,
                  bio:data.bio
                });      
                userPosts(user);
    
            } else {
                console.log('User is not authenticated.');
                navigate('/login');
            }
        });

        // Clean up listener to avoid memory leaks
        return () => unsubscribe();
    }, [navigate]);

    // Handling image click for toast actions
    function handdlimgclik() {
        toast(
            <div className='flex justify-between'>
                <button className='border-2 border-black rounded bg-black text-white' onClick={updatePicture} style={{ marginRight: '10px' }}>
                    Update Picture
                </button>
                <button className='border-2 border-black rounded bg-black text-white' onClick={viewPicture}>
                    View Picture
                </button>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Keeps the toast open until user interacts
                closeOnClick: false,
                draggable: false,
            }
        );
    }

    function updatePicture() {
        navigate('/EditProfile');
    }

    function viewPicture() {
        window.open(profilePicUrl, '_blank');  // View the profile picture in a new tab
    }

    // Calculate total likes for all posts
    const totalLikes = Post.reduce((total, post) => {
        return total + (post.Likes ? post.Likes.length : 0);
    }, 0);

    return (
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col border-2 m-5 rounded-lg'>
                <div className='border- flex items-start justify-around pt-10 '>
                    <div>
                        <img 
                            src={profilePicUrl} 
                            alt='Profile' 
                            className='rounded-full size-24 cursor-pointer' 
                            onClick={handdlimgclik} 
                        />
                    </div>
                    <div className='text-center font-bold'>
                        <h2>Posts</h2>
                        <p>{Post.length}</p>
                    </div>
                    <div className='text-center font-bold'>
                        <h2>Likes</h2>
                        <p>{totalLikes}</p>
                    </div>
                </div>
                <div className='ms-4 md:ms-40 flex space-x-4 my-2 max-w-80 md:max-w-96'>
                    <p>{userDetails.bio}</p>
                </div>
                <div className='ms-4 md:ms-40 flex space-x-4 my-2'>
                    <button
                        className='w-32 border-2 border-black rounded hover:bg-black hover:text-white focus:bg-black focus:text-white '
                        onClick={() => navigate('/EditProfile')}
                    >
                        Edit Profile
                    </button>
                    <button
                        className='w-32 border-2 border-black rounded hover:bg-black hover:text-white focus:bg-black focus:text-white '
                        onClick={() => navigate('/Postform')}
                    >
                        Add Post
                    </button>
                </div>
            </div>

            {loading ? <h1>Loading...</h1> :
                <div className='flex flex-col justify-center items-center'>
                    {Post.length === 0 ? (
                        <p>No posts found for this user.</p>
                    ) : (
                        Post.map((obj, index) => (
                            <div key={index} className='w-[90%] mx-8 md:w-1/2 border-2 h-full rounded-lg mb-10'>
                                <div className='flex gap-x-4 h-11 p-2'>
                                    <img src={logo} alt='user' className='rounded-full size-8' />
                                    <p className='font-bold'>{obj.username}</p>
                                </div>
                                <hr />
                                <div className='p-2 font-serif'>
                                    <p className='text-lg font-bold'>{obj.title}</p>
                                    <br />
                                    <p className=''>{obj.content}</p>
                                </div>
                                <hr />
                                <div>       
                                    <Likes post={obj}/>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            }

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default Profile;
