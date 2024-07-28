import { set } from "mongoose"
import { useState } from "react"
import { BiCurrentLocation, BiSearch } from "react-icons/bi"

function Inputs ({setQuery, setUnits}) {
  const [city, setCity] = useState('')

  const handleSearchClick = ()=>{
    if(city !== '') setQuery({q: city})
  }

  const handleLocationClick = ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) =>{
          const {latitude, longitude} = position.coords
          setQuery({lat: latitude, lon: longitude})
      })
    }
  }
  return (
    <div className="flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input type="text" 
            onChange={(e)=> setCity(e.currentTarget.value)}
            placeholder="search by city..."
            className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus: outline-none placeholder:lowercase"/>
            <BiSearch className="cursor-pointer transition ease-out hover:scale-125" onClick={handleSearchClick}/>
            <BiCurrentLocation className="cursor-pointer transition ease-out hover:scale-125" onClick={handleLocationClick}/>
        </div>
        <div className="flex flex-row w-1/4 items-center justify-center">
        <button className="text-2xl font-medium transition ease-out hover: scale-125" onClick={()=> setUnits("metric")}>°C</button>
        <p className="text-2xl font-medium mx-3"> | </p>
        <button className="text-2xl font-medium transition ease-out hover: scale-125" onClick={()=> setUnits("imperial")}>°F</button>
        </div>
    </div>
  )
}

export default Inputs
