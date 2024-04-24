'use client'

import Link from 'next/link'

import TopBar from '@/app/components/topBar';
import BottomNavBar from '@/app/components/bottomNavigationBar';
import DateRangePicker from './_components/daterange';
import { Suspense, useState, useEffect } from 'react';
import Loading from './loading';
import SubBill from './_components/subbill';
import TagEditor from './_components/tag_editor';
import { analysisAPIPrefix } from '../components/apiPrefix';

export default function SplitAnalysis({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  const [data, setData] = useState<any[]>([]); // JSON objects for SubBills from db
  const [activeKey, setActiveKey] = useState<number>(-1);
  const [dialog, setDialog] = useState<HTMLDialogElement>();
  useEffect(() => {
    setDialog(document.getElementById('tag_editor') as HTMLDialogElement);
  }, []);

  const onSubmit = async (startDate: string, endDate: string) => {
    const uri = analysisAPIPrefix + `/date_query?start_date=${startDate}&end_date=${endDate}`
    const token = localStorage.getItem('token');

    let result = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      if (response.status !==200) {
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

    const result_json = JSON.parse(result)
    setData(result_json)

  };

  const openModal = (key: number) => {
    setActiveKey(key);
    dialog?.showModal();
  }

  const closeModal = () => {
    setActiveKey(-1);
    dialog?.close();
  }

  return (
    <div className='z-10'>
        <dialog id="tag_editor">
          { (activeKey != -1) && <TagEditor data={data[activeKey]} onPostSubmit={closeModal}/>}
        </dialog>
        <TopBar title="Split Analysis" />
        <div className="pt-14">
          <div className='sticky top-14 w-screen bg-yellow-400'>
            <DateRangePicker onSubmit={onSubmit} />
          </div>
          <Suspense fallback={<Loading />}>
            <div className="overflow-y-auto bg-white">
              {data ? (
              data.map((item, key) =>
              <button key={key} onClick={(event)=>openModal(key)}>
                <SubBill key={key} data={item} />
              </button>
              )) : (
                <Loading />
              )}
            </div>
          </Suspense>
        </div>

        <BottomNavBar />
    </div>
  );
}
