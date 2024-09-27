import React, { useState, useEffect } from 'react';
import logo from './Images/logo.png';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { useNavigate } from 'react-router-dom';
import { getStorage ,ref,uploadBytesResumable} from 'firebase/storage';


function EditProfile() {
    const [details, setDetails] = useState({ username: '', bio: '' });
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [profileImage, setProfileImage] = useState(logo); 
    const navigate = useNavigate();
    const storage=getStorage();

    async function getDetails(user) {
        try {
            setLoading(true);
            const ref = doc(firestore, 'users', user.uid);
            const snap = await getDoc(ref);
            const userData = snap.data();
            console.log(userData);

            setDetails({
                username: userData.username || '',
                bio: userData.bio || ''
            });
            setLoading(false);
        } catch (error) {
            console.log('Error fetching user details:', error);
            setLoading(false);
        }
    }

    const auth = getAuth();
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log(currentUser.displayName);
            getDetails(currentUser);
        }
    }, [auth.currentUser]);

    async function handleSubmit(event) {
        event.preventDefault();
        const currentUser = auth.currentUser;
    
        if (currentUser) {
            try {
                setUpdating(true);
                const docRef = doc(firestore, 'users', currentUser.uid);
    
                // Update user details in Firestore
                await updateDoc(docRef, details);
    
                // Check if there's a profile image to upload
                if (profileImage) {

                    const imgRef = ref(storage, `profilePics/${currentUser.uid}.png`); // Specify a path and filename
                    const uploadTask = uploadBytesResumable(imgRef, profileImage);
    
                    // Handle the upload progress
                    uploadTask.on(   'state_changed',
                        (snapshot) => {
                          
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                            console.error('Error uploading image:', error);
                            alert('Failed to upload profile image.');
                            setUpdating(false);
                        },
                        () => {
                            // Handle successful uploads on complete
                            setUpdating(false);
                            navigate(-1);
                        }
                    );
                } else {
                    // No image to upload, just navigate
                    setUpdating(false);
                    navigate(-1);
                }
            } catch (error) {
                console.error('Error updating details:', error);
                alert('Failed to update profile.');
                setUpdating(false);
                navigate(-1);
            }
        } else {
            alert('No user is currently logged in.');
        }
    }
    
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result); // Set the selected image as the background
            };

            reader.readAsDataURL(file);// Convert file to base64-encoded URL for preview
        }
    };

    if (loading) {
        return <h1>Loading ...</h1>;
    }

    if (updating) {
        return <h1>Updating ...</h1>;
    }

    return (
        <div className="flex flex-col items-center justify-center font-serif">
            <form onSubmit={handleSubmit} className="w-full md:w-1/2 h-full">
                <div className="bg-slate-200 rounded-lg p-6 m-3">
                    <h1 className="text-[30px] md:text-[40px] text-center mb-3">Update Profile</h1>
                    <div className='flex  items-center justify-center'>
                        <div className="relative w-28 h-28 ">
                            <img src={profileImage} alt="Profile" 
                            className="absolute inset-0 w-full h-full rounded-full object-cover cursor-pointer z-10" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                        </div>
                    </div>

                    <label className="mx-2">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={details.username}
                        required
                        onChange={(e) => setDetails({ ...details, username: e.target.value })}
                        className="w-full h-10 rounded-md p-1 mb-4 mt-1 border-2 border-slate-300 "
                    />

                    <label className="mx-2">Bio</label>
                    <textarea
                        type="text"
                        placeholder="Bio"
                        value={details.bio}
                        onChange={(e) => setDetails({ ...details, bio: e.target.value })}
                        className="w-full h-32 rounded-md p-1 mb-4 mt-1 border-2 border-slate-300 overflow-hidden"
                    />

                    <div className="w-full flex items-center justify-end m-2 p-2">
                        <button
                            type="submit"
                            className="bg-white p-2 w-fit rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white focus:border-2 border-gray-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
