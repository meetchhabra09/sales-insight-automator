import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!file || !email) {
      setStatus("Please upload a file and enter email.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {

      setLoading(true);
      setStatus("Generating AI summary...");

      await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setStatus("✅ Summary generated and email sent!");

    } catch (error) {

      setStatus("❌ Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <div className="card">

        <h1>Sales Insight Automator</h1>

        <p>
          Upload a sales dataset and receive an AI-generated executive summary
          directly in your inbox.
        </p>

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Generate Report"}
        </button>

        {status && <p className="status">{status}</p>}

      </div>

    </div>

  );

}

export default App;