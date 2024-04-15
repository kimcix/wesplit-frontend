'use client';
import { ChangeEvent } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

const handleInAppNotificationToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("In-app notification toggle value: " + event.target.checked);
};

const handleEmailNotificationToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Email notification toggle value: " + event.target.checked);
};

const HandleSMSNotificationToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("SMS notification toggle value: " + event.target.checked);
};

const HomePage = () => {
  return (
    <div>
        <TopBar title="Notifications" />

        <div className="flex flex-col ml-4">

            <div className="mt-20 text-lg font-bold">Recent Notifications</div>

            <ul role="list" className="divide-y divide-gray-300 max-h-[50vh] overflow-y-scroll">
                <li className="flex justify-between gap-x-6 py-3">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold leading-6 text-gray-700">Leslie Alexander</p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">leslie.alexander@example.com</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">4/24/2024</p>
                        </div>
                    </div>
                </li>
                <li className="flex justify-between gap-x-6 py-3">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold leading-6 text-gray-700">Leslie Alexander</p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">leslie.alexander@example.com</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">4/24/2024</p>
                        </div>
                    </div>
                </li>
                <li className="flex justify-between gap-x-6 py-3">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold leading-6 text-gray-700">Leslie Alexander</p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">leslie.alexander@example.com</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">4/24/2024</p>
                        </div>
                    </div>
                </li>
                <li className="flex justify-between gap-x-6 py-3">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold leading-6 text-gray-700">Leslie Alexander</p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">leslie.alexander@example.com</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">4/24/2024</p>
                        </div>
                    </div>
                </li>
                <li className="flex justify-between gap-x-6 py-3">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold leading-6 text-gray-700">Leslie Alexander</p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">leslie.alexander@example.com</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">4/24/2024</p>
                        </div>
                    </div>
                </li>
            </ul>

            <div className="mt-4 mb-4 text-lg font-bold">Notification Methods</div>

            <label className="inline-flex items-center cursor-pointer mb-4">
                <input 
                    type="checkbox"
                    // checked={true} // Set the default value here
                    className="sr-only peer" 
                    onChange={handleInAppNotificationToggleChange}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 font-medium text-gray-700">In-app notifications</span>
            </label>
            <label className="inline-flex items-center cursor-pointer mb-4">
                <input 
                    type="checkbox"
                    // checked={true} // Set the default value here
                    className="sr-only peer" 
                    onChange={handleEmailNotificationToggleChange}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 font-medium text-gray-700">Email notifications</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox"
                    // checked={true} // Set the default value here
                    className="sr-only peer" 
                    onChange={HandleSMSNotificationToggleChange}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 font-medium text-gray-700">SMS notifications</span>
            </label>

        </div>

        <BottomNavBar />

    </div>
    
  );
};

export default HomePage;