const express =require("express")

const app=express();
const fs=require("fs");
const port =3000;

let cvData={}
// לקחת את האוביקט מהבדי מתווח שיודע
app.use(express.json());

app.post("/api/cv/save",(req,res)=>{
const {fullName,phone,email,summery,educationObject,skills,expiriences}=req.body;
cvData={fullName,phone,email,summery,educationObject,skills,expiriences}
fs.writeFileSync(cvData)
const stringifiedCvData=json.stringify(cvData)
console.log("./cvData.json",stringifiedCvData);

res.send("cv data saved successfuly")

})

app.get("/api/cv",(req,res)=>{
const cv=fs.readFileSync("./cvData.json")  
res.send(cv)  
})

app.listen(port,()=>{
    console.log(`started listening on port ${port}` );
    
})