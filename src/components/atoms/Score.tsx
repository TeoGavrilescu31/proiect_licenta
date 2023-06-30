import React, { useEffect, useState } from 'react'
import './Score.css'

const Score = () => {
  const [scores, setScores] = useState([])

  useEffect(() => {
    const handleGameRestart = () => {
      const highScores = JSON.parse(localStorage.getItem('highScores') || '[]')
      setScores(highScores)
    }
    window.addEventListener('gameRestarted', handleGameRestart)

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('gameRestarted', handleGameRestart)
    }
  }, [])

  return (
    <div className="scores">
      <h1>Top Scores</h1>
      <ul>
        {scores.map((score: { score }, index) => (
          <li key={index}>{score.score}</li>
        ))}
      </ul>
    </div>
  )
}

export default Score
