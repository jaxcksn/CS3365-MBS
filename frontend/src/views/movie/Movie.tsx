import { useParams } from "react-router-dom";

export default function Movie() {
  // const [loading, setLoading] = useState(true);
  // const [movieId, setMovieId] = useState("");
  const { id } = useParams();

  return <div>Movie {id}</div>;
}
