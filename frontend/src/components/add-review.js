import React, { useState, useEffect} from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams, useLocation, useNavigate} from "react-router-dom";

const AddReview = props => {
  const {id} = useParams();
  const location = useLocation()
  let navigate = useNavigate();

  useEffect(() => {
  if(!props.isLoggedIn){
    navigate('/restaurants', { replace: true }) 
    alert("Trebuie sa fii autentificat pentru a accesa aceasta pagina!")
  }
  })
  let initialReviewState = ""
  let editing = false;
  
  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.text
  }
  
  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    if (review !== ""){
      var data = {
        text: review,
        name: props.user.username,
        restaurant_id: id
      };
      if (editing) {
        data.review_id = location.state.currentReview._id
        RestaurantDataService.updateReview(data)
          .then(response => {
            setSubmitted(true);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        RestaurantDataService.createReview(data)
          .then(response => {
            setSubmitted(true);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    }      
  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            {review !== "" ? 
             <button onClick={saveReview} className="btn btn-success" >
              Submit
            </button>
             :  
             <button onClick={saveReview} className="btn btn-success" disabled >
             Submit
           </button>}
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;
