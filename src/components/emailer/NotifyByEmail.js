export async function NotifyByEmail(param) {

  const response = await fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/EmaiSender', {
    method: 'POST',
    // headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ json: param })
  })
  // console.log(response.json())
}
export async function SendNotification() {
  try {
    const response = await fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/testing_connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "message": "kishor" })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // handle the response from the function
      })
      .catch(error => {
        console.log(error)
        // handle the error
      });
  } catch (error) {
    console.error(error);
  }

}