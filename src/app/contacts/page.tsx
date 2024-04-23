'use client';
import { ChangeEvent, ChangeEventHandler, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

interface Contact {
    id: string;
    names: string[];
    type: 'individual' | 'group';
    pinned: boolean;
}

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [contactType, setContactType] = useState<'individual' | 'group'>('individual');
    const [usernames, setUsernames] = useState(['']);
    const [searchTerm, setSearchTerm] = useState('');
    const [pinnedCount, setPinnedCount] = useState(0);
    const [groupId, setGroupId] = useState('');
    const [user_list, setUserList] = useState('');
    const [message, setMessage] = useState('');

    const handleAddUserField = () => {
        setUsernames([...usernames, '']);
    };

    const handleRemoveUserField = (index: number) => {
        setUsernames(usernames.filter((_, i) => i !== index));
    };

    const handleUsernameChange = (index: number, value: string) => {
        const updatedUsernames = usernames.map((username, i) => i === index ? value : username);
        setUsernames(updatedUsernames);
    };

    const handleAddContact = () => {
        const newId = contactType === 'group' ? Math.random().toString().slice(2, 8) : (contacts.length + 1).toString();
        const newContact: Contact = {
            id: newId,
            names: usernames,
            type: contactType,
            pinned: false
        };
        setContacts([...contacts, newContact]);
        setShowModal(false);
        setUsernames(['']); // Reset usernames for the next entry
    };

    const handleDeleteContact = (id: string) => {
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    const handlePinContact = (id: string) => {
        const contact = contacts.find(contact => contact.id === id);
        if (!contact) return;

        const isPinned = contact.pinned;
        if (!isPinned && pinnedCount >= 5) {
            alert('You can only pin up to 5 contacts.');
            return;
        }

        setContacts(contacts.map(contact =>
            contact.id === id ? { ...contact, pinned: !contact.pinned } : contact
        ));
        setPinnedCount(pinnedCount + (isPinned ? -1 : 1));
    };

    const filteredContacts = contacts.filter(contact =>
        contact.names.some(name => name.includes(searchTerm)) ||
        (contact.type === 'group' && contact.id.includes(searchTerm))
    );

    const handleSubmit = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/group_contact', { // Adjust your backend port if necessary
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            group_id: groupId,
            user_list: usernames.filter(username => username.trim() !== '') // Filter out empty usernames
          }),
        });
    
        const data = await response.json();
        if (response.ok) {
          setMessage('Group contact created successfully!');
          // Optionally reset or update your application state here
        } else {
          setMessage(data.msg || 'An error occurred');
        }
      };
    

    return (
        <div>
            <TopBar title="My Contacts" />
            <div className="flex flex-col p-4 pt-20">
                <input
                    type="text"
                    placeholder="Search by username or group ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 mb-4"
                />
                <button className="mb-4 p-2 bg-blue-500 text-white rounded" onClick={() => setShowModal(true)}>
                    Add New Contact
                </button>
                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-4 rounded">
                            <select value={contactType} onChange={(e) => setContactType(e.target.value as 'individual' | 'group')} className="mb-4 p-2 border">
                                <option value="individual">Individual Contact</option>
                                <option value="group">Group Contact</option>
                            </select>
                            {contactType === 'group' ? (
                                usernames.map((username, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder={`Enter username #${index + 1}`}
                                            value={username}
                                            onChange={(e) => handleUsernameChange(index, e.target.value)}
                                            className="border p-2 w-full"
                                        />
                                        <button onClick={() => handleRemoveUserField(index)} className="ml-2 bg-red-500 text-white p-2 rounded">
                                            Remove
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={usernames[0]}
                                    onChange={(e) => handleUsernameChange(0, e.target.value)}
                                    className="border p-2 mb-4 w-full"
                                />
                            )}
                            {contactType === 'group' && (
                                <button onClick={handleAddUserField} className="p-2 bg-green-500 text-white rounded mb-4">
                                    Add Another User
                                </button>
                            )}
                            <button onClick={handleAddContact} className="p-2 bg-blue-500 text-white rounded">
                                Submit
                            </button>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-red-500 text-white rounded ml-2">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                <ul>
                    {filteredContacts.map(contact => (
                        <li key={contact.id} className={`flex justify-between items-center p-2 border-b ${contact.pinned ? 'bg-yellow-100' : ''}`}>
                            <div>
                                <p className="font-semibold">{contact.names.join(', ')}</p>
                                <p className="text-sm text-gray-500">{contact.type === 'group' ? `Group ID: ${contact.id}` : `Username: ${contact.names[0]}`}</p>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => handlePinContact(contact.id)} className="p-2 mr-2 bg-yellow-500 text-white rounded">
                                    {contact.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button onClick={() => handleDeleteContact(contact.id)} className="p-2 bg-red-500 text-white rounded">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <BottomNavBar />
        </div>
    );
};

export default ContactsPage;
