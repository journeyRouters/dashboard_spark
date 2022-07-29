const RoomType = {
    ADAARANCLUBRANNALHI: [
        {
            label:"StandardRoom",
            value:"StandardRoom",
            },
            {
            label:"WaterBungalow",
            value:"WaterBungalow",
            },
    ],
    OBLUHELENGELI:[
        {
            label:"BeachVilla",
            value:"BeachVilla",
            },
            {
            label:"WatervillaWithPool",
            value:"WatervillaWithPool",
            },
            {
            label:"DeluxeBeachVilla",
            value:"DeluxeBeachVilla",
            },
            {
            label:"TwoBedroomBeachPoolSuite",
            value:"TwoBedroomBeachPoolSuite",
            },
    ],
    ADAARANSELECTHUDHURANFUSHI: [
        {
            label:"BeachVilla",
            value:"BeachVilla",
            },
            {
            label:"DeluxeBeachVilla",
            value:"DeluxeBeachVilla",
            },
            {
            label:"DeluxeFamilyBeachVilla",
            value:"DeluxeFamilyBeachVilla",
            },
            {
            label:"DuplexHoneymoonSuite",
            value:"DuplexHoneymoonSuite",
            },
            {
            label:"FamilyBeachVilla",
            value:"FamilyBeachVilla",
            },
            {
            label:"HoneymoonSuite",
            value:"HoneymoonSuite",
            },
            {
            label:"JacuzziBeachVilla",
            value:"JacuzziBeachVilla",
            },
            {
            label:"SunsetBeachVilla",
            value:"SunsetBeachVilla",
            },
            {
            label:"WaterVilla",
            value:"WaterVilla",
            },
    ]

}
export function RoomTypeReflector(property) {
    // console.log(avtivityList[destination])
    return RoomType[property.toUpperCase()];
}