'use client';
import { ChangeEvent, ChangeEventHandler, useEffect, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'
import { contactAPIPrefix } from '../components/apiPrefix';
import ContactsList from './ContactsList'; 

interface Contact {
    id: string;
    names: string[];
    type: 'individual' | 'group';
    pinned: boolean;
}

type ContactProps = {
    contacts: {
        _id: string;
        individual_contacts: Array<{
            email: string;
            is_pinned: boolean;
            name: string;
        }>;
        username: string;
    };
};

const ContactsPage = () => {
    const username = localStorage.getItem('username');
    //console.log("username: ", username);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [contactType, setContactType] = useState<'individual' | 'group'>('individual');
    const [usernames, setUsernames] = useState(['']);
    const [searchTerm, setSearchTerm] = useState('');
    const [pinnedCount, setPinnedCount] = useState(0);
    const [groupId, setGroupId] = useState('');
    const [user_list, setUserList] = useState('');
    const [message, setMessage] = useState('');
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        fetchContacts();
    }, [username]);


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

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${contactAPIPrefix}/contacts/${username}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
              });
            console.log(contactAPIPrefix + " , " + username)
            const data = await response.json();
            console.log("all contact data: ", data);
            if (response.ok) {
                setContacts(data);
            } else {
                console.error('Failed to fetch contacts');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleAddContact = async () => {
        const currentUser = localStorage.getItem('username'); // Retrieve the currently logged-in user's username
        console.log("usernames are " + usernames);
        const url = `${contactAPIPrefix}/${contactType === 'group' ? 'group_contact' : 'individual_contact'}`;
        if (contactType === 'group') {
            // Build the members array with the required fields for each member
            const members = usernames.map(username => ({
              username: username,
              name: username, // Assuming the name is the same as the username, change as needed
              email: `${username}@example.com`, // Modify as per your logic for deriving emails
              is_pinned: false
            }));
        
            const body = {
              name: groupName,
              members: members, // Array of individual_contact objects
              is_pinned: false // This can be dynamic based on user input if needed
            };
        
            // API call for group contact
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Include other headers such as authorization if required
                },
                body: JSON.stringify(body)
              });
        
              if (response.ok) {
                const newContact = await response.json();
                setContacts([...contacts, { ...newContact, type: contactType }]);
                setShowModal(false);
                setUsernames(['']); // Reset usernames for the next entry
                setMessage('Contact added successfully!');
              } else {
                const error = await response.json();
                setMessage(`Failed to add contact: ${error.msg}`);
              }
            } catch (error) {
              // Handle network errors
            }
        
          } else {
            const body = {
                username: currentUser,
                name: usernames.join(', '),
                email: usernames[0] + '@example.com',
                is_pinned: false
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      // Include other headers such as authorization if required
                    },
                    body: JSON.stringify(body)
                  });
            
                  if (response.ok) {
                    const newContact = await response.json();
                    setContacts([...contacts, { ...newContact, type: contactType }]);
                    setShowModal(false);
                    setUsernames(['']); // Reset usernames for the next entry
                    setMessage('Contact added successfully!');
                  } else {
                    const error = await response.json();
                    setMessage(`Failed to add contact: ${error.msg}`);
                  }
                } catch (error) {
                  // Handle network errors
                }
        }
    };
    

    return (
        <div>
            <TopBar title="My Contacts" />
            <div className="flex flex-col p-4 pt-20 mb-24">
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
                {message && <div className="alert">{message}</div>}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-4 rounded">
                        <select value={contactType} onChange={(e) => setContactType(e.target.value as 'individual' | 'group')} className="mb-4 p-2 border">
                                <option value="individual">Individual Contact</option>
                                <option value="group">Group Contact</option>
                            </select>

                            {/* Conditional rendering based on contact type */}
                            {contactType === 'group' ? (
                                <>
                                    {/* Input for Group Name */}
                                    <input
                                        type="text"
                                        placeholder="Enter group name"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="border p-2 mb-4 w-full"
                                    />
                                    {/* Map through the usernames for group members */}
                                    {usernames.map((username, index) => (
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
                                    ))}
                                    {/* Button to add more users */}
                                    <button onClick={handleAddUserField} className="p-2 bg-green-500 text-white rounded mb-4">
                                        Add Another User
                                    </button>
                                </>
                            ) : (
                                // Input for Individual Contact's Username
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={usernames[0]}
                                    onChange={(e) => handleUsernameChange(0, e.target.value)}
                                    className="border p-2 mb-4 w-full"
                                />
                            )}

                            {/* Submit button */}
                            <button onClick={handleAddContact} className="p-2 bg-blue-500 text-white rounded">
                                Submit
                            </button>
                            {/* Close button */}
                            <button onClick={() => setShowModal(false)} className="p-2 bg-red-500 text-white rounded ml-2">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    <ContactsList searchTerm={searchTerm} />
                </div>
            </div>
            <BottomNavBar />
        </div>
    );
};

export default ContactsPage;


