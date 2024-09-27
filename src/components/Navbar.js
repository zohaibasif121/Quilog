import logo from './Images/logo.png';
import { useNavigate } from 'react-router-dom';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Navbar() {
  const navigate = useNavigate();
//   const [userDetails, setUserDetails] = useState({
//     name: '',
//   });

//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserDetails({
//           name: user.displayName,
//         });
        
//       } else {
//         setUserDetails({ name: '' }); // Reset to empty when user is logged out
//       }
//     });
//   }, []); // Run only once, when the component mounts

  function handleSignup() {
    navigate('/Signup');
  }

  return (
    <div className='w-screen bg-white flex align-center justify-between px-5 md:px-14 mt-5'>
      <div className='flex space-x-3'>
        <img
          src={logo}
          alt='logo'
          className='size-8'
        />
        <h1 className='font-bold text-2xl'>Quilog</h1>
      </div>
      <div className='flex space-x-3'>
        <button
          className='font-bold border-1 rounded border-black hover:border-2 focus:border-2'
          onClick={handleSignup}
        >
            Sign up
        </button>
       
      </div>
    </div>
  );
}

export default Navbar;
