import { useState } from 'react';
import Image from 'next/image';
import BottomNavBar from '../components/navigationBar'

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
        <div className="font-bold text-xl mt-4">Home</div>
        <div className="mt-4">Total Balance</div>
        {/* TODO: Replace with real data */}
        <div className="text-green-500 mt-1">Owed $230</div>  
        <div className="font-bold text-lg self-start mt-4 ml-4">Recent Transactions</div>
        <div className="flex flex-row self-start justify-center">
            {/* TODO: Replace with real data */}
            <div className="rounded overflow-hidden shadow-lg w-1/3 p-2">
                <img className="w-full" src="/img_1.jpg" alt="Evan" />
                <div className="px-6 py-4">
                    <div className="font-bold text-lg mb-1">Evan</div>
                    <p className="text-gray-500 text-base">
                        owes you $75
                    </p>
                </div>
            </div>
            <div className="rounded overflow-hidden shadow-lg w-1/3 p-2">
            <img className="w-full" src="/img_1.jpg" alt="Evan" />
                <div className="px-6 py-4">
                    <div className="font-bold text-lg mb-1">Evan</div>
                    <p className="text-gray-500 text-base">
                        owes you $75
                    </p>
                </div>
            </div>
            <div className="rounded overflow-hidden shadow-lg w-1/3 p-2">
            <img className="w-full" src="/img_1.jpg" alt="Evan" />
                <div className="px-6 py-4">
                    <div className="font-bold text-lg mb-1">Evan</div>
                    <p className="text-gray-500 text-base">
                        owes you $75
                    </p>
                </div>
            </div>
        </div>

        <BottomNavBar />
    </div>
  );
};

export default HomePage;
