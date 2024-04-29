'use client'

import Link from 'next/link'

import TopBar from '@/app/components/topBar';
import BottomNavBar from '@/app/components/bottomNavigationBar';
import DateRangePicker from './_components/daterange';
import { useState, useEffect } from 'react';
import SubBill from './_components/subbill';
import TagEditor from './_components/tag_editor';
import { analysisAPIPrefix } from '../components/apiPrefix';

export default function SplitAnalysis() {
  const [data, setData] = useState<any[]>([]); // JSON objects for SubBills from db
  const [activeKey, setActiveKey] = useState<number>(-1);

  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const dialog: HTMLDialogElement = document.getElementById('tag_editor') as HTMLDialogElement;
    if (activeKey == -1) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }, [activeKey]);

  /** Fetch split bills by date and setup
   * 
   * @param startDate 
   * @param endDate
   * @param fetchLatest
   */
  const dateRangeQuery = async (startDate: string, endDate: string, fetchLatest: boolean) => {
    const USERNAME = localStorage.getItem('username');
    const DATE_QUERY_URI = analysisAPIPrefix + `/date_query?start_date=${startDate}&end_date=${endDate}&user=${USERNAME}`;
    const STREAM_START_URI = analysisAPIPrefix + `/stream_start?user=${USERNAME}`;
    const STREAM_END_URI = analysisAPIPrefix + `/stream_end?user=${USERNAME}`;

    let filtered_result:(any[]) = [];
    let es:(EventSource | null) = null;

    const response =  await fetch(DATE_QUERY_URI, {
                            method: 'GET',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          });

    if (response.status !== 200) {
      console.log(`Status ${response.status} occured`)
    }
    else {
      const result_json = JSON.parse(await response.json());

      // Filter out self-created items
      filtered_result = result_json.filter((item: any) => item.creator !== USERNAME);
      console.log("filtered_result: ", filtered_result);

      if (fetchLatest && (eventSource == null)) {
        console.log("Starting SSE");
        
        es = new EventSource(STREAM_START_URI);
        es.onopen = () => console.log("Connection opened!");
        es.onerror = (e: any) => console.log(`Error: ${e}`);
        es.onmessage = () => {
          const dateRangeForm: any = document.getElementById("dateRangeForm");
          if (dateRangeForm) {
            console.log("Resubmitting date range form:");
            dateRangeForm.submit();
          }
        }
      }
      else if (!fetchLatest && (eventSource != null)) {
        console.log("Ending SSE");
        eventSource.close();
        await fetch(STREAM_END_URI);
      }

      setData(() => {
        if (es != null) {
          setEventSource(es);
        }
        return filtered_result;
      });
    }
  };

  const openModal = (key: number) => {
    setActiveKey(key);
  }

  const closeModal = (data:any[]) => {
    setActiveKey(() => {
      setData(data);
      return (-1);
    });
  }

  return (
    <div className='z-10'>
      <dialog id="tag_editor">
        { (activeKey != -1) && <TagEditor index={activeKey} data={data} onPostSubmit={closeModal}/>}
      </dialog>
      <TopBar title="Split Analysis" />
      <div className="h-dvh mb-14 pt-14">
        <div className='sticky top-14 w-screen bg-yellow-400'>
          <DateRangePicker onSubmit={dateRangeQuery} />
        </div>
        <div className="static h-full overflow-y-auto flex flex-col">
          {(data) && (
            data.map((item, key) =>
              <button key={key} onClick={()=>openModal(key)}>
                <SubBill subdata={item} />
              </button>
          ))}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
