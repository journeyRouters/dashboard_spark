import React, { useEffect, useState } from 'react';
import LeadDetails from './LeadDetails';

const WebLeadLoader = () => {
    const [leads, setLeads] = useState([]);
    const [socket, setSocket] = useState(null); // Only need one state for socket
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        fetchLeads(); // Initial fetch to load all leads

        const ws = new WebSocket('wss://237ilw8146.execute-api.ap-south-1.amazonaws.com/production/');
        setSocket(ws);

        ws.onopen = () => {
            // console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const leadUpdate = JSON.parse(event.data);
            // Directly update leads with new incoming data
            setLeads((prevLeads) => [...prevLeads, leadUpdate.leads]);
            showPopUp(leadUpdate.leads);
        };

        ws.onclose = (event) => {
            // console.log('WebSocket closed:', event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close(); // Close WebSocket when the component unmounts
        };
    }, []);

    // Function to make API call with optional search query
    const fetchLeads = async (searchQuery = '') => {
        try {
            const response = await fetch(`https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander?query=${searchQuery}`);
            const data = await response.json();
            setLeads(data.leads);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchLeads(query); // Make API call when search query changes
    };

    const showPopUp = (leadUpdate) => {
        alert(`New lead received: ${leadUpdate.FullName} - ${leadUpdate.Email}`);
    };

    return (
        <div>
            {/* Search Input */}
            <div className='WebLeadsearch-container'>
                <input
                    className='WebLeadsearch-input'
                    type="text"
                    placeholder="Search by name or mobile number"
                    value={searchQuery}
                    onChange={handleSearchChange} // Call API on search input change
                    style={{ padding: '8px', marginBottom: '20px', width: '300px' }}
                />
            </div>
            <div className="total-lead-count">
                <h3>Total Leads: {leads.length}</h3>
            </div>
            <ul>
                {/* Render LeadDetails only once */}
                <LeadDetails leads={leads} />
            </ul>
        </div>
    );
};

export default WebLeadLoader;
