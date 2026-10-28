import { useCallback, useEffect, useState } from "react";

import API, { getErrorMessage } from "../../api/api";

/*
  Loads an admin endpoint and exposes { data, loading, error, reload }.
  reload() re-fetches after a create / update / delete.
*/
export default function useAdminData(url, initial = []) {

  const [data, setData] = useState(initial);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);

  useEffect(() => {

    let cancelled = false;

    API.get(url)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load data."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };

  }, [url, version]);

  const reload = useCallback(() => {

    setLoading(true);

    setVersion((v) => v + 1);

  }, []);

  return { data, loading, error, reload };

}
