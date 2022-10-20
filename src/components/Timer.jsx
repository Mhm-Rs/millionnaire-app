//component permettant d'afficher le temps imparti
import { useEffect } from 'react';
import { useState } from "react"

export default function Timer({setStop,questionNumber}) {
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        //si le temps est écoulé on affiche 0
        if(timer===0) return setStop(true)

        //on diminue le temps du state timer après chaque seconde, puis on clear avec setInterval et clearInterval
        const interval = setInterval(() => {
            setTimer(prev=>prev-1)
        }, 1000)
        return () => clearInterval(interval)
    },[setStop,timer])

    //on réaffiche un nouveau timer de 30s après chaque question
    useEffect(() => {
        setTimer(30)
    },[questionNumber])
    return timer;
}