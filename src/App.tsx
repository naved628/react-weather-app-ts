import React from 'react';
import SearchWeathers from './components/SearchWeathers';
import HeaderComponent from './components/HeaderComponent';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-7xl rounded-xl shadow-xl my-8 bg-gradient-to-r from-blue-400 to-indigo-600 py-8 px-8 h-auto">
        <HeaderComponent />
        <SearchWeathers />
      </div>
    </div>
  );
};

export default App;
