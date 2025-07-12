import React from 'react';
import { useLoaderData } from 'react-router';
import Teachers from './Teachers';
const Teacher = () => {
     const data = useLoaderData();
    return (
        <div>
             <section className='bg-blue-50 p-20 items-center rounded-2xl'>

        <h1 className='text-center  mb-20 font-bold text-5xl'>
          For any Information Contact us
        </h1>
       <div className='grid grid-cols-3 gap-5'>
        {
          data.map(teacher=><Teachers key={teacher.id} teacher={teacher}></Teachers>)
        }
       </div>

      </section>
        </div>
    );
};

export default Teacher;