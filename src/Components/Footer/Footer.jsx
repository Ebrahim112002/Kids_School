import React from 'react';

const Footer = () => {

    return (
        <div className=' w-full'>
            <footer className="footer sm:footer-horizontal bg-[rgb(1,172,253)] py-20 flex flex-wrap justify-between px-30 text-white" >

                <div>
                    <div className='flex items-center gap-4'>
                        <img src="https://i.ibb.co.com/21wNS0mb/Group-1.png" alt="" />
                        <h1 className='text-4xl font-semibold'>Kids <br />
                            Education</h1>
                    </div>
                    <p className='mt-4 text-lg'>Inspiring young minds to dream, explore, and achieve. <br />
                        A safe, nurturing environment where learning is fun and curiosity<br /> leads the way.
                        Join us in building a brighter future—one child at a time.</p>

                </div>
                <nav className='text-xl'>
                    <h6 className=" text-3xl ">About School</h6>
                    <a className="link link-hover">Home</a>
                    <a className="link link-hover">About</a>
                    <a className="link link-hover">Facilities</a>
                    <a className="link link-hover">Admission</a>
                </nav>
                <nav>
                    <h6 className="text-3xl mb-5">Keep in Touch</h6>
                    <div className='flex gap-6'>
                        <img src="https://i.ibb.co.com/vxWKprqR/dribble.png" alt="" />
                        <img src="https://i.ibb.co.com/nsDdphRF/fb.png" alt="" />
                        <img src="https://i.ibb.co.com/kVmLV6Cp/google.png" alt="" />
                        <img src="https://i.ibb.co.com/k29ZNzCK/twitter.png" alt="" />
                    </div>

                </nav>
            </footer>
        </div>
    );
};

export default Footer;