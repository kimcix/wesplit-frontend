'use client';
import { ChangeEvent, ChangeEventHandler, useEffect, useState  } from 'react';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'
import { contactAPIPrefix, userManagementAPIPrefix } from '../components/apiPrefix';
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
    const [groupName, setGroupName] = useState('');
    const [updateTriggerForAddContact, setUpdateTriggerForAddContact] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchContacts();
    }, [username, updateTriggerForAddContact]);


    const handleAddUserField = () => {
        setUsernames([...usernames, '']);
    };

    const handleRemoveUserField = (index: number) => {
        setUsernames(usernames.filter((_, i) => i !== index));
    };

    const handleUsernameChange = (index: number, value: string) => {
        setMessage('');
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

        // Function to fetch user profiles
        const fetchUserProfile = async (username: string) => {
            const response = await fetch(`${userManagementAPIPrefix}/profile/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.json();
        };

        if (contactType === 'group') {
            // Fetch and verify all user profiles
            const profiles = await Promise.all(usernames.map(username => fetchUserProfile(username)));
            const validUsernames = profiles.filter(profile => profile && !profile.error);

            // Check if all usernames are valid
            if (validUsernames.length !== usernames.length) {
                setMessage('One or more usernames are invalid');  
                return;
            }

            // Build the members array with the required fields for each member
            const members = validUsernames.map(profile => ({
                username: profile.username,
                name: profile.username, // Assuming the name is the same as the username, change as needed
                email: profile.email || `${profile.username}@example.com`, // Use profile email or default
                is_pinned: false
            }));
        
            const body = {
              name: groupName,
              members: members, 
              is_pinned: false 
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
                setUpdateTriggerForAddContact(!updateTriggerForAddContact);
              } else {
                const error = await response.json();
                setMessage(`Failed to add contact: ${error.msg}`);
              }
            } catch (error) {
              // Handle network errors
            }
        
        } else {

            const profile = await fetchUserProfile(usernames[0]);
            //console.log("User profile: ", JSON.stringify(profile));
            if (!profile || profile.error) {
                setMessage('Username is invalid');
                return;
            }
            
            console.log("User profile: ", JSON.stringify(profile));

            const body = {
                username: currentUser,  
                name: profile.username,  
                email: profile.email,    
                id: profile.friend_id,    
                is_pinned: false,
                avg_payback_time: profile.avg_payback_time
            };

            console.log("body: ", body)

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                  });
            
                  if (response.ok) {
                    const newContact = await response.json();
                    setContacts([...contacts, { ...newContact, type: contactType }]);
                    setShowModal(false);
                    setUsernames(['']); // Reset usernames for the next entry
                    setUpdateTriggerForAddContact(!updateTriggerForAddContact);
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
                            {message && (
                                <div className="mb-4 text-red-500">{message}</div>
                            )}
                        </div>
                    </div>
                )}
                <div>
                    <ContactsList searchTerm={searchTerm} updateAddTrigger={updateTriggerForAddContact}/>
                </div>
            </div>
            <BottomNavBar />
        </div>
    );
};

export default ContactsPage;



