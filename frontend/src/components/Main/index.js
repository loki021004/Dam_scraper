import styles from "./styles.module.css";
import { useState,useEffect} from 'react';
import AddDams from './AddDams';
import './index.css';
import ShowDams from './ShowDams';
import axios from 'axios';

const Main = () => {
	const [Dams,setDams] = useState([])
  	const [tamil, setTamil]=useState(false)

	const toggleLanguage = () => {
    setTamil(prev => !prev)
  	}


  	const fetchData = async () => {
      try {
    	const token = localStorage.getItem("token");
    	if (!token) {
    	  alert("Please log in to view your dams.");
    	  return;
    	}

    	const res = await axios.get("http://localhost:5000/ourdams", {
    	  headers: {
    	    "x-auth-token": token
      	}
    	});
    	setDams(res.data);
  	} catch (error) {
    	console.error("Fetch error:", error);
    	alert("Unable to fetch dams. Please log in.");
  	}
	};

  	useEffect(() => {
  	  fetchData();
  	}, []);

  	const handleDelete = async (id) => {
	  try {
    	const token = localStorage.getItem("token");
    	if (!token) {
    	  alert("Please log in to delete dams.");
    	  return;
    	}

    	await axios.delete(`http://localhost:5000/ourdams/${id}`, {
    	  headers: {
    	    "x-auth-token": token
    	  }
    	});
		fetchData();
  	} catch (error) {
    	console.error("Delete error:", error);
    	alert("Unable to delete dam.");
  	}
	};

  	const handleSubmit =async (name) =>{
    	if (!name || !name.trim()) {
    	  alert('Please enter a dam name before submitting!');
    	  return;
    	}
    	try{  
    	  const token = localStorage.getItem("token");
    	if (!token) {
    	  alert("Please log in to add dams.");
    	  return;
    	}

    	await axios.post("http://localhost:5000/ourdams", { name }, {
    	  headers: {
    	    "x-auth-token": token
    	  }
    	});
    	fetchData();

    	}catch(error){
    	  if (error.response&&error.response.status===404){
    	    alert("Dam not found. Please Enter the correct dam Name")
    	  }else if(error.response&&error.response.status===409){
    	    alert("Dam already exists in your list!")
    	  }else{
    	    alert("An Error occured.Please Enter the correct Dam name")
    	  }
    	}
  	}
  	const handleRefresh = async (name) => {
  	try {
    	const token = localStorage.getItem("token");
    	if (!token) {
    	  alert("Please log in to refresh dams.");
    	  return;
    	}

    	await axios.put("http://localhost:5000/ourdams", { name }, {
    	  headers: {
    	    "x-auth-token": token
    	  }
    	});

    	fetchData();
  	} catch (error) {
    	console.error("Refresh error:", error);
    	alert("Unable to refresh dam data.");
  	}
	};


	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>{tamil ? "அணைகள் நீர்மட்டம்" : "Dam Water Level"}</h1>
			
				<button className={styles.white_btn} onClick={toggleLanguage}>
           			{tamil ? 'English' : 'தமிழ்'}
        		</button>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
				</nav>

				<AddDams onSubmit={handleSubmit} tamil={tamil} />
      			<ShowDams Dams={Dams} handleDelete={handleDelete} refresh ={handleRefresh} tamil = {tamil} />
			
		</div>
	);
};

export default Main;