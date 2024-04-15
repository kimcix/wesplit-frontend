import { title } from 'process';
import { FaUserCog } from "react-icons/fa";
import React from 'react';

interface TopBarProps {
    title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div>
        <nav className="fixed top-0 left-0 right-0 bg-yellow-400 p-4 flex justify-around font-bold text-xl h-14">
          <div className="w-1/4">
            {/* Left Side Placeholder - Ensure it's the same size as the right side to keep the title centered */}
          </div>
          <div className="flex-grow justify-center flex items-center">
            {title}
          </div>
          <div className="w-1/4 flex justify-end items-center">
            <div className="flex items-center justify-center cursor-pointer">
              <FaUserCog className="h-7 w-7 text-xl"/>
            </div>
          </div>
      
            
        </nav>
    </div>
  );
};

export default TopBar;