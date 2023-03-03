export async function NotifyByEmail(param) {

  const response = await fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/EmaiSender', {
    method: 'POST',
    // headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ json: param })
  })
  // console.log(response.json())
}
export async function SendNotification(param) {
  const response = fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/EmaiSender', {
    method: 'POST',
    body: {
      json: param
    }
  })
    .then(response => {
      // console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}