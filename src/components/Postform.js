// import firebase from 'firebase/compat/app';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react'
import { getAuth } from 'firebase/auth';
import { firestore } from './firebase';
import { useNavigate } from 'react-router-dom';

function Postform() {
    const [title, settitle] = useState(``);
    const [content, setcontnt] = useState(``);
    const [loading,setLoading]=useState(false);
    const [error,seterror]=useState(false);

    const nevigate = useNavigate();
    function handletitle(e) {
        settitle(e.target.value);
        console.log(title);

    }
    function handleContent(e) {
        setcontnt(e.target.value)
        console.log(content);

    }
    const auth = getAuth();
    const user = auth.currentUser;
    async function handleSubmit(e) {
        try {
            setLoading(true);
            seterror(false)
            e.preventDefault();
            await addDoc(collection(firestore, 'Posts'), {
                userid: user.uid,
                title: title,
                content: content,
                Likes:[],
                createdat: serverTimestamp(),
            });

            nevigate(-1);

            settitle('');
            setcontnt('');

            setLoading(false);

        } catch (error) {
            seterror(true)
        
        }
    }

    if (loading) {
        return<h1>posting...</h1>
    }
    if (error) {
        return<h1>Something Went Wrong</h1>
    }
    return (
        <div
            className=' flex items-center justify-center font-serif  '
        >
            <form onSubmit={handleSubmit}
                className=' w-full md:w-1/2 m-3 pb-10 '
            >
                <div
                    className='bg-slate-200 p-6 rounded-lg'
                >
                    <p
                        className=' text-[30px] md:text-[40px] text-center '
                    >
                        Let's Post it
                    </p>
                    <label
                        className='font-bold px-2'>
                        Title
                    </label><br />
                    <input
                        type='text'
                        onChange={handletitle}
                        value={title}
                        placeholder='Title'
                        className='w-full border-collapse border-spacing-2 border-2 h-12  rounded-lg px-2  border-slate-300'
                    /><br />

                    <label
                        className='font-bold px-2'>
                        Content
                    </label><br />

                    <textarea
                        type='text'
                        onChange={handleContent}
                        value={content}
                        required
                        placeholder='Aeticle Blog Post  '
                        className='w-full border-collapse border-spacing-2 border-2 h-96 md:h-48 overflow-hidden rounded-lg px-2  border-slate-300'
                    /><br />
                    <div
                        className='w-full flex items-center justify-end m-2 p-2 '
                    >
                        <button type='submit'
                            className=' bg-white p-2 w-1/5 rounded-lg hover:bg-black hover:text-white
                       focus:bg-black focus:text-white focus:border-2 border-gray-200' >
                            post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Postform

