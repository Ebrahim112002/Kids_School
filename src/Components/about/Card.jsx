import React from 'react';

const Card = ({card}) => {
    const {title,image,description} = card;
    return (
        <div className='mx-auto w-[80%] '>
           <div className="card lg:card-side px-5  bg-base-100 shadow-sm">
  <figure className='w-full h-60'>
    <img 
    className='w-96 h-96'
      src={image}
      alt="Album" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{description}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Show More</button>
    </div>
  </div>
</div>
        </div>
    );
};

export default Card;