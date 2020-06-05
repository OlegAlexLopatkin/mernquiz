import axios from "axios";

export default axios.create({
  // baseURL: "https://react-quiz-11fc8.firebaseio.com/"
  // baseURL: "https://mighty-temple-51394.herokuapp.com"
  baseURL: "http://localhost:5000"
});
