import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EntryPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  //   const[sketch, setSketch]=useState("")
  const [text, setText] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchEntryData = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.get(
        `http://localhost:3030/api/entry/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTitle(data.data.title);
      setDate(data.data.updated_at);
      //   setSketch(data.data.sketch)
      setText(data.data.text);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPageData = async () => {
    await fetchEntryData();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const back = () => {
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanged(true);
  };

  //   const handleSketchChange = (e) => {
  //     setSketch(e.target.value);
  //     setHasChanged(true);
  //   }

  const handleTextChange = (e) => {
    setText(e.target.value);
    setHasChanged(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");
    const editedFields = {
      title,
      //   sketch,
      text,
    };
    try {
      await axios.put(`http://localhost:3030/api/entry/${id}`, editedFields, {
        headers: { Authorization: "Bearer " + token },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="entrypage">
        <div className="entrypage__container">
          <button onClick={back}>x</button>
          <input
            className="entrypage__title"
            value={title}
            onChange={handleTitleChange}
          ></input>
          <div className="entry__date">{date}</div>
          {/* <input
          className="entrypage__sketch"
            value={title}
            onChange={(e) => setSketch(e.target.value)}
          ></input> */}
          <textarea
            className="entrypage__text"
            value={text}
            onChange={handleTextChange}
          ></textarea>
          <button onClick={handleSave} disabled={!hasChanged}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default EntryPage;
