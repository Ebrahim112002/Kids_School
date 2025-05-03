import React from 'react';
import Banner from '../Components/Banner/Banner';
import Explore from '../Components/Explore/Explore';
import Curriculumn from '../Components/Curriculumn/Curriculumn';

const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <Explore></Explore>
           <Curriculumn></Curriculumn>
        </div>
    );
};

export default Home;