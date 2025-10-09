import React from 'react'
import '../index.css'

const Search = (props) => {
  return (
    <div className='search'>

      <div>
        <img src="../search.png" alt="search" />
         <input 
      type="text"
      placeholder='Search for movies'
      value={props.searchTerm}
      onChange={(e)=> props.setSearchTerm(e.target.value)}
      
       />
      </div>
     
    </div>
  )
}


export default Search;
