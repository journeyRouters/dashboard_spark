export async function NotifyByEmail() {
  var param = {
    "email": "991221nandkishor@gmail.com", "message": "Auto triggered mail", "emailTitle": "Payment ScreenShots Uplaoded",
    "ClientData": {
      "tripId": '12345', "ClientName": 'data.Traveller_name',
      "Contact": 'data.Contact_Number', "Destination": 'data.Destination',
      "DepartureCity": 'data.Departure_City', "Pax": 'data.Pax',
      "Nights": 'data.Travel_Duration-1', "TravelDate": '12-02-2023'
    }
  }
  const response = await fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/EmaiSender', {
    mode: 'no-cors',
    method: 'POST',
    // headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ json: param })
  })
  console.log(response.json())
}
export async function SendNotification(param) {
  var param = {
    "email": "991221nandkishor@gmail.com", "message": "Auto triggered mail", "emailTitle": "Payment ScreenShots Uplaoded",
    "ClientData": {
      "tripId": '12345', "ClientName": 'data.Traveller_name',
      "Contact": 'data.Contact_Number', "Destination": 'data.Destination',
      "DepartureCity": 'data.Departure_City', "Pax": 'data.Pax',
      "Nights": 'data.Travel_Duration-1', "TravelDate": '12-02-2023'
    }
  }
  const response = fetch('https://asia-south1-jrspark-adb98.cloudfunctions.net/EmaiSender', {
    // mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify({ json: param })
  })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}