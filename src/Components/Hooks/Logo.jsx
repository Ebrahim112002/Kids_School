import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div>
            <Link to='/'>
 <div className="flex items-center gap-2">
            <img src="https://i.ibb.co.com/Z1Sr8WLQ/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-3xl font-bold text-blue-800">SCHOOL</span>
          </div>
            </Link>
           
        </div>
    );
};

export default Logo;