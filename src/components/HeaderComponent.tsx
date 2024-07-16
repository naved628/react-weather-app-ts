import React from "react";
import { FiUser } from 'react-icons/fi';

const HeaderComponent: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4 my-2 mx-auto max-w-6xl">
      <div className="text-white text-2xl w-96 sm:w-72 font-bold">THE WEATHER FORECASTING</div>
      <div className="text-white">
          <FiUser className="w-8 h-8" />
        </div>
    </header>
  );
};

export default HeaderComponent;
