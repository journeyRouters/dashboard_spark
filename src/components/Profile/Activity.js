export const avtivityList = {


    Bali: [
        {
            label: 'Kintamani Ubud Tour',
            value: 'KintamaniUbud'
        },
        {
            label: 'Bali Swing',
            value: 'BaliSwing'
        },
        {
            label: 'Water Sports Activities',
            value: 'WaterSportsActivities'
        },
        {
            label: 'Uluwatu Temple',
            value: 'UluwatuTemple'
        },
        {
            label: 'Tanah Lot',
            value: 'TanahLot'
        },
        {
            label: 'Lempuyang Temple',
            value: 'LempuyangTemple'
        },
        {
            label: 'Nusa Penida Island',
            value: 'NusaPenidaIsland'
        },
        {
            label: 'Ayung River Rafting',
            value: 'AyungRiverRafting'
        },
        {
            label: 'Dolphin Watching Lovina Beach',
            value: 'DolphinWatchingLovinaBeach'
        },
        {
            label: 'Mount Batur Trekking',
            value: 'MountBaturTrekking'
        },
        {
            label: 'Dinner Cruise Bali Hai', 
            value: 'DinnerCruiseBaliHai' 
        },
        {
            label: 'Dinner Cruise Bounty',
            value: 'DinnerCruiseBounty'
        },
        {
            label: 'Lembongan Island Day Cruise by Bali Hai',
            value: 'LembonganIslandDayCruiseByBaliHai'
        },
        {
            label: 'Lembongan Island Day Cruise by Bounty',
            value: 'LembonganIslandDayCruisebyBounty'
        },
        {
            label: 'Monkey Forest',
            value: 'MonkeyForest'
        },
        {
            label: 'Besakih Temple',
            value: 'BesakihTemple'
        },
        {
            label: 'Dream Land Beach',
            value: 'DreamLandBeach'
        },
        {
            label: 'Balinese Spa',
            value: 'BalineseSpa'
        },
        {
            label: 'Candle Light Dinner with Setup at Beach',
            value: 'CandleLightDinnerwithSetupatBeach'
        },
    ],
    Himachal:[
        {
            label:'HipHipHurrayAmusementPark ',
            value:'HipHipHurrayAmusementPark'
        },
        {
            label:'Solang Valley ',
            value:'SolangValley'
        },
        {
            label:'Old Manali',
            value:'OldManali'
        },
        {
            label:'Naggar castle',
            value:'Naggarcastle'
        },
        {
            label:'kasol',
            value:'kasol'
        },
        {
            label:'Rohtang Pass',
            value:'RohtangPass'
        },
        {
            label:'Attal Tunnel',
            value:'AttalTunnel'
        },
        {
            label:'Hadima',
            value:'Hadima'
        },
        {
            label:'Vashisht Temple',
            value:'VashishtTemple'
        },
        {
            label:'Van Vihar',
            value:'VanVihar'
        },
        {
            label:'Tibetan monastery',
            value:'Tibetanmonastery'
        },
        {
            label:'Manu Temple',
            value:'ManuTemple'
        },

    ]
}
export function ActivityResolver(destination) {
    // console.log(avtivityList[destination])
    return avtivityList[destination];
}
