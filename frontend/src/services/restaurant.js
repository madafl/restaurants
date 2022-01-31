import http from "../http-common";

//http://localhost:5000/api/v1/restaurants?page=0
class RestaurantDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }
    //url base url from http common /id/$id
    //http://localhost:5000/api/v1/restaurants/id/5eb3d668b31de5d588f4292a
    get(id) {
        return http.get(`/id/${id}`);
    }
    //the searched term, serached by name
    find(query, by = "name", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    } 
    // http://localhost:5000/api/v1/restaurants/review?text=Nice&restaurant_id=5eb3d668b31de5d588f4292c&user_id=1234&name=madafl
    createReview(data) {
        const token = localStorage.getItem('token');
        return http.post(`/review?text=${data.text}&restaurant_id=${data.restaurant_id}&name=${data.name}`, data, { headers :  {'Authorization': `${JSON.parse(token)}`}});
    }
   // http://localhost:5000/api/v1/restaurants/review?text=very good soup22&review_id=61d424f2afb6c9114a0a2073&user_id=1234&name=madafl
    updateReview(data) {
        console.log(data)
        return http.put(`/review?text=${data.text}&review_id=${data.review_id}&name=${data.name}`, data);
    }

    deleteReview(id, name) {
        return http.delete(`/review?id=${id}&name=${name}`);
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    }

    createUser(data) {
        return http.post(`/register?username=${data.username}&password=${data.password}`,data)
    }

    login(data) {
      return http.post(`/login?username=${data.username}&password=${data.password}`, data)
    }
   
}

export default new RestaurantDataService();
