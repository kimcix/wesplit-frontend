'use client';
import { ChangeEvent, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'


// const [selectedOption, setSelectedOption] = useState<string>("percentage");

const handleOptionChange = (option: string) => {
    console.log("Split Bill Method: " + option);
};

// const HandleSMSNotificationToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     console.log("SMS notification toggle value: " + event.target.checked);
// };

const HomePage = () => {
  return (
    <div>
        <TopBar title="Split Bill" />

        <div className="flex flex-col ml-4">
            <div className="mt-20 text-lg font-bold">Input the master bill:</div>
            <select id="split-method">
                <option value="total">By Total</option>
                <option value="item">By Item</option>
                {/* <option value="individual">Individual Items</option> */}
            </select>


            <div className="mt-20 text-lg font-bold">Choose Split Method:</div>

            {/* <label for="split-method">Choose Split Method:</label> */}
            <select id="split-method">
                <option value="equally">Equally</option>
                <option value="percentage">By Percentage</option>
                <option value="individual">Individual Items</option>
            </select>

            {/* <label className="inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox"
                    // checked={true} // Set the default value here
                    className="sr-only peer" 
                    onChange={HandleSMSNotificationToggleChange}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 font-medium text-gray-700">SMS notifications</span>
            </label> */}

        </div>

        <BottomNavBar />

    </div>
    
  );
};

export default HomePage;