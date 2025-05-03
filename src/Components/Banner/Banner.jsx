import React from 'react';
import Marque from './Marque';
import { useNavigate } from 'react-router';

const Banner = () => {

    const navigate = useNavigate();
    return (
        <div className='w-[90%] mx-auto my-5'>

            <div className='w-full mt-10'>
                <Marque></Marque>
            </div>
            <div className="hero  pb-10">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <img
      src="https://i.ibb.co.com/tMDk84LB/hero-kids.png"
    />
    <div>
      <h1 className="text-6xl font-semibold "><span className='text-[rgb(254,163,1)]'>Empowering</span> students <br /> from small age <br /><span className='text-[rgb(5,212,223)]'> towards vision</span></h1>
      <p className="py-6 text-xl">
      With the courage, Confidence, Creativity and Compassion to make their Unique Contribution in a Diverse and Dynamic World.
      </p>
      <button onClick={()=>{
        navigate("/admission")
      }} className="btn btn-lg text-white text-2xl border-none bg-black px-10 rounded-2xl">Enroll Now</button>
    </div>
  </div>
</div>
            
        </div>
    );
};

export default Banner;