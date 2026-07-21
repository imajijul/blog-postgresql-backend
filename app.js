import express from 'express'
import Cors from 'cors'
import bodyParser, { urlencoded } from 'body-parser'
import router from './app/routes/routes.js'
import { dbconnect } from './app/database/db.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(Cors())
app.use(bodyParser.json({urlencoded: true}))
app.use(cookieParser())
app.use("/api", router)


// await dbconnect.connect().then(()=>{
//     console.log("db connected")
// })
// .catch(err=>{
//     console.log(err.message)
// })
try {
  await dbconnect.query("SELECT NOW()");
  console.log("✅ Database Connected");
} catch (err) {
  console.error("❌ Database Connection Failed:", err.message);
  process.exit(1);
}

dbconnect.on("error", (err) => {
  console.error("Unexpected idle client error:", err);
});

app.listen(3000, (req, res)=>{
    console.log('server starterd')
})