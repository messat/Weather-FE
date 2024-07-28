import {DateTime} from "luxon"

const apiKey = "8e9ff8f67718045796837347d7946e07"

const baseURL = "https://api.openweathermap.org/data/2.5/"

const getWeatherData = (infoType, searchParams)=>{
    const url = new URL (baseURL + infoType)
    url.search = new URLSearchParams({...searchParams, appid: apiKey})
    return fetch(url)
    .then((res)=>{
       return res.json()
    })
   
}

const iconUrlFromCode = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

const formatToLocalTime = (secs, 
    offset, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a ") => {
    return DateTime.fromSeconds(secs + offset, {zone: 'utc'}).toFormat(format)

}

const formatCurrent = (data)=>{
    const { 
        coord : {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather, 
        wind: {speed},
        timezone,
} = data

const {main: details, icon } = weather[0]
const formattedLocaltime = formatToLocalTime(dt, timezone)

return {
    temp, 
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocaltime,
    dt,
    timezone,
    lat,
    lon


}
}


const formatForecastWeather = (secs, offset, data) =>{
    //hourly
        const hourly = data
        .filter(forecastObj => forecastObj.dt > secs)
        .map((f)=>({
            temp: f.main.temp,
            title: formatToLocalTime(f.dt, offset, "hh:mm a"),
            icon: iconUrlFromCode(f.weather[0].icon),
            date: f.dt_txt
        }))
        .slice(0,5)
    //daily
    const daily = data
    .filter((f)=> f.dt_txt.slice(-8) === "00:00:00")
    .map((f)=>({
        temp: f.main.temp,
        title: formatToLocalTime(f.dt, offset, "ccc"),
        icon: iconUrlFromCode(f.weather[0].icon),
        date: f.dt_txt
    }))
    
    return { hourly, daily }
}

const getFormattedWeatherData = async (searchParams)=>{
    const formattedCurrentWeather = await getWeatherData("weather", searchParams)
    .then(formatCurrent)
    
    const {dt, lat, lon, timezone } = formattedCurrentWeather

    const formattedForecastWeather = await getWeatherData("forecast", {
        lat, 
        lon,
        units: searchParams.units,
    }).then((d)=> formatForecastWeather(dt, timezone, d.list))
    return {...formattedCurrentWeather, ...formattedForecastWeather}
}

export default getFormattedWeatherData