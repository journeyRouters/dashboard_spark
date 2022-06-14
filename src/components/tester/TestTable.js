import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { default as React, useEffect, useState } from 'react';
import SortableTbl from 'react-sort-search-table';
import app from '../required';
const TestTable = () => {
    const [open, setopen] = useState(true)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState([])
    const [time_flg, settime] = useState()
    const time = new Date()
    const Current = time.getSeconds()
    const [lastVisible, setlastVisible] = useState()


    async function datahandle() {
        if (1) {
            let list = []
            var q;         
                q = query(collection(db, "Trip"), where("quotation_flg", "==", false));       


            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
            }
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            setlastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
            setLead_data(list)
            console.log(list)
            setopen(false)
        }
        else {
            setopen(false)
            setLead_data([])
        }

    }
    useEffect(() => {
       datahandle()
    }, []);
    let MyData = [
        {
            cat: 1,
            _id: "d-rhe-428-j",
            imageUrl: "img/products/rhe-428-j.png",
            name: "RHE-428-J (4ch Compact)",
            brand: "iCATCH",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA",
        },
        {
            cat: 1,
            _id: "srd-482",
            imageUrl: "img/products/srd-482-2.jpg",
            name: "SRD-482 (4ch)",
            brand: "Samsung",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA",
        },
        {
            cat: 1,
            _id: "sh3-04u",
            imageUrl: "img/products/sh3-04u-1.png",
            name: "SH3-04U (4ch)",
            brand: "SNM",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA, BNC",
        },
        {
            cat: 1,
            _id: "d-rhe-828-j",
            imageUrl: "img/products/rhe-828-j.png",
            name: "RHE-828-J (8ch Compact)",
            brand: "iCATCH",
            type: "HD-SDI",
            channel: 8,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "Network, USB 2.0 or SATA",
            videoout: "HDMI, VGA, BNC",
        },
        {
            cat: 1,
            _id: "d-rhe-428-j",
            imageUrl: "img/products/rhe-428-j.png",
            name: "RHE-428-J (4ch Compact)",
            brand: "iCATCH",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA",
        },
        {
            cat: 1,
            _id: "srd-482",
            imageUrl: "img/products/srd-482-2.jpg",
            name: "SRD-482 (4ch)",
            brand: "Samsung",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA",
        },
        {
            cat: 1,
            _id: "sh3-04u",
            imageUrl: "img/products/sh3-04u-1.png",
            name: "SH3-04U (4ch)",
            brand: "SNM",
            type: "HD-SDI",
            channel: 4,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "USB, Network",
            videoout: "HDMI, VGA, BNC",
        },
        {
            cat: 1,
            _id: "d-rhe-828-j",
            imageUrl: "img/products/rhe-828-j.png",
            name: "RHE-828-J (8ch Compact)",
            brand: "iCATCH",
            type: "HD-SDI",
            channel: 8,
            remote: "LAN, ie, iPhone, iPad, Android, 3G mobile",
            backup: "Network, USB 2.0 or SATA",
            videoout: "HDMI, VGA, BNC",
        },
    ];
    let tHead = [
        "TripId",
		"NAME",
		"Contact_Number",
		"Destination",
		"Budget",
		"Email",
		"Lead_Status",
		"Delete",
		"Edit",
	];
    let col = [
        "TripId",
		"Traveller_name",
		"Contact_Number",
		"Destination",
		"Budget",
		"Email",
		"Lead_Status",
		"delete",
		"edit",
	];
    function ProductTblImgpreloader() {
        return <div className="loading-div" style={{ minHeight: "100px" }} />;
    }
    
    // const TblImageLoader = (props) => (
    //     <ImageLoader
    //         src={props.data}
    //         wrapper={React.DOM.div}
    //         preloader={ProductTblImgpreloader}
    //     >
    //         NOT FOUND
    //     </ImageLoader>
    // );
    class BaseProductEditComponent extends React.Component {
        constructor(props) {
            super(props);
            this.editItem = this.editItem.bind(this);
        }
        editItem() {
            alert("edit " + this.props.rowData.Traveller_name);
            console.log(this.props.rowData, this.props.tdData);
        }
        render() {
            return (
                <td>
                    <input
                        type="button"
                        className="btn btn-warning"
                        value="Edit"
                        onClick={this.editItem}
                    />
                </td>
            );
        }
    }
  
	
    const BaseProductTblImageComponent = (props) => {
        return (
            <td
                style={{
                    width: "170px",
                    minWidth: "170px",
                    backgroundColor: "#fff",
                }}
            >
                <a href={props.rowData.imageUrl} target="_blank">
                    {/* <TblImageLoader data={props.rowData.imageUrl} /> */}
                </a>
            </td>
        );
    };
    function ProductTblImgpreloader() {
        return <div className="loading-div" style={{ minHeight: "100px" }} />;
    }
  
    class BaseProductDeleteComponent extends React.Component {
        constructor(props) {
            super(props);
            this.deleteItem = this.deleteItem.bind(this);
        }
        deleteItem() {
            alert("delete " + this.props.rowData.name);
            console.log(this.props.rowData, this.props.tdData);
        }
        render() {
            return (
                <td>
                    <input
                        type="button"
                        className="btn btn-danger"
                        value="Delete"
                        onClick={this.deleteItem}
                    />
                </td>
            );
        }
    }
    
    return (
        <div>
            <SortableTbl
			tblData={lead_data}
			tHead={tHead}
            defaultCSS={true}
			customTd={[
				// { custd: BaseProductTblImageComponent, keyItem: "imageUrl" },
				{ custd: BaseProductEditComponent, keyItem: "edit" },
				{ custd: BaseProductDeleteComponent, keyItem: "delete" },
			]}
			dKey={col}
		/>
        </div>
    );
}

export default TestTable;
