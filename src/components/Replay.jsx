//component qui gère chaque nouvelle partie

export default function Replay({ setReplay, setStop, setQuestionNumber, setEarned, setUsername, setData,replay }) {

    //au clic sur le  bouton replay, on réinitialise l'username, le stop, la question actuelle, la cagnotte actuelle et on augmente le compteur de replays
    function handleClick() {
        setReplay(prev => prev + 1)
        setEarned("$ 0")
        setQuestionNumber(1)
        setStop(false)
        setUsername(false)
    }

    return <div>
        {/* on propose à l'utilisateur de rejouer */}
        <h1 className='endText'>Play Again ?</h1>
        <button
            className='startButton'
            onClick={handleClick}
        >Replay</button>
    </div>
}