import { useState } from "react";
import TextField from "@mui/material/TextField";

const EducationForm = ({ handleSubmit }) => {
  const [institution, setInstitution] = useState("");
  const [yearFinished, setYearFinished] = useState("");

  const handleSave = () => {
    handleSubmit({ institution, yearFinished });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <TextField
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="Institution"
      />

      <TextField
        value={yearFinished}
        onChange={(e) => setYearFinished(e.target.value)}
        placeholder="Year Finished"
      />

      <button type="button" onClick={handleSave}>
        Save Education
      </button>
    </div>
  );
};

export default EducationForm;
