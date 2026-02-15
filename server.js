const express = require("express");
const cors = require("cors");
const db = require("./db");

const jwt = require("jsonwebtoken");
const SECRET = "mysecretkey"; //later put in .env

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});
const bcrypt = require("bcryptjs");

function auth(req, res, next) {
    const authHeader = req.headers.authorization;;
    if(!authHeader) {
        return res.status(403).json({error: "No token"});
    }
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        :authHeader;
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({error: "Invalid token"});
        }
        req.userId = decoded.id;
        next();
    });
}
app.get("/contact-info", (req, res) => {
    res.json({
        phone: "+91-8303648135",
        email: "deeptimishra@gmail.com",
        linkedin: "https://linkedin.com//in//deeptimishra5467"
    });
});

app.post("/register", async (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err) => {
            if (err) return res.status(400).json({error: "User exists"});
            res.json({message: "User registerd"});
        }
    );
});

/* Login */
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    
    db.query("SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if(err) {
                return res.status(500).json({error: "DB error"});
            }
            // User Exists
            if(result.length > 0){
                //check password
                if(result[0].password !== password) {
                    return res.status(401).json({error: "Wrong Password"});
                }
                const token = jwt.sign(
                    {id: result[0].id},
                    SECRET,
                    {expiresIn: "1h"}
                );
                return res.json({token});
            }
            db.query(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                [email,password],
                (err, insertResult) => {
                    if(err) {
                        return res.status(500).json({error: "Insert failed"});
                    }
                    const token = jwt.sign(
                        {id: insertResult.insertId},
                        SECRET,
                        {expiresIn: "1h"}
                    );
                    res.json({token});
                }
            );
        }
    );
});

/* contact form */
app.post("/contact", (req,res) => {
   const {name, email, message} = req.body;
   const sql = "INSERT INTO contact_request (name, email, message) VALUES (?, ?, ?)";
   db.query(sql, [name, email, message], (err, result) => {
    if(err) {
        console.log(err);
        res.send("Error");
    }else {
        res.send("Message Saved");
    }
   });
});

app.listen(5000, () => console.log("Server running on 5000"));