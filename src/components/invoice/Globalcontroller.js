export async function installmentController(installment, TripId) {
    const url = 'https://payments-buoig14.an.gateway.dev/update';
    const data = {
        "Installments": installment,
        "TripId": TripId
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error('Error - Status Code:', response.status);
            const text = await response.text();
            console.error('Error Details:', text);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        // console.log('Response:', text);
    } catch (error) {
        console.error('Request failed:', error);
    }
}

export async function PaymentConfirmation(installment, Email, AmountReceive, NextInstallment,TripId) {
    const url = 'https://s5abd82gwi.execute-api.ap-south-1.amazonaws.com/emailshooter/email';
    const data = {
        "Data": installment,
        "To": Email,
        'AmountReceive': AmountReceive,
        'NextInstallment': NextInstallment,
        'TripId': TripId
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error('Error - Status Code:', response.status);
            const text = await response.text();
            console.error('Error Details:', text);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        // console.log('Response:', text);
    } catch (error) {
        console.error('Request failed:', error);
    }
}
