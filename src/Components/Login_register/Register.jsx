import React from 'react';

const Register = () => {
    return (
        <div className='w-[90%] mx-auto'>
            <div className="hero bg-base-200 ">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body h-80">
      <form action="">
            <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
            </form>
        
      </div>
    </div>
  </div>
</div>
        </div>
    );
};

export default Register;