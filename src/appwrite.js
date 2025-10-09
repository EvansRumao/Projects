import * as appwrite from "appwrite";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new appwrite.Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new appwrite.Databases(client);

export const updatesearchCount=async(searchTerm,movie)=>{
  try{
    const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
     appwrite.Query.equal("searchTerm",searchTerm)
    ]);

    if(result.documents.length>0){
      const document=result.documents[0];
      await database.updateDocument(DATABASE_ID,COLLECTION_ID,document.$id,{
        count:document.count+1,
        // lastSearched:new Date().toISOString(),
        // movie:movie
      });
    }else{
      await database.createDocument(DATABASE_ID,COLLECTION_ID,appwrite.ID.unique(),{
        searchTerm:searchTerm,
        count:1,
        Movie_Id:movie.id,
        poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,

     } );
   }
  }catch(error){
    console.error("Error updating search count:", error);
  }
}

export const getTrendingMovies=async()=>{
  try{
     const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
      appwrite.Query.orderDesc("count"),
      appwrite.Query.limit(5)
     ]);
     return result.documents;
  }catch(error){
    console.error("Error fetching trending movies:", error);
  }

}


