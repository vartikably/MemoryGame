import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [gridSize,setGridSize] = useState(4);
  const [cards,setCards] = useState([]);
  const [solvedCards,setSolvedCards] = useState([]);
  const [flippedCards,setFlippedCards] = useState([]);
  const [disabled,setDisabled] = useState(false);
  const [won,setWon] = useState(false);
  const [moves,setMoves] = useState();
  const initializeGame = ()=>{
      const totalCards = gridSize * gridSize;
      const pairCount = Math.floor(totalCards/2);
      const numbers = [...Array(pairCount).keys()].map((n)=> n+1);
      const shuffledCards = [...numbers,...numbers]
                              .sort(()=> Math.random() - 0.5)
                              .slice(0,totalCards)
                              .map((number,index)=>({id:index,number}));
      console.log(shuffledCards)
      setCards(shuffledCards);
      setSolvedCards([]);
      setFlippedCards([]);
      setWon(false);
      setMoves(0);
  }
  const handleGridSizeChange=(e)=>{
   const val = parseInt(e.target.value);
   if(val>=2 && val<=10)setGridSize(val);
  };
  useEffect(()=>{
    initializeGame();
  },[gridSize]);
  const checkMatch = (secondId)=>{
    const [firstId] = flippedCards;
    if(cards[firstId].number === cards[secondId].number){
      setSolvedCards([...solvedCards,firstId,secondId]);
      setFlippedCards([]);
      setDisabled(false);
    }
    else{
      setTimeout(()=>{
        setFlippedCards([]);
        setDisabled(false);
      },1000)
    }
  }
  const handleClick= (id)=>{
    if(disabled || won) return;
    setMoves(moves+1);
    if(flippedCards.length===0){
      setFlippedCards([id]);
      return;
    }
    if(flippedCards.length ===1){
      setDisabled(true);
      if(id !== flippedCards[0]){
          setFlippedCards([...flippedCards,id]);
          checkMatch(id);
      }
      else{
        setFlippedCards([]);
        setDisabled(false);
      }
    }
  }
  const isFlipped= (id)=>flippedCards.includes(id)|| solvedCards.includes(id);
  const isSolved = (id)=>solvedCards.includes(id);
  useEffect(()=>{
    if(solvedCards.length===cards.length && cards.length>0)
      setWon(true);
  },[solvedCards,cards])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className='text-3xl font-bold mb-4 font-serif'>Memory Game</h1>
      {/* input */}
      <div className='mb-4'>
        <label htmlFor='gridSize' className='mr-1'>Grid Size: (max 10)</label>
        <input type="number" className='border-2 border-gray-300 rounded px-2 py-1 mr-1 w-12' id="gridSize" min="2" max="10" value={gridSize} onChange={handleGridSizeChange}/>
      </div>
      {/* Game Board */}
        <div className={`grid gap-2 mb-3 border-2 p-3 border-gray-100`} style={{gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}>
          {cards.map((card)=>{
            return <div key={card.id} className={`aspect-square flex items-center justify-center border-2 rounded-lg
             text-xl cursor-pointer transition-all duration-300 ${isFlipped(card.id)? isSolved(card.id)?"bg-green-400":"bg-blue-400 text-white":"bg-gray-50 text-gray-700"}`} onClick={()=>handleClick(card.id)}>{isFlipped(card.id)?card.number:"?"}</div>
          })}
        </div>
      {/* Result */}
      {won && (<div className='text-green-500 font-semibold text-3xl animate-bounce'>You Won !!!</div>)}
      {/* reset play button */}
      <button onClick={()=>{initializeGame()}} className='bg-green-400 px-4 py-2 mt-4 text-white rounded hover:bg-green-600 transition-colors text-lg'>{won?"Play Again":"Reset"}</button>
    </div>
  );
}

export default App;
