import React, { useState } from 'react';
import '../inclusioncss.css';

const RoomType = ({handleFormChange,index,value}) => {
    const [showDefaultRoomTypeFlg, setshowDefaultRoomTypeFlg] = useState(true)

    return (
    <div className='roomTypealiner'>
            <input type={'checkbox'} checked={showDefaultRoomTypeFlg} onChange={() => setshowDefaultRoomTypeFlg(!showDefaultRoomTypeFlg)} ></input><br />
            {
                showDefaultRoomTypeFlg ? <>
                    <textarea name='RoomType' value={value}  onChange={(event) => handleFormChange(event, index)}></textarea>
                </> : <>
                    <select  name='RoomType' onChange={(event) => handleFormChange(event, index)}>
                    <option >select Type</option>
                        <option value='standrad'>standrad</option>
                        <option value='deluxe'>deluxe</option>
                        <option value='super deluxe'>super deluxe</option>
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
