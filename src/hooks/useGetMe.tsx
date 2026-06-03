'use client'

import { AppDispatch } from "@/redux/store"
import { setUser } from "@/redux/userSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

function useGetMe() {
    const dispatch= useDispatch<AppDispatch>()
    useEffect(() => {
        const getMe = async() => {
   try {
       const result = await axios.get("/api/me")
       dispatch(setUser(result.data))
    //    console.log(result.data)
   } catch (error) {
    console.log(error)
   }  
        } 
        getMe()
 },[])
}

export default useGetMe
