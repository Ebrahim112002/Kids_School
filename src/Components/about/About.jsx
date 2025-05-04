import React from 'react';
import { useLoaderData } from 'react-router';
import Card from './Card';

const About = () => {
    const data = useLoaderData();

    
    const cards = Array.isArray(data) ? data : (Array.isArray(data?.stories) ? data.stories : []);

    console.log('Cards:', cards); 

    return (
        <div className='w-[90%] mx-auto my-10 py-6'>
            <h1 className='text-4xl text-center font-bold mb-10'>Our Stories</h1>

            <div className='grid lg:grid-cols-2 grid-cols-1 gap-2'>
                {
                    cards.map(card => <Card key={card.id} card={card} />)
                }
            </div>
        </div>
    );
};

export default About;
