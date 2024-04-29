'use client'

import React, { useEffect, useState } from 'react';

interface SubBillProps {
  subdata: any
}


const SubBill: React.FC<SubBillProps> = ({ subdata }) => {

  return (
    <div className="w-screen flex">
      <div className={`group w-screen border-2 ${subdata["analytics"]["paid"] ? 'bg-green-100' : 'bg-red-100'} border-grey-400 border-solid mx-4 my-2 p-8 bg-white rounded-md p-4 flex flex-col justify-between leading-normal hover:bg-slate-200`}>
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            Bill Name: {subdata["masterbill_name"]}
          </p>
          <span className="invisible block w-100 rounded-md bg-sky-200 group-hover:visible">
            Edit Options
          </span>
          <div className="text-gray-900 font-bold text-xl mb-2">${subdata['total'].toFixed(2)}</div>
          <p>Item list:</p>
          <div className="border-y">
            {subdata['item_list'].map((item: string, index: number) => (
              <p key={index} className="m-2 text-gray-700 text-base">{item}</p>
            ))}
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-sm">
            <p className="text-gray-900 leading-none">Owner: {subdata['creator']}</p>
            <p className="text-gray-600 right-0">Creation Time: {(new Date(subdata['creation_time']['$date'])).toLocaleDateString()}</p>
            </div>
            <div>
            {subdata['analytics']['paid'] ? 
              <span className='block w-100 rounded-md bg-green-400'>Paid</span> :
              <span className='block w-100 rounded-md bg-red-400'>Unpaid</span>}
            </div>
            <p className='mt-1'>Tags list:</p>
            <div className='border-y'>
              {(subdata['analytics']['tags'].length > 0) && (subdata['analytics']['tags'].map((tag:string, key:number) =>
                <span key={key} className='block w-11/12 my-1 py-1 rounded-lg bg-yellow-200'>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  export default SubBill;
