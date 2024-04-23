'use client';
import React, { ChangeEvent, ChangeEventHandler, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'


// const [selectedOption, setSelectedOption] = useState<string>("percentage");

// const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = event.target.value;
//     console.log("Selected value:", selectedValue);
// };

// const HandleSMSNotificationToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     console.log("SMS notification toggle value: " + event.target.checked);
// };

const contacts = {
    individual: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ],
    group: [
        { id: 4, name: 'Group 1', members: [
            { id: 5, name: 'Dave' },
            { id: 6, name: 'Eve' }
        ]},
        { id: 7, name: 'Group 2', members: [
            { id: 8, name: 'Frank' },
            { id: 9, name: 'Grace' }
        ]},
        { id: 10, name: 'Group 3', members: [
            { id: 11, name: 'Heidi' },
            { id: 12, name: 'Ivan' }
        ]}
    ]
};

const HomePage = () => {
    
    const [inputMethod, setInputMethod] = useState('total');
    const [splitMethod, setSplitMethod] = useState('equal');
    const [totalAmount, setTotalAmount] = useState('');
    const [items, setItems] = useState<{ name: string, unitPrice: number, amount: number }[]>([]); 

    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    function handleUserSelect(userId: number) {
        const user = contacts.individual.find(user => user.id === userId);
        if (user) {
            setSelectedUsers(prevUsers => {
                if (prevUsers.includes(userId)) {
                    return prevUsers.filter(id => id !== userId);
                } else {
                    return [...prevUsers, userId];
                }
            });
        } else {
            const group = contacts.group.find(group => group.id === userId);
            if (group) {
                setSelectedUsers(prevUsers => {
                    const groupMembers = group.members.map(member => member.id).filter(memberId => !prevUsers.includes(memberId));
                    return [...prevUsers, ...groupMembers];
                });
            }
        }
    }

    function handleInputMethodChange(event: ChangeEvent<HTMLSelectElement>) {
        setInputMethod(event.target.value);
        // Reset the total amount and items when the input method changes
        setTotalAmount('');
        setItems([{ name: '', unitPrice: 0.0, amount: 0 }]);
    }

    function handleSplitMethodChange(event: ChangeEvent<HTMLSelectElement>) {
        setSplitMethod(event.target.value);
        // // Reset the total amount and items when the input method changes
        // setTotalAmount('');
        // setItems([{ name: '', unitPrice: 0.0, amount: 0 }]);
    }

    function handleTotalAmountChange(event: ChangeEvent<HTMLInputElement>) {
        setTotalAmount(event.target.value);
    }

    function handleItemNameChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newItems = [...items];
        newItems[index].name = event.target.value;
        setItems(newItems);
    }

    function handleUnitPriceChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newItems = [...items];
        newItems[index].unitPrice = event.target.value.trim() !== '' ? parseFloat(event.target.value) : 0;
        setItems(newItems);
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

  return (
    <div>
        <TopBar title="Split Bill" />

        <div className="flex flex-col mx-4">
            <div className="mt-16 text-lg font-bold">Create New Split Bill:</div>
            <div>
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
                            type="text" 
                            placeholder="Enter total amount" 
                            value={totalAmount}
                            onChange={handleTotalAmountChange}
                            className="mt-3 p-2 border border-gray-300 rounded-md"
                        />                        
                    </div>
                )}
                {inputMethod === 'item' && (                   
                    <div>
                        <div className='border border-gray-300 rounded-md w-full'>
                            <table className='border-b border-gray-300 rounded-md w-full'>
                                <thead>
                                    <tr>
                                        <th style={{width : '50%'}}>Name</th>
                                        <th style={{width : '25%'}}>Unit Price</th>
                                        <th style={{width : '20%'}}>Amount</th>
                                        <th style={{width : '25%'}}></th>
                                    </tr>
                                </thead>
                            </table>
                            <div className='h-[20vh] overflow-y-scroll'>
                                <table>
                                    <tbody>                    
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{width : '50%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => handleItemNameChange(index, e)}
                                                    />
                                                </td>
                                                <td style={{width : '25%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="number"
                                                        step="0.01"
                                                        value={item.unitPrice}
                                                        onChange={(e) => handleUnitPriceChange(index, e)}
                                                    />
                                                </td>
                                                <td style={{width : '20%'}}>
                                                    <input
                                                        style={{width : '100%'}}
                                                        type="number"
                                                        value={item.amount}
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
                        <div style={{ textAlign: 'center' }}>
                            <button 
                                className="mt-2 px-1 border border-gray-300 rounded-md"
                                onClick={handleAddItem}>Add Item</button>
                        </div>                                            
                        <div className="mt-3 p-2 mb-2 border border-gray-300 rounded-md w-full">
                            Calculated Total Amount: {items.reduce((acc, item) => acc + (item.unitPrice * item.amount), 0)}
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
                    <option value="items">Specify Items</option>
                </select>
            </label>            

            <div className="mt-2 text-lg font-bold">Select participants from your contacts:</div>
            <div className="max-h-[20vh] overflow-y-scroll border border-gray-300 rounded-md ">
                <table className="w-full table-auto">
                    <tbody>
                        {contacts.individual.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                {/* <td>Individual</td> */}
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelect(user.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {contacts.group.map(group => (
                            <React.Fragment key={group.id}>
                                <tr>
                                    <td>{group.name}</td>
                                    {/* <td>Group</td> */}
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={group.members.every(member => selectedUsers.includes(member.id))}
                                            onChange={() => handleUserSelect(group.id)}
                                        />
                                    </td>
                                </tr>
                                {group.members.map(member => {
                                    return (
                                        <tr key={member.id}>
                                            <td>--{member.name}</td>
                                            {/* <td>Individual</td> */}
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(member.id)}
                                                    onChange={() => handleUserSelect(member.id)}
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

        <BottomNavBar />

    </div>
    
  );
};

export default HomePage;