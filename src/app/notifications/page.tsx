'use client';
import { ChangeEvent } from 'react';
import React, {useState, useEffect} from 'react';
import BottomNavBar from '../components/bottomNavigationBar';
import TopBar from '../components/topBar';
import SocketClient from '../components/socket';
import Popup from '../components/popupWindow';

const apiPrefix = 'http://127.0.0.1:5000';

interface NotificationHistory {
    notificationBody: string;
    notificationTime: string;
    notificationTitle: string;
    username: string;
}

const HomePage = () => {
    // TODO: Replace the placeholder below with the real username
    const username = 'unique22';
    const [userNotificationPreference, setUserNotificationPreference] = useState({
        inAppNotificationsEnabled: false,
        emailNotificationsEnabled: false,
        smsNotificationsEnabled: false
      });
    const [notificationHistories, setNotificationHistories] = useState<NotificationHistory[]>([]);
    const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);

    // Handler function to set user's notification preference
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

        // Manually update the local state to keep it consistent with DB state
        setUserNotificationPreference(prevSettings => ({...prevSettings, [checkboxValue]: isChecked}));
    };

    useEffect(() => {
        // Connect to socket
        SocketClient.connect();
        // Fetch user notification preferences
        const notificationPreferenceAPIRequestUrl = apiPrefix + '/notifications/settings?username=' + username;
        const fetchUserNotificationPreferences = async () => {
            const response = await fetch(notificationPreferenceAPIRequestUrl, {
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
            console.log('user notification preferences: ', data);
        };
        // Fetch user notification histories
        const notificationHistoryAPIRequestUrl = apiPrefix + '/notifications/histories?username=' + username;
        const fetchUserNotificationHistories = async () => {
            const response = await fetch(notificationHistoryAPIRequestUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
              });
            if (!response.ok) {
                throw new Error('Failed to retrieve user notification histories');
            }
            const data = await response.json();
            // Sort notification histories in descending order (latest first)
            data.sort((a: NotificationHistory, b: NotificationHistory) => {
                const timeA = new Date(a.notificationTime);
                const timeB = new Date(b.notificationTime);
                return timeB.getTime() - timeA.getTime();
            });
            setNotificationHistories(data)
            console.log('user notification histories: ', data);
        };
        // Retrieve initial user data
        fetchUserNotificationPreferences();
        fetchUserNotificationHistories();
        // Update the list of notification histories and display a popup window
        SocketClient.on("new-notification-history", data => {
            if (data.username === username) {
                fetchUserNotificationHistories();
                // Display a notification pop-up window
                console.log("socket data: ", data);
                setNotification({title: data.notificationTitle, body: data.notificationBody});
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            }
        });
        // Any clean-up code can go here
        return () => {
            SocketClient.close();
        };
      }, []);
    
    return (
        <div>
            <TopBar title="Notifications" />

            {notification && <Popup title={notification.title} body={notification.body} />}

            <div className="flex flex-col ml-4">
                <div className="mt-20 text-lg font-bold">Recent Notifications</div>
                {notificationHistories.length === 0 ? (
                    <p className="mt-4 mb-4 text-gray-700 font-bold">No Recent Notifications</p>
                ):(
                    <ul role="list" className="divide-y divide-gray-300 max-h-[50vh] overflow-y-scroll">
                        {notificationHistories.map((history, index) => (
                            <li key={index} className="flex justify-between gap-x-6 py-3">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="font-semibold leading-6 text-gray-700">{history.notificationTitle}</p>
                                        <p className="mt-1 truncate text-sm leading-5 text-gray-500">{history.notificationBody}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{(new Date(history.notificationTime)).toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
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