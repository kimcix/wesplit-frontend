'use client'

import { analysisAPIPrefix } from '@/app/components/apiPrefix';
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';

interface TagEditorProps {
    onPostSubmit: any;
    data: any;
}

const TagEditor: React.FC<TagEditorProps> = ({ onPostSubmit, data }) => {
    const [tags, setTags] = useState<Set<string>>(new Set(data['analytics']['tags']));
    const [tagList, setTagList] = useState<any[]>([]);
    const [paid, setPaid] = useState<boolean>(data['analytics']['paid']);
    const [paymentTime, setPaymentTime] = useState<string>("");
    const [paybackInterval, setPaybackInterval] = useState<number>(0.0);

    useEffect(() => {
        const uri = analysisAPIPrefix + `/fetch_tags`

        fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',              
              }
        })
        .then((response) => {
            if (response.status !== 200) {
                console.log(`Status ${response.status} occured`)
                return
            }
            else {
                return response.json()
            }
        })
        .then((json_data) => {
            setTagList(json_data);
        })
        .catch((e) => {
            console.log(`Fetch error: ${e}`)
        })
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const uri = analysisAPIPrefix + `/update_analytics`;
        const user = localStorage.getItem('username');
        
        let data_copy = structuredClone(data);

        fetch(uri, {
            method: "POST",
            body: JSON.stringify({
                subBillId: data["_id"]["$oid"],
                newTags: Array.from(tags),
                newPayment: {
                    paid: paid,
                    payment_time: paymentTime,
                    payback_interval: paybackInterval
                } 
                
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",               
            }
        })
        .then((response) => {
            if (response.status !== 200) {
                console.log(`Status ${response.status} occured`)
                return
            }
            else {
                // Update locally
                data_copy['analytics']['tags'] = Array.from(tags);
                data_copy['analytics']['paid'] = paid;
                data_copy['analytics']['payment_time'] = paymentTime;
                data_copy['analytics']['payback_interval'] = paybackInterval;
                return response.json();
            }
        })
        .catch((e) => {
            console.log(`Fetch error: ${e}`)
        })

        onPostSubmit(data_copy);
    };

    const checkHandler = (item: string) => {
        if (tags.has(item)) {
            let set = new Set(tags);
            set.delete(item);
            setTags(set);
        } else {
            let set = new Set(tags).add(item);
            setTags(set);
        }
    };

    const paidHandler = (paid: boolean) => {
        // We are flipping paid at the end, due to concurrency issues

        if (!paid) {
            const MILLISECONDS_PER_DAY = 86400000;
            const dateToday = new Date();
            const creationDate = new Date(data['creation_time']['$date']);
            setPaymentTime(dateToday.toISOString());
            
            let dateDelta = dateToday.getTime() - creationDate.getTime();

            setPaybackInterval(dateDelta / MILLISECONDS_PER_DAY);
        } else {
            setPaymentTime("");
            setPaybackInterval(0.0);
        }

        setPaid(!paid);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <form method="dialog" onSubmit={handleSubmit} className="flex flex-col flex-wrap justify-center">
                <fieldset className="overflow-y-auto">
                    <legend>Select relevant tags for {data["_id"]["$oid"]}</legend>
                    {tagList.length > 0 && (
                        tagList.map((item, key) =>
                            <div key={key}>
                                <input
                                    className='m-4'
                                    type="checkbox"
                                    id={item}
                                    name={item}
                                    value={""}
                                    {...(tags.has(item)) && ({checked:true})}
                                    onChange={() => checkHandler(item)}/>
                                <label htmlFor={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                            </div>
                        ))}
                </fieldset>
                <label className="relative flex justify-between items-center group p-2 text-xl">
                    Mark as Paid:
                    <input
                        type="checkbox"
                        className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none"
                        value={""}
                        {...(paid) && ({checked:true})}
                        onChange={() => {paidHandler(paid)}}/>
                    <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-red-700 rounded-md duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-1 rounded focus:outline-none focus:shadow-outline">
                    Close
                </button>
            </form>
        </div>
    );
};

export default TagEditor;
