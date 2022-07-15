import React, { useState } from 'react';

const RoomType = ({handleFormChange,index}) => {
    const [showDefaultRoomTypeFlg, setshowDefaultRoomTypeFlg] = useState(true)

    return (
        <div>
            <input type={'checkbox'} checked={showDefaultRoomTypeFlg} onChange={() => setshowDefaultRoomTypeFlg(!showDefaultRoomTypeFlg)} ></input><br />
            {
                showDefaultRoomTypeFlg ? <>
                    <textarea name='RoomType' onChange={(event) => handleFormChange(event, index)}></textarea>
                </> : <>
                    <select defaultValue='normal' name='RoomType' onChange={(event) => handleFormChange(event, index)}>
                        <option value='standrad'>standrad</option>
                        <option value='delux'>delux</option>
                        <option value='super delux'>super delux</option>
                        <option value='Premium'>Premium</option>
                        <option value='Luxury'>Luxury</option>
                        <option value='duplex'>duplex</option>
                        <option value='family suite'>family suite</option>
                        <option value='Excutive suite'>Excutive suite</option>
                        <option value='grand suite'>grand suite</option>

                    </select>
                </>
            }
        </div>
    );
}

export default RoomType;
