import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const isSignInPage = location.pathname === '/sign-in';
  console.log(currentUser)
   
  return (
    <header className="bg-slate-200 shadow-lg sticky top-0">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm items-center sm:text-lg flex flex-wrap">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-900">Estate</span>
          </h1>
        </Link>
        
        <form className="p-3 bg-slate-100 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none bg-transparent w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        
        <ul className="flex gap-2 sm:gap-3 items-center">
          <Link to="/">
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:underline">About</li>
          </Link>
          {!isSignInPage && (
            <Link to="/profile" className="flex items-center">
              {currentUser ? (
                <div className="flex items-center">
                  {currentUser.user.avatar? (
                    <img src={currentUser.user.avatar} alt="profile pic" className="rounded-full w-7 h-7 object-cover mr-2" />
                  ) : (
                    <div className="rounded-full w-7 h-7 bg-gray-300 flex items-center justify-center mr-2">
                      <span className="text-gray-600">No Avatar</span>
                    </div>
                  )}
                  {currentUser.user.email ? (
                    <span className="text-slate-700">{currentUser.user.email}</span>
                  ) : (
                    <span className="text-gray-600">No Email</span>
                  )}
                </div>
              ) : (
                <li className="text-slate-700 hover:underline">Sign In</li>
              )}
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
