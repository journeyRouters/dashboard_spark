export const avtivityList = {


    Bali: [
        {
            label: 'Kintamani Ubud Tour',
            value: 'Kintamani Ubud Tour'
        },
        {
            label: 'Bali Swing',
            value: 'Bali Swing'
        },
        {
            label: 'Water Sports Activities',
            value: 'Water Sports Activities'
        },
        {
            label: 'Uluwatu Temple',
            value: 'Uluwatu Temple'
        },
        {
            label: 'Tanah Lot',
            value: 'Tanah Lot'
        },
        {
            label: 'Lempuyang Temple',
            value: 'Lempuyang Temple'
        },
        {
            label: 'Nusa Penida Island',
            value: 'Nusa Penida Island'
        },
        {
            label: 'Ayung River Rafting',
            value: 'Ayung River Rafting'
        },
        {
            label: 'Dolphin Watching Lovina Beach',
            value: 'Dolphin Watching Lovina Beach'
        },
        {
            label: 'Mount Batur Trekking',
            value: 'Mount Batur Trekking'
        },
        {
            label: 'Dinner Cruise Bali Hai',
            value: 'Dinner Cruise Bali Hai'
        },
        {
            label: 'Dinner Cruise Bounty',
            value: 'Dinner Cruise Bounty'
        },
        {
            label: 'Lembongan Island Day Cruise by Bali Hai',
            value: 'Lembongan Island Day Cruise by Bali Hai'
        },
        {
            label: 'Lembongan Island Day Cruise by Bounty',
            value: 'Lembongan Island Day Cruise by Bounty'
        },
        {
            label: 'Monkey Forest',
            value: 'Monkey Forest'
        },
        {
            label: 'Besakih Temple',
            value: 'Besakih Temple'
        },
        {
            label: 'Dream Land Beach',
            value: 'Dream Land Beach'
        },
        {
            label: 'Balinese Spa',
            value: 'Balinese Spa'
        },
        {
            label: 'Candle Light Dinner with Setup at Beach',
            value: 'Candle Light Dinner with Setup at Beach'
        },
    ]
}
export function ActivityResolver(destination) {
    // console.log(avtivityList[destination])
    return avtivityList[destination];
}
