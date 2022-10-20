//component de bienvenue et de présentation au début de chaque partie

import { useRef } from "react"

export default function Starter({setUsername}) {

    const inputRef = useRef();

    //on enregistre le nom entré par l'utilisateur lorsqu'on appuie sur le bouton start
    const handleClick = () => {
        inputRef.current.value && setUsername(inputRef.current.value)
    }
    return (
        <div className='start'>
            <img src='/million.jpg' className='logo' alt=''/>
            <input
                type='text'
                placeholder='Enter your name'
                className='startInput'
                ref={inputRef}
            />
            <button className='startButton' onClick={handleClick}>START</button>
        </div>
    )
}