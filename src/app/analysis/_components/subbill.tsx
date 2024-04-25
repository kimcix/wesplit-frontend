'use client'

import React, { useEffect, useState } from 'react';

interface SubBillProps {
  data: any
}


const SubBill: React.FC<SubBillProps> = ({ data }) => {
  const [localData, setLocalData] = useState<any>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  return (
    <div className="w-screen flex">
      <div className="group w-screen border-2 border-grey-400 border-solid mx-4 my-2 p-8 bg-white rounded-md p-4 flex flex-col justify-between leading-normal hover:bg-slate-200">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            Id: {localData["_id"]["$oid"]}
          </p>
          <span className="invisible rounded-md bg-sky-200 group-hover:visible">
            Edit Options
          </span>
          <div className="text-gray-900 font-bold text-xl mb-2">${localData['total'].toFixed(2)}</div>
          <p>Item list:</p>
          <div className="border-y">
            {localData['item_list'].map((item: string, index: number) => (
              <p key={index} className="m-2 text-gray-700 text-base">{item}</p>
            ))}
          </div>
        </div>
        <div>
          {localData['analytics']['paid'] ? 
            <span className='bg-green-400'>Paid</span> :
            <span className='bg-red-700'>Unpaid</span>
          }
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm">
            <p className="text-gray-900 leading-none">User: {localData['user_name']}</p>
            <p className="text-gray-600 right-0">Creation_time: {localData['creation_time']['$date']}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  export default SubBill;
