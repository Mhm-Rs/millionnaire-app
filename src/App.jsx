//component principal
import React from "react"
import { useState, useEffect, useMemo } from 'react'

import './app.css'
import Trivia from './components/Trivia'
import Timer from './components/Timer'
import Starter from './components/Starter'
import Replay from './components/Replay'
import Confetti from 'react-confetti'

export default function App() {

    //nom de l'utilisateur (à entrer au début)
    const [username, setUsername] = useState(null)

    //numéro de la question actuelle
    const [questionNumber, setQuestionNumber] = useState(1)

    //permet d'arrêter le programme si une réponse fausse est sélectionnée
    const [stop, setStop] = useState(false)

    //contient les informations sur la question et les réponses (à passer )
    const [data, setData] = useState([])

    //montant gagné par l'utilisateur à la fin
    const [earned, setEarned] = useState('$ 0')

    //p
    const [replay, setReplay] = useState(0)

    //déplace les éléments d'un tableau à des indices aléatoires array.length-1 fois
    //utilisé pour randomizer l'ordre d'apparition des réponses
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    //à chaque nouvelle partie on prend de nouvelles questions à partir de l'API
    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple") //on récupère 15 questions et répinses faciles à catégories multiples
            .then(res => res.json())
            .then(donnees => {
                let dataArr = []
                let answersArray = []
                //ensuite on enregistre la réponse correcte dans un tableau answersArray avec un objet (propriété correct=true)
                for (let i = 0; i < 15; i++) {
                    answersArray.push({
                        text: donnees.results[i].correct_answer,
                        correct: true
                    })
                    //on ajoute les reponses incorrectes (propriété correct=false)
                    for (let j = 0; j < 3; j++) {
                        answersArray.push({
                            text: donnees.results[i].incorrect_answers[j],
                            correct: false
                        })
                    }
                    shuffleArray(answersArray) //on randomize l'ordre d'apparition des réponses
                    //on ajoute les réponses, l'id de la question et la question à dataArr
                    dataArr.push({
                        id: i + 1,
                        question: donnees.results[i].question,
                        answers: answersArray
                    })
                    answersArray = []
                    //et on recommence pour les 15 questions
                }
                setData(dataArr) //on remplit notre tableau de questions/réponses avec dataArr.
            })
    }, [replay])

    //mémoïse la pyramide des montants pouvant être gagnés une seule fois
    //.reverse() pour qu'elle apparaisse du plus grand montant au plus petit
    const moneyPyramid = useMemo(() =>
        [
            { id: 1, amount: '$ 100' },
            { id: 2, amount: '$ 200' },
            { id: 3, amount: '$ 300' },
            { id: 4, amount: '$ 500' },
            { id: 5, amount: '$ 1000' },
            { id: 6, amount: '$ 2000' },
            { id: 7, amount: '$ 4000' },
            { id: 8, amount: '$ 8000' },
            { id: 9, amount: '$ 16000' },
            { id: 10, amount: '$ 32000' },
            { id: 11, amount: '$ 64000' },
            { id: 12, amount: '$ 125000' },
            { id: 13, amount: '$ 250000' },
            { id: 14, amount: '$ 500000' },
            { id: 15, amount: '$ 1000000' },
        ].reverse(), [])

     //lorsque l'utilisateur répond correctement à une question, on affecte à sa cagnotte le montant que rapporte la question
    //selon la pyramide des montants.
    useEffect(() => {
        questionNumber > 1 && setEarned(moneyPyramid.find(money => money.id === questionNumber - 1).amount)
    }, [moneyPyramid, questionNumber])

    //enregistrer le montant le plus élevé et l'utilisateur l'ayant obtenu à chaque fin de partie
    useEffect(() => {
        //au lancement du programme, on met 'Mhm_Rs' et 0$
        if (replay === 0 && username === null) {
            localStorage.setItem("highest_person", 'Mhm_Rs')
            localStorage.setItem("highest_win", earned)
        }
        //vu que earned est un string, on prend la partie numérique et on la convertit en nombre
        let earn = Number(earned.slice(2))
        let ancient_win = Number(localStorage.getItem("highest_win").slice(2)) //pareil pour le montant le plus élevé à ce moment là
        if (stop) {
            //si la partie est finie et que le montant gagné par cet utilisateur est plus élevé que le précédent
            //on enregistre son nom et son montant dans le localStorage
            if (earn > ancient_win) {
                localStorage.setItem("highest_person", username)
                localStorage.setItem("highest_win", earned)
            }
        }

    }, [stop, earned, username, replay])


    return (
        <div className='app'>

            {!stop ? '' : earned !== '$ 0' ? <Confetti /> : ''} {/*si stop vaut true, on va arrêter la partie , les confettis apparaissent seulement 
            si l'utilisateur a répondu correctement a au moins 1 question*/}
            {username ? ( //si un nom d'utilisateur a déjà été fourni, on commence la partie
                <>
                    <div className='main'>
                        {/* afficher le plus grand score avec son détenteur (stockés dans le localStorage) */}
                        <h4 className='high_score'>High Score : {localStorage.getItem("highest_person")} with {localStorage.getItem("highest_win")}</h4>
                        {stop ? //si la partie est finie, on affiche à l'utilisateur son gain et on met un bouton pour jouer à nouveau
                            <div className='endBlock'>
                                <h1 className='endText'>You earned : {earned}</h1>
                                <Replay
                                    setReplay={setReplay}
                                    setStop={setStop}
                                    setQuestionNumber={setQuestionNumber}
                                    setEarned={setEarned}
                                    setUsername={setUsername}
                                    setData={setData}
                                    replay={replay}
                                />
                            </div> : //sinon, on affiche le timer, la question et les réponses
                            <>
                                <div className='top'>
                                    <div className='timer'>
                                        <Timer
                                            setStop={setStop}
                                            questionNumber={questionNumber}
                                        />
                                    </div>
                                </div>
                                <div className='bottom'>
                                    {/*on passe les questions, un moyen d'arrêter à trivia */}
                                    <Trivia
                                        data={data}
                                        setStop={setStop}
                                        questionNumber={questionNumber}
                                        setQuestionNumber={setQuestionNumber}
                                    />
                                </div>
                            </>
                        }
                    </div>
                        {/*on affiche la pyramide des montants
                        chaque montant obtient une couleur de fond lorsqu'on est sur la question mettant de l'obtenir */}
                    <div className='pyramid'> 
                        <ul className='moneyList'>
                            {moneyPyramid.map(money => {
                                return <li className={questionNumber === money.id ? 'moneyListItem active' : 'moneyListItem'}>
                                    <span className='moneyListItemNumber'>{money.id}</span>
                                    <span className='moneyListItemAmount'>{money.amount}</span>
                                </li>
                            })}
                        </ul>
                    </div>
                </>) : <Starter setUsername={setUsername} />} {/* s'il n'y pas encore de nom d'utilisateur, on invite l'utilisateur à en entrerun*/}

        </div>
    )
}