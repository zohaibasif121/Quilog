import React from 'react'
import main from './Images/main.png'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';

function Main() {
const navigate=useNavigate();

    function ThrowonSignup(){
      navigate('/Signup')  ;
    };

    function ThrowonLogin(){
        navigate('/Login');
    };
    return (
        <main className='   flex flex-col space-y-4'>
        <Navbar/>
        <div className='  mt-20 md:mt-10 mx-12 text-2xl md:text-[50px] h-fit'>
        " The secret to getting ahead is getting started"
        </div>

        <div className=' flex flex-col md:flex-row'>
            <div className='w-screen md:w-1/2 h-1/2 text-black flex flex-col items-start justify-center space-y-12 mt-20 md:mt-28 pl-10 md:pl-40'>
                <button
                className='border-2 border-slate-200 rounded-lg p-2 bg-slate-200 hover:bg-slate-300
                hover:border-black w-20 focus:bg-slate-300'
                onClick={ThrowonSignup}
                >Sign up</button>
                <button
                className='border-1 border-slate-200 rounded-lg p-2 bg-slate-200 hover:bg-slate-300
                hover:border-black w-20 focus:bg-slate-300'
                onClick={ThrowonLogin}
                >Login</button>
            </div>
            <div className='w-screen md:w-1/2 h-1/2'>
                <img src={main} 
                alt='img'
                className=' h-1/2 w/1/2 md:size-96'
                />
            </div>
        </div>
    </main>
  )
}

export default Main
