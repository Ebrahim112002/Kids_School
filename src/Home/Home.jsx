import React from 'react';
import Banner from '../Components/Banner/Banner';
import Explore from '../Components/Explore/Explore';
import Curriculumn from '../Components/Curriculumn/Curriculumn';
import Videos from '../Components/VIdeo/Videos';

const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <Explore></Explore>
           <Videos></Videos>
           <Curriculumn></Curriculumn>
        </div>
    );
};

export default Home;