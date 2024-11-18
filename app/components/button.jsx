const PrimaryButton = ({ children, onClick, disabled, icon: Icon }) => {
    return (
      <button 
        disabled={disabled}
        onClick={onClick}
        type="button" 
        className="inline-block rounded-[6px] bg-gradient-to-b from-blue-600 to-blue-700 leading-none p-px shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
          <span className="inline-block rounded-[5px] bg-gradient-to-b from-blue-500 to-blue-600 p-px">
            <span className="inline-flex rounded-[4px] items-center gap-x-1.5 bg-blue-600 px-2.5 py-2 text-sm font-medium text-white">
              {Icon && <Icon className="w-4 h-4" />}
              <span>
                {children}
                </span>
            </span>
          </span>
      </button>
    );
  };


  const SecondaryButton = ({ children, onClick, disabled, icon: Icon }) => {
    return (
      <button 
        disabled={disabled}
        onClick={onClick}
        type="button" 
        className="rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:shadow-md transition-shadow duration-150 ease-in-out inline-flex items-center gap-x-1.5">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span>{children}</span>
      </button>
    );
  };

  const RedButton = ({ children, clickHandler }) => {
    return (
      <button 
        className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        type="button"
        onClick={clickHandler}>
      <span>
        {children}
      </span>
    </button>
    );
  };
  
  export { PrimaryButton, SecondaryButton, RedButton };