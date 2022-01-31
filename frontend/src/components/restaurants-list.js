import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";
// import ReactPaginate from 'react-paginate';
import Pagination from "./pagination";

// list of the rest from database
const RestaurantsList = props => {
  
    const [restaurants, setRestaurants] = useState([]); // all restaurants
    const [searchName, setSearchName ] = useState("");  // 
    const [searchZip, setSearchZip ] = useState("");
    const [searchCuisine, setSearchCuisine ] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]); // all cuisines
    //pentru paginatie 
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage, setItemsPerPage] = useState(12);
     const [active, setActive] = useState(1);
    
    // the component needs to do something after render
    // retrieve restaurants and retrieve the cuisines
    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    },[]);
    
    const retrieveRestaurants = () => {
        RestaurantDataService.getAll()
        .then(response => {
            setRestaurants(response.data.restaurants); //insert the resaturants into restaurants array
        })
        .catch(e => {
        console.log(e);
        });
    };
    
    const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
        .then(response => {
        setCuisines(["Toate bucatariile"].concat(response.data)); // we start with a all cuisines element in the dropdown and then add the cuisines
        })
        .catch(e => {
        console.log(e);
        });
    };

    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
      };
    
    const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };

    const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };

    const refreshList = () => {
        retrieveRestaurants();
    };

    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then(response => {
            setRestaurants(response.data.restaurants);
            })
            .catch(e => {
            console.log(e);
            });
    };
    //http://localhost:5000/api/v1/restaurants?name=food
    const findByName = () => {
        find(searchName, "name")
    };
    
    const findByZip = () => {
        find(searchZip, "zipcode")
    };
    
    const findByCuisine = () => {
        if (searchCuisine === "Toate bucatariile") {
        refreshList();
        } else {
        find(searchCuisine, "cuisine")
        }
    };
    

      const indexOfLast = currentPage * itemsPerPage;
      const indexOfFirst = indexOfLast-itemsPerPage;
      const currentItems = restaurants.slice(indexOfFirst,indexOfLast)
      
      //Change page
      const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        setActive(pageNumber);
      } 
  return (
    <div>
      
    <div className="row pb-1">
      <div className="input-group col-lg-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cauta dupa nume"
          value={searchName}
          onChange={onChangeSearchName}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={findByName}
          >
            Cauta
          </button>
        </div>
      </div>
      <div className="input-group col-lg-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cauta dupa codul postal"
          value={searchZip}
          onChange={onChangeSearchZip}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={findByZip}
          >
            Cauta
          </button>
        </div>
      </div>
      <div className="input-group col-lg-4">
        <select className="form-select" onChange={onChangeSearchCuisine}>
           {cuisines.map(cuisine => {
             return (
               <option value={cuisine}> {cuisine.substr(0, 20)} </option>
             )
           })}
        </select>
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={findByCuisine}
          >
            Cauta
          </button>
        </div>
      </div>
    </div>
    <div className="row">
      {currentItems.map((restaurant) => {
        const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
        return (
          <div className="col-lg-4 pb-1"  >
            <div className="card">
              <div className="card-body" >
                <h5 className="card-title" >{restaurant.name}</h5>
                <p className="card-text">
                  <strong>Specific: </strong>{restaurant.cuisine}<br/>
                  <strong>Adresa: </strong>{address}
                </p>
                <div className="row">
                <Link to={`/restaurants/${restaurant._id}`} className="btn btn-success col-lg-5 mx-1 mb-1" key={restaurant._id }>
                    Reviews
                </Link>
                <a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/place/" + address} className="btn btn-success col-lg-5 mx-1 mb-1">Harta</a>
                </div>
              </div>
            </div>
            
          </div>
        );
      })}
        <Pagination itemsPerPage={itemsPerPage} itemsLength={restaurants.length} handleClick={handleClick} active = {active} page={currentPage}/>
      </div> 
    </div>
  );
}

export default RestaurantsList;
 