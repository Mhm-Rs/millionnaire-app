//component permettant d'afficher les questions et les réponses

import React from 'react'
import { useState, useEffect } from 'react'
import useSound from 'use-sound'
import play from '../assets/play.wav'
import correct from '../assets/correct.wav'
import wrong from '../assets/wrong.mp3'

export default function Trivia({
    data,
    setStop,
    questionNumber,
    setQuestionNumber,
}) {

    //la question actuelle (et ses réponse)
    const [question, setQuestion] = useState(null)
    //la réponse sélectionnée par l'utilisateur
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    //pour changer la classe de chaque réponse (et l'afficher différemment)
    const [className, setClassName] = useState("answer")
    
    //les sons de début de jeu, de réponse correcte et incorrecte.
    const [letsPlay] = useSound(play)
    const [correctAnswer] = useSound(correct)
    const [wrongAnswer] = useSound(wrong)

    //au début de la partie on joue le son de début du jeu
    useEffect(() => {
        letsPlay()
    }, [letsPlay])

    //à chaque bonne réponse (et au début de la partie) on change la question et les réponses qui seront affichées
    useEffect(() => {
        setQuestion(data[questionNumber - 1])
    }, [data, questionNumber])

    //fonction d'exécution d'une certaine fonction après un certain temps
    const delay = (duration, callback) => {
        setTimeout(() => {
            callback()
        }, duration)
    }

    //pour gérer le click sur une bonne réponse
    const handleClick = (answer) => {
        setSelectedAnswer(answer)
        //si une réponse est sélectionnée elle aura un fond bleu
        setClassName("answer active")
        //après 3 secondes on joue l'animation de réponse correcte ou fausse
        delay(3000, () => setClassName(answer.correct ? 'answer correct' : 'answer wrong'))
        //si la réponse est correcte, on joue le son de réponse correcte et on passe à la question suivante
        delay(5000, () => {
            if (answer.correct) {
                correctAnswer();
                delay(1000, () => {
                    setQuestionNumber(prev => prev + 1)
                    setSelectedAnswer(null)
                    if (questionNumber === 15)
                        setStop(true)
                })
            }
            //sinon, on joue le son de réponse fausse et on arrête le programme
            else {
                wrongAnswer()
                delay(1000, () => setStop(true))
            }
        })
    }

    return (
        <div className='trivia'>
            <div
                className='question'
                //lorsqu'on a récupéré les questions de l'API, on affiche la question actuelle  en remplaçant les caractères spéciaux
            >{question?.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&aacute;/g, "a").replace(/&eacute;/g, "e").replace(/&oacute;/g, "o")}
            </div>
            <div className='answers'>
                {/*lorsqu'on a récupéré les questions de l'API , on affiche les réponses actuelles*/}
                {question?.answers.map(answer => {
                    return <div
                        //si selectedAnswer n'est pas nul (ie si on a cliqué sur une réponse) on met un style à la réponse (answer correct si elle est vraie et answer wrong sinon)
                        className={selectedAnswer === answer ? className : 'answer'}
                        onClick={() => handleClick(answer)}

                    > {/*on affiche les réponses en remplaçant les caractères spéciaux */}
                        {answer.text.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&aacute;/g, "a").replace(/&eacute;/g, "e").replace(/&oacute;/g, "o")}</div>
                })}

            </div>
        </div>
    )
}