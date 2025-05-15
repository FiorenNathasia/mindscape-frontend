import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EntryList from "../../components/EntryList/EntryList";
import axios from "axios";

function Homepage() {
  const [entryList, setEntryList] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEntryList = async () => {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/entry/`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    setEntryList(data.data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    setUser(data.data);
  };

  const fetchPageData = async () => {
    try {
      await fetchEntryList();
      await fetchUser();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const addEntry = () => {
    navigate("/addentry");
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (isLoading) return <p>Loading</p>;

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="homepage">
        <div className="homepage__container">
          <p style={{ color: "black" }}>Welcome back {user?.firstName}</p>
          <div className="homepage__list">
            <EntryList entries={entryList} fetchEntries={fetchEntryList} />
          </div>
        </div>
        <button className="homepage__add" onClick={addEntry}>
          Add Entry
        </button>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}

export default Homepage;
