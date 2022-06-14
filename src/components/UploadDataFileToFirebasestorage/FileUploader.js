import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';




const FileUploader = ({Filepath  ,folderName}) => {
    const storage = getStorage();
    var storageFolderName = folderName ? folderName : 'Vouchers'
    const storageRef = ref(storage, `${storageFolderName}/${Filepath}`);
    const uploadTask = uploadBytesResumable(storageRef, Filepath[0]);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log(snapshot)
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

export default FileUploader;
