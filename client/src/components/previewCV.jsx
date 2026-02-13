import { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Box, Divider, Button, Container } from "@mui/material";

const PreviewCV = () => {
  const [cvData, setCvData] = useState(null);

  // שליפת הנתונים מהשרת
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cv");
        setCvData(response.data);
      } catch (err) {
        console.error("Error fetching CV data:", err);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // בדיקת טעינה - מונע קריסה אם הנתונים עדיין לא הגיעו
  if (!cvData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography variant="h6">טוען נתונים...</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ 
      py: 4, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      backgroundColor: "#f0f2f5", 
      minHeight: "100vh" 
    }}>
      
      {/* כפתור הדפסה - משתמש בטקסט בלבד ללא איקונים */}
      <Button 
        variant="contained" 
        onClick={handlePrint} 
        sx={{ 
          mb: 4, 
          px: 6, 
          py: 1.5, 
          fontWeight: 'bold', 
          borderRadius: '8px',
          fontSize: '1.1rem'
        }}
        className="hide-on-print"
      >
        הדפס קורות חיים / שמור ל-PDF
      </Button>

      {/* דף ה-A4 הלבן */}
      <Paper 
        elevation={4} 
        sx={{ 
          width: "210mm", 
          minHeight: "297mm", 
          p: "20mm", 
          backgroundColor: "white",
          direction: "rtl", // תמיכה בעברית
          boxSizing: "border-box"
        }}
      >
        {/* ראש הדף: פרטים אישיים */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>
            {cvData.fullName || "שם מלא"}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {cvData.email} | {cvData.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: '#2c3e50', height: '2px' }} />

        {/* תמצית מקצועית */}
        {cvData.summary && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a5f7a', mb: 1.5, borderBottom: '1px solid #eee', pb: 0.5 }}>
              תמצית מקצועית
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {cvData.summary}
            </Typography>
          </Box>
        )}

        {/* ניסיון תעסוקתי */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a5f7a', mb: 2, borderBottom: '1px solid #eee', pb: 0.5 }}>
            ניסיון תעסוקתי
          </Typography>
          {cvData.experiences && cvData.experiences.length > 0 ? (
            cvData.experiences.map((exp) => (
              <Box key={exp.id} sx={{ mb: 3.5 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#34495e', mb: 0.5 }}>
                  {exp.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  whiteSpace: "pre-line", 
                  color: "#444", 
                  fontSize: '1rem',
                  lineHeight: 1.6 
                }}>
                  {exp.description}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">לא הוזן ניסיון תעסוקתי</Typography>
          )}
        </Box>

        {/* השכלה */}
        {cvData.educationObject && (cvData.educationObject.institution || cvData.educationObject.yearFinished) && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a5f7a', mb: 2, borderBottom: '1px solid #eee', pb: 0.5 }}>
              השכלה
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
              {cvData.educationObject.institution}
            </Typography>
            <Typography variant="body1">
              שנת סיום: {cvData.educationObject.yearFinished}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* הגדרות הדפסה */}
      <style>
        {`
          @media print {
            .hide-on-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            .MuiContainer-root { max-width: none !important; padding: 0 !important; }
            .MuiPaper-root { box-shadow: none !important; border: none !important; width: 100% !important; margin: 0 !important; }
          }
          @page { size: A4; margin: 0; }
        `}
      </style>
    </Container>
  );
};

export default PreviewCV;