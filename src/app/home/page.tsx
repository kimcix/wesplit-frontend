import { useState } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

const HomePage = () => {
  return (
    <div>
        <TopBar title="Home" />

        <div className="flex flex-col items-center">
            <div className="mt-20 text-lg font-bold">Total Balance</div>
            {/* TODO: Replace with real data */}
            <div className="text-green-500 text-lg font-bold mt-1 ">Owed $230</div>  
            <div className="font-bold text-lg self-start mt-4 ml-4">Recent Transactions</div>
            <div className="flex flex-row self-start justify-around mt-1 w-full">
                {/* TODO: Replace with real data */}
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-2 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-2 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-2 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
            </div>
        </div>

        <BottomNavBar />
    </div>
  );
};

export default HomePage;
