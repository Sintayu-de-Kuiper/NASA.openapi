import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import NASALogo from '../assets/NASA_Worm_logo.svg?react';
import {NavLink} from "react-router-dom";

const Header: React.FC = () => {
  return (
    <>
      <div
        className="custom-mask pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 backdrop-blur-[8px] z-40"
      ></div>
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="w-full max-w-7xl px-6 mx-auto">
          <nav className="flex items-center justify-between gap-4 py-4 lg:h-20">
            <NavLink to="/">
              <NASALogo/>
            </NavLink>
            <ul className="flex gap-4 text-white/50 font-medium w-full ml-3">
              <li>
                <NavLink
                  to="/apod"
                  className={({isActive}) =>
                    isActive ? "text-white font-medium px-4 py-1.5" : "hover:text-white font-medium px-4 py-1.5"
                  }
                >
                  APOD
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;