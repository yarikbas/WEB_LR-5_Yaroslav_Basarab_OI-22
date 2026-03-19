const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static('public'));

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// })

// app.get('/api/message', (req, res) => {
//     res.json({ message: 'Hello from the backend!' });
// });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.get('/api/message', async (req, res) => {
    const snapshot = await 
db.collection('messages').get();
    const users = [];
    snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
});

// Verify Firebase Auth Token (Middleware)
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};

// Protected route (Only accessible with a valid token)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

// Login
// Fetch Protected API Data
async function getProtectedData() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  try {
    const token = await getIdToken(user);
    const response = await fetch("http://localhost:5000/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    alert(JSON.stringify(data));
  } catch (error) {
    alert("Error fetching protected data: " + error.message);
  }
}