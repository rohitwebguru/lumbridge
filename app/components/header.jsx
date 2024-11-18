import React from 'react';
import { Search } from 'lucide-react';
import { SecondaryButton } from './button';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 h-36 fixed top-0 left-0 right-0 z-10">
      <div className="px-4 py-3 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-white">
          <img
              src="/Iconmark.svg"
              alt="Lumbridge logo"
              className="w-8 h-auto mr-2"
            />
            <h2 className='font-medium text-2xl text-white'>Lumbridge</h2>
            {/* <img
              src="/Lumbridge-logo.svg"
              alt="Lumbridge logo"
              className="w-40 h-auto mr-2"
            /> */}
          </div>
          <SecondaryButton
        clickHandler={""}
        >
        🔗 Copy Access Link
      </SecondaryButton>
        </div>
        {/* Search bar */}
        <div className="relative mt-11 flex items-center">
        <input
          id="search"
          name="search"
          type="text"
          className="block w-[222px] rounded-md border-0 py-1.5 pr-14 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <div className="absolute inset-y-0 left-40 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
            ⌘K
          </kbd>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;