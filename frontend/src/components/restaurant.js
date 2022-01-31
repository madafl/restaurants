import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams } from "react-router-dom";
// import { useJwt, decodeToken } from "react-jwt";

const Restaurant = props => {
  const {id} = useParams(); //to use the id wildcard
  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };
  const [restaurant, setRestaurant] = useState(initialRestaurantState);
  
  const getRestaurant = id => {
    RestaurantDataService.get(id)
      .then(response => {
        setRestaurant(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  useEffect(() => {
    getRestaurant(id);
  
  }, [id, props]);

  const deleteReview = (reviewId, index) => {
    //index= pozitia din array pe care e reviewul sters
    RestaurantDataService.deleteReview(reviewId, props.user.username)
      .then(response => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          { props.user.username !== "" ?
            (<Link to={"/restaurants/" + id + "/review"} className="btn btn-success">
              Add Review
            </Link>) : (
                <div >
                
                  <Link to={"/login"} className="btn btn-success">
                    Intra in cont pentru a posta un review.
                  </Link>
              </div>
            )}
            <hr></hr>
          <h4 className="top-margin"> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length !== 0 ? (
             restaurant.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.user.name}<br/>
                         <strong>Data: </strong>{new Date(review.date).toLocaleString()}
                       </p>
                       {/* //if user logged in and user id este identic cu review user id si numele... this are true then show that code */}
                       {props.user.username === review.user.name &&
                          <div className="row">
                            <button onClick={() => deleteReview(review._id, index)} className="btn btn-success col-lg-5 mx-1 mb-1" >Sterge</button>
                            <Link to={
                              "/restaurants/" + id + "/review"}
                              state= {{ currentReview: review }}
                            key = {id} className="btn btn-success col-lg-5 mx-1 mb-1">Editeaza</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;