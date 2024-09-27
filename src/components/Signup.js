import React, { useState } from 'react';
import main from './Images/main.png';
import { useNavigate } from 'react-router-dom';
import Inputfield from './Inputfield';
import { createUserWithEmailAndPassword,sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Navbar from './Navbar';
import {  firestore } from './firebase';
import { setDoc,doc,serverTimestamp } from 'firebase/firestore';

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        mail: '',
        pass: ''
    });

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission behavior
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.mail, form.pass);
            // Successfully created a new user
            const user = userCredential.user;
            // console.log("User created: ", user);

            await sendEmailVerification(user);
            // alert("Verification email sent to: ", user.email);
            
            toast.success('A verification Mail has sent on Your E mail check it out ', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                });

            await updateProfile(auth.currentUser ,{
                displayName: `${form.username}`
            } )
              // Add the user to Firestore using the modular syntax
              await setDoc(doc(firestore, 'users', user.uid), {
                username: form.username,
                email: form.mail,
                createdAt: serverTimestamp(),
            });
            setTimeout(() => {
                
                navigate('/Login')
            }, 3000);
            
        } catch (error) {
            // Handle any errors during the user creation
            // console.error(`Error creating user:${error.code}` , error);
             toast.error( `${error.code}` , {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                });
        }
    }
    
    
    return (
        <>
        <Navbar/>
        <div className='flex flex-col md:flex-row'>
            <div className='flex md:hidden justify-center p-4 font-bold text-[40px] '>
                Let's Blog it
            </div>

            <div className='bg-slate-200 block m-3 p-3 space-y-1 rounded-lg md:w-1/2 md:mx-32 md:mt-10'>
                <h1 className='font-bold text-[30px]'>Create an account</h1>
                <h2>Let's blog it with Quilog</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4 mr-3 md:mr-10'>
                        <Inputfield
                            label='Name'
                            className='w-full h-10 my-1 rounded '
                            type='text'
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                    </div>

                    <div className='mb-4 mr-3 md:mr-10'>
                        <Inputfield
                            label='E-mail'
                            className='w-full h-10 my-1 rounded'
                            type='email'
                            value={form.mail}
                            onChange={(e) => setForm({ ...form, mail: e.target.value })}
                        />
                    </div>

                    <div className='mb-4 mr-3 md:mr-10'>
                        <Inputfield
                            label='Password'
                            className='w-full h-10 my-1 mx-9 rounded'
                            type='password'
                            value={form.pass}
                            onChange={(e) => setForm({ ...form, pass: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-col justify-center items-center'>
                        <button
                            type='submit'
                            className='border-2 border-black my-10 px-2 py-1 hover:font-bold rounded w-1/2'>
                            Create account
                        </button>
                        
                    </div>
                </form>
                        
                <div className='flex flex-col justify-center items-center'>
                    
               
                   
                    <p>Already have an account?
                        <button onClick={() => navigate('/Login')} className='font-bold'>Login</button>
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
        </>
    );
}

export default Signup;
