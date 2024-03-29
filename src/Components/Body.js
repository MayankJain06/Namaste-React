import RestaurantCard ,{withPromotedLabel}from "./RestaurantCard"
import { useEffect, useState, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from "../utils/UserContext";


const Body = () => {

    // Local State variable -Super Powerful variable
    const [listOfRestaurants, setlistofRestaurants] = useState([]);
    const [filteredRestaurants,setFilteredRestaurants] =useState([]);
    const [searchText, setsearchText] = useState("");

    console.log(listOfRestaurants);
    
    const RestaurantCardPromoted = withPromotedLabel(RestaurantCard);

    const { loggedInUser ,setUserName } =useContext(UserContext);

    // Whenever state variable update react triggers reconciliation cycle( re-renders the component)
    console.log("Body rendered");
        useEffect(()=>{
            fetchData();
        }, []);

      const fetchData= async () =>{
        const data = await fetch("https://corsproxy.io/?https%3A%2F%2Fwww.swiggy.com%2Fdapi%2Frestaurants%2Flist%2Fv5%3Flat%3D17.4853202%26lng%3D78.4453532%26is-seo-homepage-enabled%3Dtrue%26page_type%3DDESKTOP_WEB_LISTING%20%20%20%20%20%20%20%20%20");
        console.log(data);
        const jsondata = await data.json();
        console.log(jsondata);
        // Optional Chaining
      setlistofRestaurants(JSON.parse(JSON.stringify(jsondata?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants)));
      setFilteredRestaurants(JSON.parse(JSON.stringify(jsondata?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants)));
      };


      const onlineStatus =useOnlineStatus();
      if(onlineStatus === false) return <h1>Looks like you are offline!! Please check your internet conection</h1>;
      
  //Condtional Rendering
    return listOfRestaurants.length === 0 ? ( <Shimmer /> ) : (
        <div className="body">
            <div className="filter flex">
              <div className="search m-4 p-4">
                <input type="text" className="border border-solid border-black" placeholder="Search for an Restaurant" value={searchText} onChange={(e)=>setsearchText(e.target.value)}/>
                <button className="py-2 px-4 m-4 bg-green-100 rounded-lg" onClick={()=>{
                  // Filter the restaurant card and update the UI
                  // searchText 
                  console.log(searchText);

                  const filteredRestaurants = listOfRestaurants.filter((res)=>{
                   return res.info.name.toLowerCase().includes(searchText.toLowerCase());
                  });

                  setFilteredRestaurants(filteredRestaurants);
                }}>Search</button>
              </div>
              <div className="search m-4 p-4 flex items-center">
              <button className="py-2 px-4 m-4 bg-gray-100 rounded-lg" onClick={()=>{
                   // Filtering Logic
                   const filteredRestaurants = listOfRestaurants.filter(res=>res.info.avgRating>=4);
                   console.log(filteredRestaurants);
                   setFilteredRestaurants(filteredRestaurants);
                }}>Top Rated Restaurants</button>
              </div>
              <div className="search m-4 p-4 flex items-center">
                <label>UserName : </label>
              <input 
              className="border border-black p-2" 
              onChange={(e)=> setUserName(e.target.value)}
              value={loggedInUser}></input>
              </div>
            </div>
            <div className="flex flex-wrap">
            {filteredRestaurants.map((restaurant)=>  (
            <Link key={restaurant.info.id} to={"/restaurants/" + restaurant.info.id}> 
             { restaurant.data?.promoted ? (
              <RestaurantCardPromoted resData ={restaurant}/> ):( <RestaurantCard resData ={restaurant}/> ) }
            </Link>
              ))}
            </div>
        </div>
    )
}

export default Body;