const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const app = express();
const PORT = 5000;
const JWT_SECRET = "my_secret_key_2345";

// 1. Middlewares
// CORS: React frontend (localhost:5173) lo allow karega
// Bulletproof CORS Configuration (Har port ko allow karega)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight request ko approve karo
  }
  next();
});
app.use(express.json());

// 2. Database Setup (SQLite File)
// yeh ek real database file banayega: server/database.sqlite

const db = new DatabaseSync(path.join(__dirname, "database.sqlite"));

// Users table banate hain (Agar pehle se nahi bani ho )

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT NOT NULL,
    role TEXT DEFAULT 'Frontend Developer',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  `);

// Ek demo user pehle se daal dete hain taaki testing kar sakein

try {
  const checkUser = db
    .prepare("SELECT *  FROM users WHERE email = ?")
    .get("rahul@test.com");
  if (!checkUser) {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    const insert = db.prepare(
      "INSERT INTO users(username, email, password, fullName) VALUES(?,?,?,?)",
    );
    insert.run("rahul123", "rahul@test.com", hashedPassword, "Rahul Sharma");
    console.log("✅ Demo user ready: rahul@test.com / password123");
  }
} catch (e) {
  console.log("User check error:", e.message);
}

// 3. APIs (Frontend yahan request bhejega)

// [A] REGISTER APT: Naye user ko Database main save krna

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Check kro user pehle se to nhi hai
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
      .get(email, username);
    if (existing) {
      return res
        .status(400)
        .json({ sucess: false, message: "Username or Email already exists!" });
    }

    // Password ko encrypt (hash) karo

    const hashedPassword = await bcrypt.hash(password, 10);

    // Database me insert karo

    const stmt = db.prepare(
      "INSERT INTO users (username, email, password, fullName) VALUES (?, ?, ?, ?)  ",
    );
    const info = stmt.run(username, email, hashedPassword, fullName);

    // Token banoa (user ka ID card)

    const token = jwt.sign(
      { userId: Number(info.lastInsertRowid) },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: Number(info.lastInsertRowid),
        username,
        email,
        fullName,
        role: "Frontend Developer",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// [B] LOGIN API: Details verify karana aur Token bhejna
app.post("/api/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields!" });
    }
    // Database se user dhundo
    const user = db
      .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
      .get(emailOrUsername, emailOrUsername);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    }
    // Password check karo (bcrypt compare)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password!" });
    }
    // Token banao
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    // Frontend ko User details + Token wapas bhejo
    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// [C] GET PROFILE API: Token verify karke user ki latest details dena
app.get("/api/profile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided!" });
    }
    const token = authHeader.split(" ")[1]; // "Bearer <TOKEN>" se token nikalna
    const decoded = jwt.verify(token, JWT_SECRET);
    // Database se user nikaalo
    const user = db
      .prepare(
        "SELECT id, username, email, fullName, role, createdAt FROM users WHERE id = ?",
      )
      .get(decoded.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token!" });
  }
});
// ----------------------------------------------------
// React Frontend ko Serve karna (Like a Real Website)
// ----------------------------------------------------
app.use(express.static(path.join(__dirname, "../client/dist")));

// Koi bhi route ho (jaise /login, /portal), Express React ka index.html bhej dega
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
// 4. Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
