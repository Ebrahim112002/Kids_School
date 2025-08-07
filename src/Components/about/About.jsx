import React from 'react';

import Card from './Card';
import { useLoaderData } from 'react-router';


const About = () => {
    const data = useLoaderData();
console.log(data)
    
    const cards = Array.isArray(data) ? data : (Array.isArray(data?.stories) ? data.stories : []);

    console.log(cards)

    return (
        <div className='w-[90%] mx-auto my-10 py-6'>
            <h1 className='text-4xl text-center font-bold mb-10'>Our Stories</h1>

            <div className='grid lg:grid-cols-2 grid-cols-1 gap-5 mb-4'>
                {
                    cards.map(card => <Card key={card.id} card={card} />)
                }
            </div>
        </div>
    );
};

export default About;
