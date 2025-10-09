import React, { use } from "react";
import Search  from "./components/search";
import { useEffect,useState } from "react";
import Spinner from "./components/spinner";
import Moviecard from "./components/Moviecard";
import { useDebounce } from "react-use";
import { updatesearchCount } from "./appwrite";
import { getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {

  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};


const App = () => {
   const[isLoading,setisLoading]= useState(false);
   const[searchTerm, setSearchTerm]= useState('')
   const[error,seterror]= useState(' ');
   const[movies,setmovies]= useState([])
   const[debouncedSearchTerm, setDebouncedSearchTerm]= useState('');
   const[trendingMovies,settrendingMovies]= useState('')

   useDebounce(()=>
    setDebouncedSearchTerm(searchTerm),500,[searchTerm]
   );

   const fetchMovies=async(query='')=>{
    setisLoading(true);
    seterror('');
    

   try{
    const endpoint = query ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if(data.response==='False'){
       seterror(data.error);
       setmovies([]);
       return;
    }
    setmovies(data.results);
    if(query && data.results.length>0){
    updatesearchCount(query,data.results[0]); 
    }
   }
  
  catch(error){
    console.error("Error fetching movies:", error);
    seterror("Failed to fetch movies. Please try again later.");
   } 
   finally{
    setisLoading(false);
   }
  }
    
  const LoadTrendingMovies=async()=>{
    try{
        const result=await getTrendingMovies();
        settrendingMovies(result);
    }catch(error){
      console.error("Error fetching trending movies:", error);
    }
  }



  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

useEffect(()=>{
  LoadTrendingMovies();
},[]);

  return(
    <main>
      <div className="pattern"/>
         <div className="wrapper">
            <header>
              <img src="./hero-img.png" />
              <h1> find movies <span className="text-gradient">Movies</span></h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>

                {trendingMovies.length > 0 && (
                     <section className="trending"> <h2>Trending Movies</h2>

                       <ul>
                       {trendingMovies.map((movie, index) => (
                         <li key={movie.$id}>
                         <p>{index + 1}</p>
                           <img src={movie.poster_url} alt={movie.title} />
                        </li>
                             ))}
                        </ul>
                     </section>
                    )}
             <section className="all-movies">
               <h2>Popular Movies</h2>
               
               {isLoading ?(
                <Spinner />
               ): error ?(
                <p className="text-white">{error}</p>
               ): (
                <ul>
                  {movies.map((movie)=>(
                    
                    <Moviecard key ={movie.id} movie={movie}/>

                  )
                )}
                </ul>
               )

               
              }
             </section>
             
             
          </div>
    
    </main>
  )
}

export default App;