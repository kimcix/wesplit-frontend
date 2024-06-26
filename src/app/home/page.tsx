'use client';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'
import SocketClient from '../components/socket';
import Popup from '../components/popupWindow';
import { analysisAPIPrefix, contactAPIPrefix, billSplittingAPIPrefix, notificationAPIPrefix } from '../components/apiPrefix';


const HomePage = () => {
    const router = useRouter();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!username) {
        router.push('/login');
    }
    const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);
    const [contacts, setContacts] = useState([]);
    const [subBills, setSubBills] = useState<any[]>([]); // JSON objects for SubBills from db
    const [masterBills, setMasterBills] = useState<any[]>([]); // JSON objects for masterBills from db
    const [totalOwed, setTotalOwed] = useState<number>(0); // JSON objects for SubBills from db
    const [totalToPay, setTotalToPay] = useState<number>(0); // JSON objects for SubBills from db

    const getCurrentDate = (): string => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getSubBillDate = (billDate: string): string => {
        const datetime = (new Date(billDate)).toLocaleString();
        const date = datetime.split(',')[0];
        return date;
    }

    const getMasterBillDate = (time: string): string => {
        console.log("getMasterBillDate time: ", time);
        const date = new Date(time);
        console.log("getMasterBillDate date: ", date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return formattedDate;
    }

    const calculateBillsOwed = (masterBill: any): number => {
        let res = 0;
        masterBill.assignment.forEach((payer: any) => {
            if (payer.name !== username) {
                res += payer.value;
            }
        })
        return res;
    }

    useEffect(() => {
        // Connect to socket
        SocketClient.connect();
        // Fetch user sub bills (bills he/she owes)
        const subBillsAPIRequestUrl = analysisAPIPrefix + '/date_query?start_date=2020-01-01&end_date=' + getCurrentDate() + '&user=' + username;
        const fetchSubBills = async () => {
            const response = await fetch(subBillsAPIRequestUrl, {
                method: 'GET',
                headers: {
                'Contesnt-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve sub bills');
            }
            const res = await response.json();
            const raw = JSON.parse(res);
            const data = raw.filter((item: any) => item.creator !== username && !item.analytics['paid']);
            setSubBills(data);
            let toPay = 0;
            data.forEach((subBill: any) => {
                toPay += subBill.total;
            })
            console.log("subbill new balance: ", toPay);
            setTotalToPay(toPay);
            console.log('subBill data: ', data);
        };
        // Fetch user master bills (bills others owe he/she)
        const masterBillsAPIRequestUrl = billSplittingAPIPrefix + '/splitBill?creator=' + username;
        const fetchMasterBills = async () => {
            const response = await fetch(masterBillsAPIRequestUrl, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve master bills');
            }
            const data = await response.json();
            console.log('masterBill data: ', data);
            const filteredData = data.filter((item: any) => calculateBillsOwed(item) > 0);
            console.log('filtered masterBill data: ', filteredData);
            setMasterBills(filteredData);
            let owed = 0;
            filteredData.forEach((masterBill: any) => {
                owed += calculateBillsOwed(masterBill);
            })
            console.log("masterbill new balance: ", owed);
            setTotalOwed(owed);
        };
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
            const data = await response.json();
            setContacts(data);
            console.log('contacts data: ', data);
        };
        // Fetch (and create) notification settings
        const notificationSettingsAPIRequestUrl = notificationAPIPrefix + `/notifications/settings?username=${username}`;
        const fetchNotificationSettings = async () => {
            const response = await fetch(notificationSettingsAPIRequestUrl, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve notification settings');
            }
            const data = await response.json();
            console.log('notification settings data: ', data);
        };
        // API calls
        fetchSubBills();
        fetchMasterBills();
        fetchContacts();
        fetchNotificationSettings();
        // Display a notification pop-up window when a new notification is received
        SocketClient.on("new-notification-history", data => {
            if (data.inAppNotificationsEnabled) {
                setNotification({title: data.notificationTitle, body: data.notificationBody});
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            }
            fetchSubBills();
            fetchMasterBills();
        });
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
                {(totalOwed - totalToPay) < 0 ? (
                    <div className="text-red-700 mt-2 text-3xl font-bold">Owe ${(totalToPay - totalOwed).toFixed(2)}</div>
                ) : (
                    <div className="text-green-700 mt-2 text-3xl font-bold">Owed ${(totalOwed - totalToPay).toFixed(2)}</div>
                )}
                <div className="text-red-700 font-bold text-lg self-start mt-4 ml-4 mb-2">Bills To Pay</div>
                <div className="flex flex-row self-start mt-1 w-full">
                    {subBills.length === 0 ? (
                        <p className="mt-2 ml-4 text-gray-700 font-bold">No Bills to Pay</p>
                    ):(
                        <>
                            {subBills.slice(0, 3).map((subBill, index) => (
                                <div key={index} className="rounded-lg shadow-lg w-1/3 border mr-2">
                                    <div className="px-3 py-2">
                                        <div className="font-bold text-lg mb-1">{subBill.masterbill_name}</div>
                                        <p className="text-gray-500 text-base mb-1">you owe {subBill.creator} ${subBill.total}</p>
                                        <p className="text-gray-500 text-base">{getSubBillDate(subBill.creation_time['$date'])}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="text-green-700 font-bold text-lg self-start mt-6 ml-4 mb-2">Payments To Receive</div>
                <div className="flex flex-row self-start mt-1 w-full">
                    {masterBills.length === 0 ? (
                        <p className="mt-2 ml-4 text-gray-700 font-bold">No Payments to Receive</p>
                    ):(
                        <>
                            {masterBills.slice(0, 3).map((masterBill, index) => (
                                <div key={index} className="rounded-lg shadow-lg w-1/3 border">
                                    <div className="px-3 py-2">
                                        <div className="font-bold text-lg mb-1">{masterBill.masterBillName}</div>
                                        <p className="text-gray-500 text-base mb-1">you are owed ${calculateBillsOwed(masterBill)}</p>
                                        <p className="text-gray-500 text-base">{getMasterBillDate(masterBill.createAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center mb-2">
                <div className="font-bold text-yellow-500 text-lg self-start ml-4">Pinned Contacts</div>
            </div>

            <div className="ml-4 mr-4">
                { !contacts.pinned?.individual_contacts || contacts.pinned?.individual_contacts.length === 0 ? (
                        <p className="mt-2 ml-4 text-gray-700 font-bold ">No Pinned Contacts</p>
                    ):(
                        <>
                        {contacts.pinned.individual_contacts.map((contact, index) => (
                            <div key={contact.id} className="rounded-lg shadow-lg w-full border mb-4 p-2">
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
