import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import './ShowDams.css';
import { FiRefreshCw } from "react-icons/fi";
import {BsFillVolumeUpFill} from "react-icons/bs";


const ShowDams = ({Dams, handleDelete, refresh, tamil}) => {
  const [tilt,setTilt] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  

  const labels = {
    "Full Depth": tamil ? "முழு ஆழம்" : "Full Depth",
    "Full Capacity": tamil ? "முழு கொள்ளளவு" : "Full Capacity",
    "Current Water Level": tamil ? "தற்போதைய நீர் நிலை" : "Current Water Level",
    "Storage": tamil ? "சேமிப்பு" : "Storage",
    "Inflow": tamil ? "நுழைவு" : "Inflow",
    "Outflow": tamil ? "வெளியேற்றம்" : "Outflow",
    "Date": tamil ? "தேதி" : "Date",
    "My Dams": tamil ? "எனது அணைகள்" : "My Dams"
  };
  const damNameMap = {
  "Krishna Raja Sagar": "கிருஷ்ண ராஜா சாகர்",
  "Kabini": "கபினி",
  "Harangi": "ஹரங்கி",
  "Hemavathy": "ஹேமாவதி",
  "BHAVANISAGAR": "பவானிசாகர்",
  "AMARAVATHI*": "அமராவதி",
  "Periyar**": "பெரியாறு",
  "Vaigai": "வைகை",
  "Papanasam (TN EB Dam)": "பாபநாசம் (தமிழ்நாடு மின் வாரியம் அணை)",
  "Manimuthar": "மணிமுத்தாறு",
  "Pechiparai": "பெச்சிப்பாறை",
  "Perunchani": "பெருஞ்சாணி",
  "Krishnagiri": "கிருஷ்ணகிரி",
  "Sathanur": "சாத்தனூர்",
  "Sholayar": "சோலையாறு",
  "Parambikulam": "பரம்பிக்குளம்",
  "Aliyar": "ஆளியார்",
  "Thirumurthy": "திருமூர்த்தி",
  "METTUR": "மேட்டூர்"
};


  useEffect(()=>{
    const handleOrientation = (e) =>{
      const gamma = e.gamma || 0;
      setTilt(gamma);
    };
    window.addEventListener('deviceorientation',handleOrientation);

    return ()=>{
      window.removeEventListener('deviceorientation',handleOrientation);
    };
  },[]);



  const handleSpeak = (dam) => {
    const message = `
      ${tamil ? 'அணையின் பெயர்' : 'Dam Name'}: ${dam.damName}.
      ${labels["Full Depth"]}: ${dam.fullDepth}.
      ${labels["Full Capacity"]}: ${dam.fullCapacity}.
      ${labels["Current Water Level"]}: ${dam.currentWaterLevel}.
      ${labels["Storage"]}: ${dam.currentStorageVolume}.
      ${labels["Inflow"]}: ${dam.inflow}.
      ${labels["Outflow"]}: ${dam.outflow}.
      ${labels["Date"]}: ${dam.date}
    `;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = tamil ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='body'>
      <h2>{labels["My Dams"]}</h2>
      <ul>
        {Dams.map(s=>{
          const levelPercent = Math.min(
            (parseFloat(s.currentWaterLevel) / parseFloat(s.fullDepth)) * 100,100);

          return(
            <li className={`data flip-card ${flippedCards[s._id] ? 'flipped':''}`} key={s._id} onClick={() =>toggleFlip(s._id)}>
              <div className='flip-inner'>
                <div className='flip-face flip-front'>
                  <div className={`video-wrapper ${s.currentWaterLevel >= s.fullDepth ? "full" : "not-full"}`} style={{
                    height: `${levelPercent}%`,
                    transform: `rotateZ(${tilt * 0.3}deg)`
                  }}>
                    <video autoPlay muted loop playsInline>
                      <source src="/fish.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <h3>{tamil ? (damNameMap[s.damName] || s.damName) : s.damName}</h3>
                  <p className='first'>{labels["Full Depth"]}: {s.fullDepth}</p>
                  <p>{labels["Full Capacity"]}:{s.fullCapacity}</p>
                  <p>{labels["Current Water Level"]}:{s.currentWaterLevel}</p>
                  <p>{labels["Storage"]}:{s.currentStorageVolume}</p>
                  <p>{labels["Inflow"]}:{s.inflow}</p>
                  <p>{labels["Outflow"]}:{s.outflow}</p>
                  <p className='date'>{labels["Date"]}:{s.date}</p>
                  <button onClick={(e)=>{e.stopPropagation(); refresh(s.damName)}} title='Refresh'><FiRefreshCw /></button>
                  <button onClick={(e)=>{e.stopPropagation(); handleDelete(s._id)}} title='Delete'><FaTrashAlt /></button>
                  <button onClick={(e)=> {e.stopPropagation(); handleSpeak(s)}} title='Read Aloud'><BsFillVolumeUpFill/></button>
                </div>

                <div
                  className="flip-face flip-back"
                  style={{
                  backgroundImage: `url(/images/${s.damName.toLowerCase().replace(/\W/g, '') || 'default'}.jpg)`
                  
                }}>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowDams