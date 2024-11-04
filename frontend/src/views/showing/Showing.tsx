import { useEffect, useState } from "react";
import { useMBS } from "../../hooks/ProviderHooks";
import { MovieInformation } from "../../types/api.model";
import apiService from "../../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { APP_MODE } from "../../constants/Constants";
import { Notifications } from "@mantine/notifications";

export default function Showing() {
  const mbs = useMBS();
  const [loading, setLoading] = useState(true);
  const [showing, setShowing] = useState<MovieInformation | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowing = async () => {
      try {
        if (id) {
          const result = await apiService.getMovie(id);
          setShowing(result);
          setLoading(false);
        }
      } catch {
        navigate("/");
      }
    };

    if (!showing) {
      if (mbs.cachedShowing && mbs.cachedShowing.id === id) {
        setShowing(mbs.cachedShowing);
        setLoading(false);
      } else {
        if (mbs.cachedShowing && mbs.cachedShowing.id !== id) {
          console.error(
            "Cached showing does not match the id. This is an error condition.",
            mbs.cachedShowing
          );
          if (APP_MODE === "DEV") {
            Notifications.show({
              title: "Dev Error",
              message:
                "Cached showing does not match the route id. This is an error condition.",
              color: "red",
            });
          }
        }

        fetchShowing();
      }
    }
    mbs.setCachedShowing(undefined);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Showing for {showing?.title}</h1>
    </div>
  );
}
