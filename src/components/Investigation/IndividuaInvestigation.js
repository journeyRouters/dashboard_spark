import React from 'react';

const IndividuaInvestigation = () => {
    return (
        <div>
            <select onChange={(e) => filterDataFromProfile(e.target.value)} >
                <option value={0}> Select The user</option>
                {
                    AllUserprofile.map((data, index) => (<>
                        <option key={index} value={data.uid}>{data.name}</option>

                    </>))
                }
            </select>
        </div>
    );
}

export default IndividuaInvestigation;
