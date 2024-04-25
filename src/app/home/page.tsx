'use client';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'
import SocketClient from '../components/socket';
import Popup from '../components/popupWindow';
import { analysisAPIPrefix, contactAPIPrefix } from '../components/apiPrefix';


const HomePage = () => {
    const router = useRouter();
   
    const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);
    const [subBills, setSubBills] = useState<any[]>([]);
    const [contacts, setContacts] = useState([]);
    

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!username) {
        router.push('/login');
    }

    const getCurrentDate = (): string => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

    const getBillDate = (billDate: string): string => {
        const datetime = (new Date(billDate)).toLocaleString();
        const date = datetime.split(',')[0];
        return date;
    }

    useEffect(() => {
        // Connect to socket
        SocketClient.connect();
        // Display a notification pop-up window when a new notification is received
        SocketClient.on("new-notification-history", data => {
            if (data.inAppNotificationsEnabled) {
                setNotification({title: data.notificationTitle, body: data.notificationBody});
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            }
        });
        // Fetch user sub bills
        // TODO: Change the user below
        const subBillsAPIRequestUrl = analysisAPIPrefix + '/date_query?start_date=2020-01-01&end_date=' + getCurrentDate() + '&user=2fa3';
        const fetchSubBills = async () => {
            const response = await fetch(subBillsAPIRequestUrl, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve sub bills');
            }
            const res = await response.json();
            const data = JSON.parse(res);
            setSubBills(data);
            console.log('subBill data: ', data);
            console.log('getCurrentDate: ', getCurrentDate())
        };
        // API calls
        fetchSubBills();

        // Fetch user contacts
        const contactsAPIRequestUrl = contactAPIPrefix + `/contacts/all/${username}`;
        const fetchContacts = async () => {
            const response = await fetch(contactsAPIRequestUrl, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve contacts');
            }
            // console.log('response: ', response);
            // const res = await response.json();
            // console.log('res: ', res);
            // console.log('data', JSON.parse(res));
            // const data = JSON.parse(res);
            const data = await response.json();
            setContacts(data);
            console.log('contacts data: ', data);
        };
        fetchContacts();
        console.log('contacts: ', contacts);
        // Any clean-up code can go here
        return () => {
            SocketClient.close();
        };
    }, []);

    return (
        <div>
            <TopBar title="Home" />

            {notification && <Popup title={notification.title} body={notification.body} />}

            <div className="flex flex-col items-center mb-8">
                <div className="mt-20 text-lg font-bold">Total Balance</div>
                {/* TODO: Replace with real data */}
                <div className="text-red-700 mt-2 text-3xl font-bold">Owed $230</div>  
                <div className="font-bold text-lg self-start mt-4 ml-4 mb-2">Recent Transactions</div>
                <div className="flex flex-row overflow-x-auto self-start mt-1 w-full ml-4">
                    {/* TODO: Change subBills below to be recent transactions (that include master bills*/}
                    {subBills.length === 0 ? (
                        <p className="mt-2 ml-4 text-gray-700 font-bold">No Recent Transactions</p>
                    ):(
                        <>
                            {subBills.map((subBill, index) => (
                                <div key={index} className="rounded-lg shadow-lg w-1/3 border mr-2">
                                    <div className="px-3 py-2">
                                        <div className="font-bold text-lg mb-1">{subBill.creator}</div>
                                        <p className="text-gray-500 text-base mb-1">you owe ${subBill.total}</p>
                                        <p className="text-gray-500 text-base">{getBillDate(subBill.creation_time['$date'])}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="font-bold text-lg self-start mt-1 ml-4 mb-2">Your Pinned Contacts</div>
            </div>

            <div className="ml-4 mr-4">
                { !contacts.pinned?.individual_contacts || contacts.pinned?.individual_contacts.length === 0 ? (
                        <p className="mt-2 ml-4 text-gray-700 font-bold ">No Pinned Contacts</p>
                    ):(
                        <>
                        {contacts.pinned.individual_contacts.map((contact, index) => (
                            <div key={contact.id} className="rounded-lg shadow-lg w-full border mb-4 p-4">
                            <div className="font-bold text-lg mb-1">{contact.name}</div>
                            <div>{contact.email}</div>
                            {/* Include other details as needed */}
                            </div>
                        ))}
                        </>
                    )}
                </div>

            <BottomNavBar />

        </div>
        
    );
};

export default HomePage;
