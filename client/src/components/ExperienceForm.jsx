import { useState } from "react";
import { TextField, Button, Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

const ExperienceForm = ({ id, title, description, handleSubmit }) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDesc, setLocalDesc] = useState(description);
  const [loading, setLoading] = useState(false);

  // פונקציה לעדכון ה-State הראשי ב-Editor
  const onSaveClick = () => {
    handleSubmit({ id, title: localTitle, description: localDesc });
    alert("הניסיון עודכן בטופס הראשי!");
  };

  // פונקציה לשיפור התיאור בעזרת AI
  const improveWithAI = async () => {
    if (!localDesc || localDesc.length < 5) {
      return alert("אנא כתוב תיאור קצר לפני השימוש ב-AI");
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/improve-experience", {
        role: localTitle,
        description: localDesc
      });

      const aiText = response.data.improvedText;
      
      // שואלים את המשתמש אם הוא מאשר את השינוי
      if (window.confirm(`הצעת ה-AI:\n\n${aiText}\n\nהאם להשתמש בניסוח זה?`)) {
        setLocalDesc(aiText);
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("שגיאה בחיבור ל-AI. וודא שהשרת פועל ומפתח ה-API תקין.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField
        label="תפקיד / כותרת"
        variant="outlined"
        fullWidth
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
      />
      
      <Box sx={{ position: 'relative' }}>
        <TextField
          label="תיאור התפקיד"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
        />
        
        <Button 
          size="small" 
          onClick={improveWithAI} 
          disabled={loading}
          sx={{ 
            mt: 1, 
            color: '#6200ea', 
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : "✨ שפר תיאור ב-AI"}
        </Button>
      </Box>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={onSaveClick}
        sx={{ alignSelf: 'flex-end' }}
      >
        עדכן שורת ניסיון
      </Button>
    </Box>
  );
};

export default ExperienceForm;