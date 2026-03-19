const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

const competitorWords = (process.env.COMPETITOR_WORDS || 'макдональдс,mcdonalds,kfc,pizza hut')
  .split(',')
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean)

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')
let serviceAccount = null

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  } catch (error) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', error.message)
  }
}

if (!serviceAccount && fs.existsSync(serviceAccountPath)) {
  serviceAccount = require(serviceAccountPath)
}

if (!serviceAccount) {
  throw new Error('Firebase credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or add serviceAccountKey.json in project root.')
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json())

const frontendDistPath = path.join(__dirname, '..', 'my-frontend', 'dist')
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath))
}

const containsCompetitorWord = (text) => {
  const normalized = text.toLowerCase()
  return competitorWords.some((word) => normalized.includes(word))
}

const serializeReview = (doc) => {
  const data = doc.data()
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null

  return {
    id: doc.id,
    userEmail: data.userEmail || 'Анонім',
    userId: data.userId || null,
    text: data.text || '',
    rating: data.rating || null,
    createdAt,
  }
}

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' })
})

app.get('/api/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get()
    const items = snapshot.docs.map(serializeReview)
    res.json({ items })
  } catch (error) {
    res.status(500).json({ message: `Failed to load reviews: ${error.message}` })
  }
})

app.post('/api/reviews', async (req, res) => {
  const text = String(req.body.text || '').trim()
  const rating = Number(req.body.rating)
  const userEmail = String(req.body.userEmail || 'Анонім').trim()
  const userId = req.body.userId ? String(req.body.userId).trim() : null

  if (!text) {
    return res.status(400).json({ message: 'Введіть текст відгуку.' })
  }

  if (text.length > 1000) {
    return res.status(400).json({ message: 'Відгук має бути до 1000 символів.' })
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Оцінка має бути від 1 до 5.' })
  }

  if (containsCompetitorWord(text)) {
    return res.status(400).json({ message: 'Відгук містить назви конкурентів і не може бути збережений.' })
  }

  try {
    const docRef = await db.collection('reviews').add({
      userEmail,
      userId,
      text,
      rating,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const createdDoc = await docRef.get()
    res.status(201).json({ item: serializeReview(createdDoc) })
  } catch (error) {
    res.status(500).json({ message: `Failed to save review: ${error.message}` })
  }
})

app.get('/', (req, res) => {
  if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
    return res.sendFile(path.join(frontendDistPath, 'index.html'))
  }

  res.send('Backend is running. Build frontend to serve static files from Express.')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})