import React from 'react'

const Moviecard = ({movie
 :{title,poster_path,vote_average,release_date,original_language}

}) => {
  return (
    <div className='movie-card'>
      <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} />
      <div className='mt-4'>
        <h3 className='text-white font-bold'>{title}</h3>
        <div className='rating'>
          <img src="../star.png" alt="star" /> 
          <p>{vote_average?vote_average.toFixed(1):`N/A`}</p>
          <span className='text-white'> {original_language}</span>
        </div>
        <div>
          <p className='text-white'>Release Date: {release_date.split('-')[0]}</p>
        </div>

      </div>
    </div>
  )
}

export default Moviecard