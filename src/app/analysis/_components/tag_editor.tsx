'use client'

import React, { useState, useEffect, ChangeEventHandler } from 'react';

interface TagEditorProps {
    onPostSubmit: any;
    data: any;
}

const TagEditor: React.FC<TagEditorProps> = ({ onPostSubmit, data }) => {
    const [tags, setTags] = useState<Set<string>>(new Set(data['analytics']['tags']));
    const [tagList, setTagList] = useState<any[]>([]);

    useEffect(() => {
        const uri = `http://localhost:8000/fetch_tags`
        fetch(uri)
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
        data['analytics']['tags'] = Array.from(tags);
        const uri = `http://localhost:8000/update_tags`;

        fetch(uri, {
            method: "POST",
            body: JSON.stringify({
                subBillId: data["_id"]["$oid"],
                newTags: Array.from(tags)
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
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
        .catch((e) => {
            console.log(`Fetch error: ${e}`)
        })

        onPostSubmit();
    };

    const checkHandler = (item: string) => {
        if (tags.has(item)) {
            let set = new Set(tags);
            set.delete(item);
            setTags(set);
        } else {
            let set = new Set(tags).add(item)
            setTags(set);
        }
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
                                    {...(tags.has(item)) && ({checked:true})}
                                    onChange={() => checkHandler(item)}/>
                                <label htmlFor={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                            </div>
                        ))}
                </fieldset>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-1 rounded focus:outline-none focus:shadow-outline">
                    Close
                </button>
            </form>
        </div>
    );
};

export default TagEditor;
