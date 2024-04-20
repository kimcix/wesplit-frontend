'use client';
import { ChangeEvent, ChangeEventHandler, useState  } from 'react';
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

const HomePage = () => {
    
    const [inputMethod, setInputMethod] = useState('total');
    const [totalAmount, setTotalAmount] = useState('');
    const [items, setItems] = useState<{ name: string, unitPrice: number, amount: number }[]>([]); 


    function handleSplitMethodChange(event: ChangeEvent<HTMLSelectElement>) {
        setInputMethod(event.target.value);
        // Reset the total amount and items when the input method changes
        setTotalAmount('');
        setItems([{ name: '', unitPrice: 0.0, amount: 0 }]);
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

        <div className="flex flex-col ml-4">
            <div className="mt-20 text-lg font-bold">Input the master bill:</div>
            <div>
                <label className="inline-flex items-center cursor-pointer flex flex-row justify-between w-full">
                    <span className="font-bold text-gray-700">Input Master Bill:</span>
                    <select 
                        id="input-method"
                        onChange={handleSplitMethodChange}>
                        <option value="total">Total Amount</option>
                        <option value="item">Item List</option>
                    </select>
                </label>
                {inputMethod === 'total' && (
                    <input 
                        type="text" 
                        placeholder="Enter total amount" 
                        value={totalAmount}
                        onChange={handleTotalAmountChange}
                        className="mt-3 p-2 border border-gray-300 rounded-md w-full"
                    />
                )}
                {inputMethod === 'item' && (                   
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width : '50%'}}>Name</th>
                                    <th style={{width : '20%'}}>Unit Price</th>
                                    <th style={{width : '20%'}}>Amount</th>
                                    <th style={{width : '25%'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                style={{width : '100%'}}
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleItemNameChange(index, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                style={{width : '100%'}}
                                                type="number"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(e) => handleUnitPriceChange(index, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                style={{width : '100%'}}
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => handleAmountChange(index, e)}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleRemoveItem(index)}>remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>   
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={handleAddItem}>Add Item</button>
                        </div>                                            
                        <div className="mt-3 p-2 border border-gray-300 rounded-md w-full">
                            Total Amount: {items.reduce((acc, item) => acc + (item.unitPrice * item.amount), 0)}
                        </div>
                    </div>
                )}
            </div>

            {/* <div className="mt-20 text-lg font-bold">Choose Split Method:</div> */}
            <label className="inline-flex items-center cursor-pointer flex flex-row justify-between w-full">
                <span className="font-bold text-gray-700">Choose Split Method:</span>
                <select 
                    id="split-method"
                    onChange={handleSplitMethodChange}>
                    <option value="equally">Equally</option>
                    <option value="percentage">By Percentage</option>
                    <option value="individual">Individual Items</option>
                </select>
            </label>            

        </div>

        <BottomNavBar />

    </div>
    
  );
};

export default HomePage;