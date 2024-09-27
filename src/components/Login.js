import React, {  useState } from 'react';
import main from './Images/main.png';
import { useNavigate } from 'react-router-dom';
import Inputfield from './Inputfield';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './Navbar';

const auth = getAuth();

function Login() {
    const navigate = useNavigate();

    const [login, setLogin] = useState({
        mail: '',
        pass: ''
    });

    const [loading, setLoading] = useState(false); 

    // useEffect(
    //     ()=>{
    //         onAuthStateChanged(auth,(user)=>{
    //             if (user){
    //                 signOut(auth);
    //             }
    //         })
    //     },[])

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); 

        // Display a loading toast that will stay visible until dismissed manually
        const loadingToastId = toast.loading("Logging in... ", {
            position: "top-center",
            theme: "light",
            hideProgressBar:true
        });

        try {
            const userCredential = await signInWithEmailAndPassword(auth, login.mail, login.pass);
            const user = userCredential.user;

            if (user.emailVerified) {
                toast.update(loadingToastId, { // Update the loading toast to success
                    render: "Login successful!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
                navigate('/Home');
            } else {
                toast.update(loadingToastId, { // Update the loading toast to show an error
                    render: "Email not verified. Please check your inbox.",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000
                });
            }
        } catch (error) {
            toast.update(loadingToastId, { // Update the loading toast to show an error
                render: error.code,
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        } finally {
            setLoading(false); // Set loading to false after the operation is complete
        }
    }

    

    return (

        <>
        <Navbar />
        <div className='flex flex-col md:flex-row'>
            <div className='flex md:hidden justify-center p-4 font-bold text-[40px]'>
                Let's Blog it
            </div>

            <div className='bg-slate-200 block m-3 p-3 space-y-2 rounded-lg md:w-1/2 md:mx-32 md:mt-10'>
                <h1 className='font-bold text-[30px]'>Welcome</h1>
                <h2>Login to your account</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4 mr-3 md:mr-10'>
                        <Inputfield
                            label='E-mail'
                            className='w-full h-10 my-1 rounded'
                            type='email'
                            name='email'
                            value={login.mail}
                            onChange={(e) => { setLogin({ ...login, mail: e.target.value }) }}
                        />
                    </div>

                    <div className='mb-4 mr-3 md:mr-10'>
                        <Inputfield
                            label='Password'
                            className='w-full h-10 my-1 mx-9 rounded'
                            type='password'
                            name='password'
                            value={login.pass}
                            onChange={(e) => { setLogin({ ...login, pass: e.target.value }) }}
                        />
                    </div>

                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className={`border-2 border-black my-10 px-2 py-1 hover:font-bold rounded w-1/2 ${loading ? 'opacity-50' : ''}`}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className='flex flex-col items-center justify-center'>
                    
                   <p>Don't have an account?
                        <button onClick={() => navigate('/Signup')} className='font-bold'>Signup</button>
                    </p>
                </div>
            </div>

            <div className='hidden md:flex flex-col justify-start w-1/2'>
                <h1 className='font-bold text-[50px]'>Let's Blog it</h1>
                <img src={main} alt='img' className='size-96' />
            </div>
            
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
        </>
    );
}

export default Login;
