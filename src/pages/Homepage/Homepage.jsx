import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EntryList from "../../components/EntryList/EntryList";

function Homepage() {
  const [entryList, setEntryList] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEntryList = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.get("http://localhost:3030/api/entry/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setEntryList(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.get("http://localhost:3030/api/user/", {
        headers: { Authorization: "Bearer " + token },
      });
      setUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPageData = async () => {
    await fetchEntryList();
    await fetchUser();
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <>
      <div className="homepage">
        <div className="homepage__container">
          <p>Welcome back {user?.firstName}</p>
          <div className="homepage__list">
            <EntryList entries={entryList} fetchEntries={fetchEntryList} />
          </div>
        </div>
        <button className="homepage__add">Add Entry</button>
      </div>
    </>
  );
}

export default Homepage;
