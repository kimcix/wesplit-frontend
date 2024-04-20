'use client';
import { ChangeEvent } from 'react';
import React, {useState, useEffect} from 'react';
import BottomNavBar from '../components/bottomNavigationBar';
import TopBar from '../components/topBar';
import SocketClient from '../components/socket';

const apiPrefix = 'http://127.0.0.1:5000';

const HomePage = () => {
    // TODO: Replace the placeholder below with the real username
    const username = 'unique';
    const [userNotificationPreference, setUserNotificationPreference] = useState({
        inAppNotificationsEnabled: false,
        emailNotificationsEnabled: false,
        smsNotificationsEnabled: false
      });

    // Set user's notification preference
    const handleNotificationToggleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const checkboxValue = event.target.value;
        const isChecked = event.target.checked;
        const apiRequestUrl = apiPrefix + '/notifications/settings?username=' + username;
        const requestBody = {
            'notificationPreference': checkboxValue,
            'isEnabled': isChecked,
          };
        const response = await fetch(apiRequestUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          if (!response.ok) {
            throw new Error('Failed to update user notification preferences');
          }
        console.log(checkboxValue + " toggle value: " + isChecked);

        // Manually update the local state to keep it consistent with DB state
        setUserNotificationPreference(prevSettings => ({...prevSettings, [checkboxValue]: isChecked}));
    };

    // Get the initial user notification preference 
    useEffect(() => {
        SocketClient.connect();
        SocketClient.on("new-notification-history", data => {
            console.log("socket data: ", data);
        });

        const apiRequestUrl = apiPrefix + '/notifications/settings?username=' + username;
        const fetchData = async () => {
            const response = await fetch(apiRequestUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
              });
            if (!response.ok) {
                throw new Error('Failed to retrieve user notification preferences');
            }
            const data = await response.json();
            setUserNotificationPreference({
                inAppNotificationsEnabled: data.inAppNotificationsEnabled,
                emailNotificationsEnabled: data.emailNotificationsEnabled,
                smsNotificationsEnabled: data.smsNotificationsEnabled
            })
            console.log('data: ', data);
            console.log('userNotificationPreference: ', userNotificationPreference);
        };
        // Call the fetchData function when the component mounts
        fetchData();
        // Any clean-up code can go here
        return () => {
            SocketClient.close();
        };
      }, []);
    
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

                <div className="mt-4 mb-4 text-lg font-bold">Notification Preferences</div>

                <label className="inline-flex items-center cursor-pointer mb-4">
                    <input 
                        type="checkbox"
                        checked={userNotificationPreference.inAppNotificationsEnabled} // Set the default value here
                        value="inAppNotificationsEnabled"
                        className="sr-only peer" 
                        onChange={handleNotificationToggleChange}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 font-medium text-gray-700">In-app notifications</span>
                </label>
                <label className="inline-flex items-center cursor-pointer mb-4">
                    <input 
                        type="checkbox"
                        checked={userNotificationPreference.emailNotificationsEnabled} // Set the default value here
                        value="emailNotificationsEnabled"
                        className="sr-only peer" 
                        onChange={handleNotificationToggleChange}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 font-medium text-gray-700">Email notifications</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox"
                        checked={userNotificationPreference.smsNotificationsEnabled} // Set the default value here
                        value="smsNotificationsEnabled"
                        className="sr-only peer" 
                        onChange={handleNotificationToggleChange}
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