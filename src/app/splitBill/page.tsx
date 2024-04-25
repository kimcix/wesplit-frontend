'use client';
import React, { ChangeEvent, ChangeEventHandler, useEffect, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'
import { useRouter } from 'next/navigation';
import SocketClient from '../components/socket';
import Popup from '../components/popupWindow';

const SplitBill = () => {
    const username = localStorage.getItem('username');
    const my_name = !username? ' ' : username;

    const router = useRouter();
    if (!username) {
        // router.push('/login');
    }

    const [masterBillName, setMasterBillName] = useState('');
    const [inputMethod, setInputMethod] = useState('total');
    const [splitMethod, setSplitMethod] = useState('equal');
    const [totalAmount, setTotalAmount] = useState(0);

    // const [contacts, setContacts] = useState<{
    //     pinned:{
    //         individual_contacts: { id: Number, name: string }[],
    //         group_contacts:{ group_id: number, name: string, members: { id: Number, name: string }[]}[]
    //     },
    //     others:{    
    //         individual: { name: string }[],
    //         group:{ id: number, name: string, members: { id: Number, name: string }[]}[]
    //     } 
    // }>({pinned:{
    //         individual: [],
    //         group:[]
    //     },
    //     others:{    
    //         individual: [],
    //         group:[]
    //     } 
    // });

    const [contacts, setContacts] = useState<any[]>([])

    const [assignedTotal, setAssignedTotal] = useState(0);
    const [contactLoaded, setContactLoaded] = useState(false);

    const [showContacts, setShowContacts] = useState(true);
    const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);

    // indicate if the split configure is valid 
    const [configureState, setConfigureState] = useState(true);

    const [items, setItems] = useState<{ name: string, unitPrice: number, amount: number }[]>([]); 

    const [selectedUsers, setSelectedUsers] = useState<{ name: string, value: number }[]>([{name: my_name, value: 0}]);

    function switchShowContacts() {
        if (showContacts) {
            setShowContacts(false);
        } else {
            setShowContacts(true);
        }
    }

    const addUser = (userName: string) => {
        setSelectedUsers(prevUsers => {
            if (!prevUsers.find(user => user.name === userName)) {
                return [...prevUsers, { name: userName, value: 0 }];
            } else {
                return prevUsers;
            }
        });
    };

    const removeUser = (userName: string) => {
        setSelectedUsers(selectedUsers.filter(user => user.name !== userName));
    };

    const addGroup = (type: string, groupId: number) => {
        const group = contacts[type as keyof typeof contacts].group_contacts.find((group : any) => group.group_id === groupId);
        if (group) {
            group.members.forEach((member : any) => addUser(member.name));
        }
    };

    function handleBillNameChange(event: ChangeEvent<HTMLInputElement>) {
        setMasterBillName(event.target.value);
    }

    function handleInputMethodChange(event: ChangeEvent<HTMLSelectElement>) {
        setInputMethod(event.target.value);
        setTotalAmount(0);
        setItems([{ name: '', unitPrice: 0.0, amount: 0 }]);
        setParticipantsValue(0);
    }

    function handleSplitMethodChange(event: ChangeEvent<HTMLSelectElement>) {
        setSplitMethod(event.target.value);
        setParticipantsValue(0);
    }

    function handleTotalAmountChange(event: ChangeEvent<HTMLInputElement>) {
        const parsedValue = event.target.value.trim() !== '' ? parseFloat(event.target.value) : 0;
        setTotalAmount(parsedValue);
        console.log(event.target.value)
    }

    function calcItemTotal() {
        setTotalAmount(items.reduce((acc, item) => {
            if (item.name.trim() !== '') {
                return acc + (item.unitPrice * item.amount);
            }
            return acc;
        }, 0));
    }

    function calcAssignedTotal() {
        setAssignedTotal(selectedUsers.reduce((acc, user) => {
            return acc + user.value;
        }, 0));
        console.log("calc total: ", assignedTotal)
    }    

    function handleItemNameChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newItems = [...items];
        newItems[index].name = event.target.value;
        setItems(newItems);
        calcItemTotal();
    }

    function handleUnitPriceChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newItems = [...items];
        newItems[index].unitPrice = event.target.value.trim() !== '' ? parseFloat(event.target.value) : 0;
        setItems(newItems);
        calcItemTotal();
    }

    function handleAmountChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newItems = [...items];
        const parsedValue = event.target.value.trim() !== '' ? parseInt(event.target.value, 10) : 0;
        if (isNaN(parsedValue) && parsedValue !== 0) {
            // Handle the error, e.g., show an error message
            console.error('Invalid input for amount:', event.target.value);
            return;
        }        
        newItems[index].amount = parsedValue;
        setItems(newItems);
        calcItemTotal();
    }

    function handleAddItem() {
        setItems([...items, { name: '', unitPrice: 0.0, amount: 0 }]);
    }

    function handleRemoveItem(index: number) {
        if (items.length == 1) {
            setItems([{ name: '', unitPrice: 0.0, amount: 0 }]);
            return;
        }
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    }    

    function setParticipantsValue(value: number) {
        selectedUsers.forEach(usr => {usr.value = value});
    }

    function validateSplit() {
        calcAssignedTotal();
        if ((splitMethod === 'amount' && assignedTotal !== totalAmount) ||
            (splitMethod === 'percentage' && assignedTotal !== 100)) {
                console.log("set false")
                setConfigureState(false);
        } else {
            console.log(splitMethod)
            setConfigureState(true);
        }
        console.log(assignedTotal, totalAmount, configureState)
    }

    function handlePercentageChange(userName: string, event: ChangeEvent<HTMLInputElement>) {
        console.log("percentage changed", userName, event.target.value)
        setSelectedUsers(prevUsers => {
            if (prevUsers.find(user => user.name === userName)) {
                var parsedValue = event.target.value.trim() !== '' ? parseInt(event.target.value, 10) : 0;
                if (parsedValue > 100) {
                    parsedValue = 100;
                }
                return prevUsers.map(user =>
                    user.name === userName ? { name: userName, value: parsedValue } : user
                );
            } 
            else {
                return prevUsers;
            }
        });
        console.log(selectedUsers)
    }

    const getContacts = async () => {      
        // const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await fetch('http://localhost:5002/contacts/all/' + my_name, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Pass the authentication token
          }
        });
        if (!response.ok) {
            throw new Error('Failed to retrieve user contacts');
        }
        const data = await response.json();

        setContacts(data)
        return data;
    };

    const createSplitBill = async () => {
        if (splitMethod === 'equal') {
            setParticipantsValue(parseFloat((totalAmount / selectedUsers.length).toFixed(2)));
        }        
        // const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await fetch('http://localhost:5005/splitBill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Pass the authentication token
          },
          body: JSON.stringify({ 
                    masterBillName:     masterBillName === '' ? 'Split Bill' : masterBillName,
                    creator:            my_name,
                    masterBillTotal:    totalAmount,
                    splitMethod:        splitMethod,
                    assignment:         selectedUsers
                 }) 
        });
    
        if (response.ok) {
          const res = await response.json();
          console.log('split bill created', res['id']);
        } else {
          console.error('Failed to create split bill');
        }
      };

    useEffect(() => {
        // Connect to socket
        SocketClient.connect();
        SocketClient.on("new-notification-history", data => {
            if (data.username === username) {
                // Display a notification pop-up window
                console.log("socket data: ", data);
                if (data.inAppNotificationsEnabled) {
                    setNotification({title: data.notificationTitle, body: data.notificationBody});
                    setTimeout(() => {
                        setNotification(null);
                    }, 3000);
                }
            }
        });

        getContacts();

        // Any clean-up code can go here
        return () => {
            SocketClient.close();
        };
    }, [])

    useEffect(() => {
        validateSplit();
    }, [items, selectedUsers, totalAmount, inputMethod, splitMethod])

  return (
    <div>
        <TopBar title="Split Bill" />

        {notification && <Popup title={notification.title} body={notification.body} />}

        <div className="flex flex-col mx-4">
            <div className="mt-16 text-lg font-bold">Create New Split Bill:</div>
            <label className="mt-2 inline-flex items-center cursor-pointer flex flex-row justify-between w-full">
                <span className="font-bold text-gray-700">Bill Name: </span>
                <input
                    style={{width : '75%'}}
                    type="string"
                    placeholder='Short Description'
                    value={masterBillName}
                    onChange={e => handleBillNameChange(e)}
                />
            </label>
            <div className='mt-2'>
                <label className="inline-flex items-center cursor-pointer flex flex-row justify-between w-full">
                    <span className="font-bold text-gray-700">Input Master Bill:</span>
                    <select 
                        id="input-method"
                        onChange={handleInputMethodChange}>
                        <option value="total">Total Amount</option>
                        <option value="item">Item List</option>
                    </select>
                </label>
                {inputMethod === 'total' && (
                    <div className='w-full'>
                        <input 
                            type="number" 
                            placeholder="Enter total amount" 
                            min={0}
                            step="0.01"
                            value={totalAmount > 0 ? totalAmount.toString() : ''}
                            onChange={handleTotalAmountChange}
                            className="mt-3 p-2 border border-gray-300 rounded-md"
                        />                        
                    </div>
                )}
                {inputMethod === 'item' && (
                    <div className='mt-2'>
                        <div className='border border-gray-300 rounded-md w-full'>
                            <div className='h-[20vh] overflow-y-scroll'>
                                <table>
                                    <tbody>                    
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{width : '50%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="text"
                                                        placeholder='Item Name'
                                                        value={item.name}
                                                        onChange={(e) => handleItemNameChange(index, e)}
                                                    />
                                                </td>
                                                <td style={{width : '25%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="number"
                                                        step="0.01"
                                                        placeholder='Unit Price'
                                                        value={item.unitPrice > 0 ? item.unitPrice.toString() : ''}
                                                        onChange={(e) => handleUnitPriceChange(index, e)}
                                                    />
                                                </td>
                                                <td style={{width : '20%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="number"
                                                        placeholder='Amount'
                                                        value={item.amount > 0 ? item.amount.toString() : ''}
                                                        onChange={(e) => handleAmountChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="mx-1 px-1 border border-gray-300 rounded-md"
                                                        onClick={() => handleRemoveItem(index)}> X</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>                            
                            </div>                            
                        </div>
                        <div>Note: Item with empty field will be ingored.</div>                     
                        <div className='mt-2 flex flex-row justify-between items-center'>
                            <div className="border border-gray-300 rounded-md w-60">
                                Calculated Total: {items.reduce((acc, item) => {
                                    if (item.name.trim() !== '') {
                                        return acc + (item.unitPrice * item.amount);
                                    }
                                    return acc;
                                }, 0)}                                
                            </div>                             
                            <button 
                                className="border border-gray-300 rounded-md"
                                onClick={handleAddItem}>Add Item</button>                           
                        </div>                                            
                    </div>
                )}
            </div>

            <label className="mt-2 inline-flex items-center cursor-pointer flex flex-row justify-between w-full">
                <span className="font-bold text-gray-700">Choose Split Method:</span>
                <select 
                    id="split-method"
                    onChange={handleSplitMethodChange}
                    >
                    <option value="equal">Equally</option>
                    <option value="percentage">Specify Percentage</option>
                    <option value="amount">Specify Amount</option>
                    <option value="items" disabled>More Comming</option>
                </select>
            </label>            

            <div className='mt-2 flex flex-row justify-between items-center'>
                <div className="text-lg font-bold">Select participants:</div>
                <button 
                                className="border border-gray-300 rounded-md"
                                onClick={switchShowContacts}>{showContacts ? 'Hide Contacts' : 'Show Contacts'}</button>                 
            </div>
            <div className="h-[20vh] overflow-y-scroll border border-gray-300 rounded-md ">
                <table>                   
                    <tbody>
                        {selectedUsers.map(user => (
                            <tr key={user.name}>
                                <td style={{width : '30%'}}>{user.name === my_name ? 'You' : user.name}</td>
                                <td style={{width : '70%'}}>
                                    {splitMethod === "equal" && 
                                        <div>Amount: {totalAmount > 0 ? (totalAmount / selectedUsers.length).toFixed(2): 'NA'}</div>
                                    }
                                    {splitMethod === "percentage" && 
                                        <input
                                            style={{width : '80%'}}
                                            type="number"
                                            step="1"
                                            min={0}
                                            max={100}
                                            placeholder='Precentage'
                                            value={selectedUsers.find(usr => usr.name === user.name)?.value || ''}
                                            onChange={e => handlePercentageChange(user.name, e)}
                                        />                                            
                                    }
                                    {splitMethod === "amount" && 
                                        <input
                                            style={{width : '80%'}}
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            placeholder='amount'
                                            value={selectedUsers.find(usr => usr.name === user.name)?.value || ''}
                                            onChange={e => handlePercentageChange(user.name, e)}
                                        />                                            
                                    }                                    
                                </td>                                
                                <td>{user.name !== my_name && <button onClick={() => removeUser(user.name)}>X</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showContacts && <div className="mt-2 max-h-[20vh] overflow-y-scroll border border-gray-300 rounded-md ">
                {Object.keys(contacts).map(category => (
                    <div key={category}>
                        <h2>{category}</h2>
                        {contacts[category as keyof typeof contacts].group_contacts.map((group : any) => (
                            <table key={group.group_id}>
                                <tbody>
                                    <tr>
                                        <td style={{width : '100%'}}>{group.name}</td>
                                        <td><button onClick={() => addGroup(category, group.group_id)}>Add</button></td>
                                    </tr>
                                    {group.members.map((member : any) => (
                                        <tr key={member.name}>
                                            <td>---{member.name}</td>
                                            <td><button onClick={() => addUser(member.name)}>Add</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ))}
                        {/* {contacts[category as keyof typeof contacts].individual.length > 0 && ( */}
                            <table>
                                <tbody>
                                    {contacts[category as keyof typeof contacts].individual_contacts.map((individual : any) => (
                                        <tr key={individual.name}>
                                            <td style={{width : '100%'}}>{individual.name}</td>
                                            <td><button onClick={() => addUser(individual.name)}>Add</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        {/* )} */}
                    </div>
                ))}
            </div>}

            {(!configureState || totalAmount === 0) && 
                <div className='mt-2 border border-red-300 rounded-md'>
                    <div className='flex flex-row justify-center'>Configuration Error:</div>
                    {totalAmount === 0 && (<div className='flex flex-row justify-center'>Master Bill Total Amount Cannot Be 0!</div>)}
                    {!configureState && 
                        <div className='flex flex-row justify-center'>
                            {splitMethod === "amount" && 'Totoal Assigned Amount Not Match Master Bill'}
                            {splitMethod === "percentage" && 'Totoal Assigned percantege Not 100%'}
                        </div>
                    }
                </div>
            }            

            <button className='mt-2 border border-gray-300 rounded-md' disabled={!configureState || totalAmount === 0} onClick={createSplitBill}>Split It!</button>

        </div>
        <div className='mb-20'></div>
        <BottomNavBar />

    </div>
    
  );
};

export default SplitBill;