import express from 'express'
import { uploadPdf } from './multer.js'
import { getPdf, subirPdf, deletePdf } from './controller.js'
import { manejarErrorArchivo } from './helpers.js'

const app = express()

app.get('/pdf/:nombre', getPdf)

app.post(
  '/subir-pdf',
  uploadPdf.single('archivo'),
  subirPdf,
  manejarErrorArchivo
)

app.delete('/archivo/:tipo/:nombre', deletePdf)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
