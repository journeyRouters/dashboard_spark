import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import app from '../required';
import './Identity.css';
import Accounts from './UserIdentityPages/Accounts';
import Educational from './UserIdentityPages/Educational';
import Personal from './UserIdentityPages/Personal';
import Professional from './UserIdentityPages/Professional';
import Edit from './UserIdentityPages/Edit';
function Identity({ }) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [Page, setPage] = useState('Personal')
    const Notifications = ['Personal', 'Professional', 'Educational', 'Accounts']
    const [userprofileData, setuserprofileData] = useState({})
    // considering that data is available in db 
    const [isUserDataAvailableInDb, setisUserDataAvailableInDb] = useState(true)
    const [loader, setloader] = useState(true)
    const fileInputRef = useRef(null);
    const user_profile_Data = {
        UserDetails: {
            EmployeeId: null,
            FirstName: null,
            MiddleName: null,
            LastName: null,
            Gender: null,
            Specialization: [],
            MaritalStatus: false,
            Department: null,
            Designation: null,
            DateOfJoining: null,
            DateOfBirth: null,
            MarriageAnniversary: null,
            CurrentAddress: null,
            PermanentAddress: null,
            OfficialContactNumber: null,
            OfficialEmail: null,
            PersonalContactNumber: null,
            PersonalEmail: null,
            EmergencyContactNumber: null,
        },
        UserDocuments: {
            AadharCard: {
                AadharCardNumber: null,
                AadharCardFrontImage: null,
                AadharCardBackImage: null,
            },
            PanCard: {
                PanCardNumber: 123456,
                PanCardFrontImage: null,
            },
            Passport: {
                PassportNumber: null,
                PassportFrontImage: null,
                PassportBackImage: null
            },
            MarkSheet: {
                Intermediate: null,
                Graduation: null,
                PostGraduate: null,
                Others: []
            },
            Photograph: {
                Passportsize: [],
                ProfileImage: null,
            },
            Others: {
                JourneyRouterOfferLetter: null,
                JourneyRouterAppointmentLetter: null,
                JourneyRouterProbationLetter: null,
                JourneyRouterIncreamentLetter: []
            }
        },
        History: {
            PreviousOrganisationExperience: 1,
            PreviousOrganisationDesignation: null,
            PreviousOrganisationDepartment: null,
            PreviousOrganisationJoiningDate: null,
            PreviousOrganisationleavingDate: null,
            PreviousOrganisationName: null,
            PreviousOrganisationSpecialization: [],

        }


    }

    const uploadfilesToFirebaseStorage = async (file, userId, onUploadSuccess, onError) => {
        if (!file || !userId) {
            onError && onError("File or user ID is missing.");
            return;
        }
        const customBucketUrl = "gs://jr_employee_data";
        const storage = getStorage(app, customBucketUrl);
        const fileRef = ref(storage, `UserData/${userId}/ProfileImage/Profile`);

        try {
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            localStorage.setItem('ProfileImageLink', JSON.stringify(downloadURL));
            onUploadSuccess && onUploadSuccess(downloadURL);
        } catch (error) {
            console.error("Upload failed", error);
            onError && onError(error);
        }
    };

    const pickImageAndUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const userId = profile.uid;

        uploadfilesToFirebaseStorage(file, userId,
            (Url) => {
                setuserprofileData((prevData) => ({
                    ...prevData,
                    UserDocuments: {
                        ...prevData.UserDocuments,
                        Photograph: { ...prevData.UserDocuments.Photograph, ProfileImage: Url },
                    },
                }));
                // console.log(Url);
                const updatedUserProfileData = {
                    ...userprofileData,
                    UserDocuments: {
                        ...userprofileData.UserDocuments,
                        Photograph: { ...userprofileData.UserDocuments.Photograph, ProfileImage: Url },
                    },
                };
                if (isUserDataAvailableInDb) {
                    // console.log(isUserDataAvailableInDb, updatedUserProfileData);
                    UpdateUserDataToFireBaseCollection(profile.uid, updatedUserProfileData);
                } else {
                    // console.log(isUserDataAvailableInDb, updatedUserProfileData);
                    setNewUserDataToFireBaseCollection(profile.uid, updatedUserProfileData);
                }
            },
            (error) => {
                console.error(`Upload error: ${error}`);
            }
        );
    };

    const UpdateUserDataToFireBaseCollection = async (userId, data) => {
        const db = getFirestore(app);

        try {
            
            // Specify the document reference
            const docRef = doc(db, "UserProfile", userId);
            await updateDoc(docRef, data);

            // console.log("Document written with ID: ", userId);
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
            return false;
        }
    };
    const setNewUserDataToFireBaseCollection = async (userId, data) => {
        const db = getFirestore(app);

        try {
            // Specify the document reference
            const docRef = doc(db, "UserProfile", userId);

            // Set data in the document
            await setDoc(docRef, data);

            // console.log("Document written with ID: ", userId);
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
            return false;
        }
    };
    const getUserProfile = async (userId) => {
        const db = getFirestore(app);

        try {
            const docRef = doc(db, "UserProfile", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // if there is data in collection, we will have the data
                setuserprofileData(docSnap.data())
                // console.log(docSnap.data())
                setloader(false)
                return docSnap.data();
            } else {
                // if no data available in collection setting default data json to be updated
                setuserprofileData(user_profile_Data)
                setisUserDataAvailableInDb(false)
                setloader(false)

                return null;
            }
        } catch (error) {
            console.error("Error getting document:", error);
            return null;
        }
    };

    useEffect(() => {
        // console.log(profile.uid)
        getUserProfile(profile.uid)
    }, [])


    return (
        <>{
            loader ? <></> :

                <div className='user_profile_Main_page'>
                    <div className='user_profile_drawer'>
                        <div className='User_profile_image' onClick={pickImageAndUpload}>
                            <img className='User_image' src={userprofileData.UserDocuments.Photograph == null ? '' : userprofileData.UserDocuments.Photograph.ProfileImage} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <h4 className='Right_index_column_value'>{profile ? profile.name : ''}</h4>

                        <div className='Basic_details_section'>
                            {
                                Notifications.map((data, index) =>
                                    <div className='Index_uniCoponent' key={index} onClick={() => setPage(data)}>
                                        {data} Information
                                    </div>
                                )
                            }
                            <button className='EditComponent' onClick={() => setPage('Edit')}> Edit</button>
                        </div>
                    </div>
                    <div className='Pages_to_be_render'>
                        {
                            Page === 'Personal' ? <Personal userprofileData={userprofileData} /> :
                                Page === 'Professional' ? <Professional userprofileData={userprofileData} /> :
                                    Page === 'Educational' ? <Educational userprofileData={userprofileData} /> :
                                        Page === 'Edit' ? <Edit userprofileData={userprofileData} /> :
                                            Page === 'Accounts' ? <Accounts userprofileData={userprofileData} /> : <></>

                        }
                    </div>
                </div>
        }
        </>
    );
}

