import React from 'react';

interface SubBillProps {
  data: any
}


const SubBill: React.FC<SubBillProps> = ({ data }) => {
    return (
      <div className="w-screen flex">
        <div className="w-screen border-2 border-grey-400 border-solid m-1 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center">
              Id: {data["_id"]["$oid"]}
            </p>
            <div className="text-gray-900 font-bold text-xl mb-2">${data['total'].toFixed(2)}</div>
            <p>Item list:</p>
            <div className="border-y">
              {data['item_list'].map((item: string, index: number) => (
                <p key={index} className="m-2 text-gray-700 text-base">{item}</p>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">User: {data['user_name']}</p>
              <p className="text-gray-600">Creation_time: {data['creation_time']['$date']}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SubBill;
