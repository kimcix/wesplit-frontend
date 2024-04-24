import { useState, useEffect } from 'react';

interface PopupProps {
  title: string;
  body: string;
}

const Popup: React.FC<PopupProps> = ({ title, body }) => {
  return (
    <div className={`fixed top-15 bg-yellow-200 p-1 shadow-lg transition-opacity duration-300 opacity-100 w-full text-center`}>
      <h2 className="text-lg font-bold mb-2">Notification: {title}</h2>
      <p className="text-lg">{body}</p>
    </div>
  );
};

export default Popup;