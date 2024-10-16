import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Userunitcomponent from './UserUnitComponent';

const Usercontrol = (props) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const Profile = JSON.parse(localStorage.getItem('profile'));

    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); // State for the user being edited
    const [edit, setEdit] = useState(false); // State to control modal open/close
    const [userCounts, setUserCounts] = useState({}); // State for user counts by access type

    const db = getFirestore(app);

    async function datahandle() {
        if (auth) {
            let list = [];
            const querySnapshot = await getDocs(
                query(collection(db, "Profile"))
            );
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            setUser(list);
            setFilteredUsers(list); // Set initially loaded users
            
            // Count users by access type
            const counts = {};
            list.forEach((user) => {
                const access = user.access_type;
                counts[access] = (counts[access] || 0) + 1; // Increment the count for this access type
            });
            setUserCounts(counts); // Update state with user counts
        } else {
            setUser([]);
        }
    }

    // Search Filter Handler
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredUsers(user); // Show all users if search term is empty
        } else {
            const filtered = user.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredUsers(filtered); // Update the displayed list with filtered users
        }
    }, [searchTerm, user]);

    function refreshPage() {
        window.location.reload(false);
    }

    useEffect(() => {
        datahandle();
    }, []);

    // Function to open the modal and set the selected user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEdit(true); // Open the modal
    };

    const closeEditModal = () => {
        setEdit(false); // Close modal
        setSelectedUser(null); // Reset selected user
    };

    return (
        <div>
            {/* User Count Bar */}
            <div className="user-count-bar">
                {Object.entries(userCounts).map(([accessType, count]) => (
                    <div key={accessType} className="access-count">
                        <span>{accessType}:</span> <span>{count}</span>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            {Profile && (Profile.access_type === "admin" || Profile.access_type === "Super Admin") ? (
                <>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* User List */}
                    {filteredUsers.map((d, index) => (
                        <Userunitcomponent key={index} data={d} onEdit={() => handleEditUser(d)} />
                    ))}

                    {/* Modal for editing user */}
                    {edit && selectedUser && (
                        <Userunitcomponent
                            data={selectedUser}
                            datahandle={datahandle}
                            closeModal={closeEditModal}
                            isEditMode={true}
                        />
                    )}
                </>
            ) : refreshPage()}
        </div>
    );
}

export default Usercontrol;
