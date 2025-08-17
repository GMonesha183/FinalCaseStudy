import { useParams } from "react-router-dom";
import Reviews from "../pages/Reviews";

export default function ReviewsWrapper() {
  const { hotelId } = useParams();
  const token = localStorage.getItem("token"); // get user token
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // get user info

  return <Reviews hotelId={hotelId} token={token} user={user} />;
}
