import React, { useState } from 'react';

interface DateRangePickerProps {
  onSubmit: any
  // TODO: Fix type
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSubmit }) => {
  /** Formats Date object to HTML input format */
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    return localDate;
  };

  const currentDate = formatDate(new Date())
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(currentDate);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit(startDate, endDate)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-row flex-wrap justify-center">
      <input
        id='startDate'
        type="date"
        min="2024-01-01"
        max={endDate}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 my-1 focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        id="endDate"
        type="date"
        min="2024-01-01"
        max={currentDate}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 my-1 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-1 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
};

export default DateRangePicker;
