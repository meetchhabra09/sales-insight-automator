import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    setStatus("Processing...");

    try {

      await axios.post("http://localhost:5000/api/upload", formData);

      setStatus("Email Sent!");

    } catch {

      setStatus("Error");

    }

  };

  return (

    <div style={{ padding: 40 }}>

      <h2>Sales Insight Automator</h2>

      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

      <br/><br/>

      <input
        placeholder="Recipient Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <button onClick={submit}>
        Generate Report
      </button>

      <p>{status}</p>

    </div>

  );

}

export default App;