export default Identity;


{/* <div className='Basic_details_section'>
                <h2 className='Basic_details_title'> Journey Routers Profile</h2>
                <div className='Profile_details_Parent'>

                    <div className='Left_index_column'>
                        <h4>Name</h4>
                        <h4>Date.o.Birth</h4>
                        <h4>Date.o.Joining</h4>
                        <h4>JR Id</h4>
                        <h4>Expertise</h4>
                    </div>
                    <div>
                        <h4>-----------&rarr;</h4>
                        <h4>-----------&rarr;</h4>
                        <h4>-----------&rarr;</h4>
                        <h4>-----------&rarr;</h4>
                        <h4>-----------&rarr;</h4>
                    </div>
                    <div className='Right_index_column'>
                        <h4 className='Right_index_column_value'>{profile ? profile.name : ''}</h4>
                        <h4 className='Right_index_column_value'>_________</h4>
                        <h4 className='Right_index_column_value'>_________</h4>
                        <h4 className='Right_index_column_value'>JR Id</h4>
                        <h4 className='Right_index_column_value'>Expertise</h4>
                    </div>
                </div>
            </div> */}

{/* <div className='Basic_details_section'>
                <h1 className='Basic_details_title'> circulars</h1>
                <div className='Circular_card_container'>
                    {
                        Notifications.map((data,index) =>
                            <div className='Circular_card' key={index} >

                            </div>)
                    }
                </div>
            </div> */}