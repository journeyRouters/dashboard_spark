import { fromEvent } from "file-selector";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";
const storage = getStorage();


export default async function handleSubmit() {
    const handles = await window.showOpenFilePicker({ multiple: false });
    const file = await fromEvent(handles);
    // console.log(file)
    // e.preventDefault()
    // const file = e.target[0]?.files[0]

    if (!file) return;

    const storageRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

    uploadTask.on('state_changed',
        (snapshot) => {
            // console.log(snapshot)
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
            });
        }
    );
  }