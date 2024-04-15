import { useState } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

const HomePage = () => {
  return (
    <div>
        <TopBar title="Home" />

        <div className="flex flex-col items-center mb-8">
            <div className="mt-20 text-lg font-bold">Total Balance</div>
            {/* TODO: Replace with real data */}
            <div className="text-red-700 mt-1 text-3xl font-bold">Owed $230</div>  
            <div className="font-bold text-lg self-start mt-4 ml-4 mb-2">Recent Transactions</div>
            <div className="flex flex-row self-start justify-around mt-1 w-full">
                {/* TODO: Replace with real data */}
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-3 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-3 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
                <div className="rounded-lg shadow-lg w-1/3 border">
                    <div className="px-3 py-2">
                        <div className="font-bold text-lg mb-1">Evan</div>
                        <p className="text-gray-500 text-base mb-1">owes you $75</p>
                        <p className="text-gray-500 text-base">4/7/2024</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center mb-8">
            <div className="font-bold text-lg self-start mt-1 ml-4 mb-2">Group Transcations</div>
        </div>

        <BottomNavBar />

    </div>
    
  );
};

export default HomePage;
