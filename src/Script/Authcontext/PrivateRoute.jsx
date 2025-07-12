import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import Loading from './Loading';
import { Authcontext } from './Authcontext';

const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(Authcontext)
    const location = useLocation();

    if(loading){
        return<Loading></Loading>
    }
    if(user && user?.email){
        return children;
    }
    return <Navigate state={location.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;