import { useEffect, useState } from 'react';
import './App.css';

let viewsVid1;
let viewsVid2;

function App() {
  const staniURL = "https://youtube-higher-lower-api.vercel.app/getVidData"
  const [clicksShown, setClicksShown] = useState(false)
  const [vid1, setVid1] = useState({})
  const [vid2, setVid2] = useState({})
  const [points, setPoints] = useState(0)
  const [result, setResult] = useState()
  
  useEffect(()=>{
    initialize()
  },[])

  //Fetching 2 videos at the beginnning
  const initialize = async() =>{
    await fetch(staniURL).then((res)=>res.json()).then((data)=>{
      viewsVid1 = data.views
      data.views = formatNumber(data.views)
      setVid1(data)

    })
    await fetch(staniURL).then((res)=>res.json()).then((data)=>{
      viewsVid2 = data.views
      data.views = formatNumber(data.views)
      setVid2(data)
    })
  }
  //Changes video2 to video1 and video2 to an new video. Also updates the score
  const update = async(isHigher)=>{
    let resultShouldBe;
    resultShouldBe = Number(viewsVid2) > Number(viewsVid1)    
    setClicksShown(true)
    setResult(resultShouldBe === isHigher)
    resultShouldBe === isHigher ? setPoints(points+1) : setPoints(0)

    await new Promise(resolve => setTimeout(resolve, 2000));

    setClicksShown(false)
    setVid1(vid2)
    viewsVid1 = viewsVid2
    await fetch(staniURL).then((res)=>res.json()).then((data)=>{
      viewsVid2 = data.views
      data.views = formatNumber(data.views)
      setVid2(data)
    })
  }

  /**
   * Returns a Number which is seperated by spaces
   * @param {Number} number 
   * @returns {String}
   */
  const formatNumber = (number) =>{
    let numberReversed = ""
    let counter = 0
    for (let index = number.length-1; index >=0; index--) {
        numberReversed += number.charAt(index)
        counter++;
        if(counter===3 && index>=1){
            numberReversed += " "
            counter = 0
        }
    }
    let numberFormatted = ""
    for (let index = numberReversed.length-1; index >=0; index--) {
        numberFormatted += numberReversed.charAt(index)
    }
    return numberFormatted
  }
  

  return (
    <div className="App">
        <div className='links'>
          <div className='linksMitte'>
            <h1 className='channel'>{vid1.channelTitle}</h1>
            <a  href={`https://www.youtube.com/watch?v=${vid1.videoId}`}><h1 className='vidTitle'>{vid1.videoTitel}</h1></a>
            <h2 className='uploaded'>Uploaded: {vid1.publishedAt}</h2>
            <img src={vid1.thumbnailURL} alt='Bilder laden noch'/>
            <h1 className='views'>Views: {vid1.views}</h1>
          </div>
        </div>
        <hr/>
        <div className='mid'></div>
        <div className='rechts'>
          <div className='rechtsMitte'>
            <h1 className='channel'>{vid2.channelTitle}</h1>
            <h1 className='vidTitle'>{vid2.videoTitel}</h1>
            <h2 className='uploaded'>Uploaded: {vid2.publishedAt}</h2>
            <img src={vid2.thumbnailURL} alt='Bilder laden noch'/>
            <br/>
            {clicksShown ? <h1 className={result ? 'greenViews':'redViews'}>Views: {vid2.views}</h1> : <div className='buttons'><button onClick={()=>update(true)}>higher</button> <button onClick={()=>update(false)}>lower</button></div>}
          </div>
        </div>
        <h3 className='points'>Punkte: {points}</h3>
    </div>
  );
}

export default App;
