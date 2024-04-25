import React, { useState, useEffect } from 'react';
import { contactAPIPrefix } from '../components/apiPrefix';

type IndividualContact = {
    id: string;
    email: string;
    is_pinned: boolean;
    name: string;
};

type GroupContact = {
    _id: string;
    group_id: string;
    is_pinned: boolean;
    members: IndividualContact[];
    name: string;
};

type ContactsResponse = {
    others: {
        group_contacts: GroupContact[];
        individual_contacts: IndividualContact[];
    };
    pinned: {
        group_contacts: GroupContact[];
        individual_contacts: IndividualContact[];
    };
};

type Props = {
    searchTerm: string;
};


const ContactsList: React.FC<Props> = ({ searchTerm }) => {
    const username = localStorage.getItem('username');
    const [contacts, setContacts] = useState<ContactsResponse>({
        others: {
            group_contacts: [],
            individual_contacts: [],
        },
        pinned: {
            group_contacts: [],
            individual_contacts: [],
        }
    });

    const [updateTrigger, setUpdateTrigger] = useState(false);
    
    // Sorting the sections so that "pinned" comes before "others"
    // const sortedEntries = Object.entries(contacts).sort(([key1], [key2]) => {
    //     if (key1 === 'pinned') return -1;
    //     if (key2 === 'pinned') return 1;
    //     return 0;
    // });

    const getUsername = () => localStorage.getItem('username') || "defaultUsername";

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`${contactAPIPrefix}/contacts/all/${username}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setContacts(data);
                } else {
                    console.error('Failed to fetch contacts');
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, [username, updateTrigger]);

    const handlePinContact = async (name: string, contactName: string, contactType: 'individual' | 'group') => {
        const username = localStorage.getItem('username'); // Retrieve the username from localStorage
    
        try {
            const response = await fetch(`${contactAPIPrefix}/contacts/pin/${username}/${contactName}/${contactType}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setContacts(currentContacts => {
                    let updatedContacts = {...currentContacts};

                    // Udate 'pinned' section
                    if (contactType === 'individual') {
                        updatedContacts.pinned.individual_contacts = updatedContacts.pinned.individual_contacts.map(contact =>
                            contact.name === name ? {...contact, is_pinned: !contact.is_pinned} : contact
                        );
                    } else {
                        updatedContacts.pinned.group_contacts = updatedContacts.pinned.group_contacts.map(contact =>
                            contact.name === name ? {...contact, is_pinned: !contact.is_pinned} : contact
                        );
                    }
    
                    // Update 'others' section
                    if (contactType === 'individual') {
                        updatedContacts.others.individual_contacts = updatedContacts.others.individual_contacts.map(contact =>
                            contact.name === name ? {...contact, is_pinned: !contact.is_pinned} : contact
                        );
                    } else {
                        updatedContacts.others.group_contacts = updatedContacts.others.group_contacts.map(contact =>
                            contact.name === name ? {...contact, is_pinned: !contact.is_pinned} : contact
                        );
                    }
    
                    return updatedContacts;
                });
                setUpdateTrigger(!updateTrigger);
                console.log(data.msg); // Display a success message
            } else {
                throw new Error(data.msg);
            }
        } catch (error) {
            console.error('Error toggling pin status:', error);
            // Handle errors, e.g., updating a state variable to show an error message to the user
        }
    };

    const handleDeleteContact = async (username: string, contactName: string) => {
        const url = `${contactAPIPrefix}/individual_contact/${username}/${contactName}`;
        try {
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data.msg);
            setUpdateTrigger(!updateTrigger);
          } else {
            const errorData = await response.json();
            console.error(errorData.msg);
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      };

    const filterBySearchTerm = (contact: IndividualContact) => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase());

    const getFilteredContacts = () => {
        if (!searchTerm) {
            return contacts;
        }

        const filteredOtherIndividualContacts = contacts.others.individual_contacts.filter(filterBySearchTerm);
        const filteredOtherGroupContacts = contacts.others.group_contacts.filter(group =>
            group.members.some(filterBySearchTerm)
        );
        const filteredPinnedIndividualContacts = contacts.pinned.individual_contacts.filter(filterBySearchTerm);
        const filteredPinnedGroupContacts = contacts.pinned.group_contacts.filter(group =>
            group.members.some(filterBySearchTerm)
        );

        // Return a new object with filtered results
        return {
            others: {
                individual_contacts: filteredOtherIndividualContacts,
                group_contacts: filteredOtherGroupContacts
            },
            pinned: {
                individual_contacts: filteredPinnedIndividualContacts,
                group_contacts: filteredPinnedGroupContacts
            }
        };
    };

    const filteredContacts = getFilteredContacts();
    const sortedEntries = Object.entries(filteredContacts).sort(([key1], [key2]) => {
        if (key1 === 'pinned') return -1;
        if (key2 === 'pinned') return 1;
        return 0;
    });

    return (
        <div>
            <p>Username: {username}</p>
            {sortedEntries.map(([key, group]) => (
                <div key={key}>
                    <h2 className="font-bold text-xl py-2">{key.charAt(0).toUpperCase() + key.slice(1)} Contacts</h2>
                    <ul>
                        {group.individual_contacts.map(contact => (
                            <li key={contact.id} className={`flex justify-between items-center p-2 border-b ${contact.is_pinned ? 'bg-yellow-100' : ''}`}>
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-gray-500">{contact.email}</p>
                                </div>
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => handlePinContact(getUsername(), contact.name, 'individual')}
                                        className="p-2 mr-2 bg-yellow-500 text-white rounded"
                                    >
                                        {contact.is_pinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteContact(getUsername(), contact.name)}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {group.group_contacts && group.group_contacts.map(groupContact => (
                        <div 
                            key={groupContact._id}
                            className={`${groupContact.is_pinned ? 'bg-blue-100' : ''}`} // Apply blue background if pinned
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Group: {groupContact.name}</h3>
                                <button 
                                    onClick={() => handlePinContact(getUsername(), groupContact.name, 'group')}
                                    className="p-2 bg-yellow-500 text-white rounded"
                                >
                                    {groupContact.is_pinned ? 'Unpin Group' : 'Pin Group'}
                                </button>
                            </div>
                            <ul>
                                {groupContact.members.map(member => (
                                    <li key={`${groupContact._id}-${member.id}`} className="flex justify-between items-center p-2 border-b">
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    
                </div>
            ))}
        </div>
    );
};

export default ContactsList;