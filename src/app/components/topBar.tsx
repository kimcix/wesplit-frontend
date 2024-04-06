import { title } from 'process';
import React from 'react';

interface TopBarProps {
    title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div>
        <nav className="fixed top-0 left-0 right-0 bg-gray-600 p-4 flex justify-around font-bold text-xl h-14">
            {title}
        </nav>
    </div>
  );
};

export default TopBar;