'use client'

import { getSocket } from "@/lib/socket"
import { useEffect } from "react"

const GeoUpdater = ({userId}:{userId:string}) => {

    // eslint-disable-next-line prefer-const
    let socket = getSocket()
          socket.emit("identity", userId);

    useEffect(() => {
        if (!userId) return
        if (!navigator.geolocation) return
        
     const watcher =   navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude

            socket.emit("update-location", {
                userId,
                latitude: lat,
                longitude: lon
            })
     }, (err) => {
         console.log(err)
     }, {enableHighAccuracy:true})
        
        return ()=>navigator.geolocation.clearWatch(watcher)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userId])

  return null
}

export default GeoUpdater
