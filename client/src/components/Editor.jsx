import { useEffect, useState } from "react";
import { 
  TextField, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Divider, 
  Alert,
  Container 
} from '@mui/material';
import EducationForm from "./EducationForm";
import ExperienceForm from "./ExperienceForm"; // וודא ששם הקובץ בתיקייה הוא ExperienceForm.jsx
import axios from "axios";

const Editor = () => {
  // --- States ---
  const [experiences, setExperiences] = useState([{ id: Date.now(), title: "", description: "" }]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [educationObject, setEducation] = useState({ institution: "", yearFinished: "" });
  
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });

  // --- טעינת נתונים (GET) ---
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:3000/api/cv");
        const cvData = response.data;
        
        if (cvData) {
          setFullName(cvData.fullName || "");
          setEmail(cvData.email || "");
          setPhone(cvData.phone || "");
          setSummary(cvData.summary || "");
          setEducation(cvData.educationObject || { institution: "", yearFinished: "" });
          // מוודא שיש לפחות שורת ניסיון אחת
          setExperiences(cvData.experiences && cvData.experiences.length > 0 
            ? cvData.experiences 
            : [{ id: Date.now(), title: "", description: "" }]);
        }
      } catch (err) {
        console.error("Failed to load CV", err);
      }
    }
    getData();
  }, []);

  // --- וולידציה ---
  const validate = () => {
    let tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = "חובה להזין שם מלא";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) tempErrors.email = "כתובת אימייל לא תקינה";

    if (phone.length < 9) tempErrors.phone = "מספר טלפון קצר מדי";
    if (summary.length < 20) tempErrors.summary = "תמצית חייבת להכיל לפחות 20 תווים";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- שמירת נתונים (POST) ---
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSaveStatus({ type: "", message: "" });

    if (!validate()) return;

    const filteredExperiences = experiences.filter(
      exp => exp.title.trim() !== "" || exp.description.trim() !== ""
    );

    try {
      const payload = {
        fullName,
        email,
        phone,
        summary,
        educationObject,
        experiences: filteredExperiences
      };

      await axios.post("http://localhost:3000/api/cv/save", payload);
      setSaveStatus({ type: "success", message: "הנתונים נשמרו בהצלחה!" });
    } catch (error) {
      setSaveStatus({ type: "error", message: "שגיאה בשמירת הנתונים" });
    }
  };

  // --- ניהול ניסיון תעסוקתי ---
  const handleExperienceUpdate = (updatedExp) => {
    setExperiences(prev => prev.map(exp => exp.id === updatedExp.id ? updatedExp : exp));
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: "", description: "" }]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, direction: 'rtl' }}>
        
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
          עריכת קורות חיים
        </Typography>

        {saveStatus.message && (
          <Alert severity={saveStatus.type} sx={{ mb: 3 }}>{saveStatus.message}</Alert>
        )}

        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}>
            <TextField 
              label="שם מלא" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              error={!!errors.fullName}
              helperText={errors.fullName}
              fullWidth 
            />
            <TextField 
              label="טלפון" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth 
            />
          </Box>

          <TextField 
            label="אימייל" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            error={!!errors.email}
            helperText={errors.email}
            fullWidth 
          />

          <TextField 
            label="תמצית מקצועית" 
            value={summary} 
            multiline 
            rows={4} 
            onChange={(e) => setSummary(e.target.value)} 
            error={!!errors.summary}
            helperText={errors.summary}
            fullWidth 
          />

          <Divider sx={{ my: 2 }}>השכלה</Divider>
          
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <EducationForm 
              data={educationObject} 
              handleSubmit={(data) => setEducation(data)} 
            />
          </Box>

          <Divider sx={{ my: 2 }}>ניסיון תעסוקתי</Divider>

          {experiences.map((exp) => (
            <Box key={exp.id} sx={{ position: 'relative', p: 2, border: '1px solid #eee', borderRadius: 2 }}>
              <ExperienceForm 
                id={exp.id} 
                title={exp.title} 
                description={exp.description} 
                handleSubmit={handleExperienceUpdate} 
              />
              <Button 
                color="error" 
                size="small" 
                onClick={() => removeExperience(exp.id)}
                sx={{ mt: 1 }}
              >
                מחק שורה זו
              </Button>
            </Box>
          ))}

          <Button 
            variant="outlined" 
            onClick={addExperience} 
            sx={{ alignSelf: 'flex-start' }}
          >
            + הוסף ניסיון תעסוקתי
          </Button>

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
          >
            שמור קורות חיים
          </Button>
          
        </Box>
      </Paper>
    </Container>
  );
};

export default Editor;