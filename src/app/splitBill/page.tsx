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


    function handleOptionChange(event: ChangeEvent<HTMLSelectElement>) {
        setInputMethod(event.target.value);
        // Reset the total amount and items when the input method changes
        setTotalAmount('');
        setItems([]);
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
        newItems[index].unitPrice = event.target.value.trim() !== '' ? parseFloat(event.target.value) : 2.33;
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
                        onChange={handleOptionChange}>
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
                        {items.map((item, index) => (
                            <div key={index} className="mt-3 space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="Item name" 
                                    value={item.name}
                                    onChange={(e) => handleItemNameChange(index, e)}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Unit price" 
                                    // value={item.unitPrice}
                                    onChange={(e) => handleUnitPriceChange(index, e)}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Amount" 
                                    // value={item.amount}
                                    onChange={(e) => handleAmountChange(index, e)}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                        ))}
                        <button 
                            onClick={handleAddItem} 
                            className="mt-3 p-2 bg-blue-500 text-white rounded-md"
                        >
                            Add Item
                        </button>
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
                    onChange={handleOptionChange}>
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