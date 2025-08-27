import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import { GoogleGenAI } from '@google/genai'

const app = express()
const upload = multer()
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

const GEMINI_MODEL = "gemini-2.5-flash"

app.use(express.json())

const PORT = 9000
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`))

function extractText(resp) {
    try {
        const text = 
        resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
        resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
        resp?.response?.candidates?.[0]?.content?.text

        return text ?? JSON.stringify(resp, null, 2)
    } catch (err) {
        console.error("Error extracting text", err)
        return JSON.stringify(resp, null, 2)
    }
}

// Generate text
app.post('/generate-text', async(req, res) => {
    try {
        const { prompt } = req.body
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        })
        res.json({ result: extractText(resp) })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})