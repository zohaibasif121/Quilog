import logo from './Images/logo.png';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect,useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { getStorage,getDownloadURL,ref } from 'firebase/storage';

function    HomeNav() {
  const navigate = useNavigate();
  const storage=getStorage();
  const [userDetails, setUserDetails] = useState({
    name: '',
  });
  const [imgurl , setimgurl]=useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        // setUserDetails({
        //   name: user.displayName,
        // });
        const docref=doc(firestore,'users',user.uid);
        const snap=await getDoc(docref);
        const data=snap.data();
        setUserDetails({
          name: data.username,
        });

        const imgref= ref (storage,`profilePics/${user.uid}.png`);

        getDownloadURL(imgref)
        
        .then((url) => {
          setimgurl(url);
          // console.log(imgurl);
          
        }).catch((err) => {
          setimgurl(logo);
          console.log('Dont have image');
        });
        
      } else {
        setUserDetails({ name: '' }); 
      }
    });
  }, [imgurl]); 
  
function handlebutton(){
    navigate(`/Postform`)
}
function nevprofile() {
  navigate('/Profile');
}
  return (
    <div className='w-screen pt-5 bg-white flex align-center justify-between px-5 md:px-14  fixed '>
      <div className='flex space-x-3'>
        <img
          src={imgurl}
          alt='logo'
          className='size-8 rounded-full'
        />
        <h1 className='font-bold text-2xl cursor-pointer' onClick={nevprofile}>{userDetails.name}</h1>
      </div>
      <div className='flex space-x-3'>
        <button
          className=' border-1 rounded-lg border-black hover:font-bold focus:border-2 bg-slate-200 px-2'
          onClick={handlebutton }
        >
            Add a Post
        </button>
       
      </div>
    </div>
  );
}

export default HomeNav;
