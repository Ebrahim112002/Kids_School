import React from 'react';
import { useLoaderData } from 'react-router';
import Card from './Card';

const About = () => {

    const data = useLoaderData();
    console.log(data)
    return (
        <div className='w-[90%] mx-auto my-10 py-6'>

            <h1 className='text-4xl text-center font-bold mb-10 '> Our Stories</h1>
            
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-2 '>
                {
                    data.map(card=><Card key={card.id} card={card}></Card>)
                }
            </div>
        </div>
    );
};

export default About;