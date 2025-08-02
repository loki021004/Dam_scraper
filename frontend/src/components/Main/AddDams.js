import React, { useEffect, useState } from 'react'
import './AddDams.css'
import { IoAddCircle } from "react-icons/io5";
import axios from 'axios';

const AddDams = ({onSubmit, tamil}) => {
    const [name,setname]=useState('')
    const [suggestions, setSuggestions]= useState([]);

    const handleChange=e=> setname(e.target.value)

    const handleSubmit = e =>{
        e.preventDefault()
        onSubmit(name)
        setname('')
    }

    useEffect(()=>{
      const delaySearch = setTimeout(()=>{
        if (name.trim()!==''){
          axios.get(`http://localhost:5000/ourdams/search?q=${name}`)
            .then(res=> setSuggestions(res.data))
            .catch(err => console.error('search error:',err));
        }else{
          setSuggestions([]);
        }
      },300);
      return ()=> clearTimeout(delaySearch);
    },[name]);

    const handleSuggestionClick = (selectedName)=>{
      setname(selectedName);
      setSuggestions([]);
    }

    const labels = {
      placeholder: tamil ? "அணையின் பெயரை உள்ளிடுங்கள்..." : "Add dams . . .",
      tooltip: tamil ? "சேர்க்கவும்" : "Add"
    };
    
  return (
    <div className='adddams'>
      <input type='text' value={name} onChange={handleChange} placeholder={labels.placeholder} required/>
      <button onClick={handleSubmit} title = {labels.tooltip}><IoAddCircle /></button>

      {suggestions.length > 0 && (
        <ul className='suggestions-list'>
          {suggestions.map((dam, idx) => (
            <li key={idx} onClick={() => handleSuggestionClick(dam.damName)}>
              {dam.damName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AddDams