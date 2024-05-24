import path from 'node:path'
import fs from 'node:fs/promises'
import { nuevoNombrePdf } from './multer.js'
import { pool } from './db.js'

export const getPdf = async (req, res) => {
  const { nombre } = req.params
  const extension = path.extname(nombre)

  if (extension !== '.pdf') {
    return res.status(400).json({ message: 'Debes proporcionar un nombre válido (ej: archivo.pdf)' })
  }

  const rutaCarpeta = path.resolve('./uploads/pdf')
  const rutaArchivo = path.join(rutaCarpeta, nombre)
  await fs.access(rutaArchivo, fs.constants.F_OK)
  res.sendFile(rutaArchivo)
}

export const subirPdf = async (req, res) => {
  if (nuevoNombrePdf === null) {
    return res.status(500).json({ message: 'No se pudo subir el Pdf' })
  }

  const [resultado] = await pool.execute('INSERT INTO pdfs(pdf, usuario) VALUES (?, "Juan")', [nuevoNombrePdf])

  if (resultado.affectedRows === 1) {
    return res.status(201).json({ message: 'Se guardó el Pdf correctamente!' })
  }

  res.status(500).json({ message: 'Error interno' })
}

export const deletePdf = async (req, res) => {
  const { tipo, nombre } = req.params
  if (tipo !== 'pdf' && tipo !== 'imagen') return res.status(400).json({ message: 'Tipo de archivo desconocido' })

  const nombreTabla = tipo === 'imagen' ? 'imagenes' : 'pdfs'
  const nombreColumna = tipo === 'imagen' ? 'imagen' : 'pdf'
  const carpetaNombre = tipo === 'imagen' ? 'img' : 'pdf'

  const rutaCarpeta = path.resolve(`./uploads/${carpetaNombre}/${nombre}`)
  await fs.unlink(rutaCarpeta)

  const [resultado] = await pool.execute(`DELETE FROM ${nombreTabla} WHERE ${nombreColumna} = ?`, [nombre])
  res.json({ message: 'Archivo eliminado' })

  if (resultado.affectedRows === 1) {
    return res.json({ message: 'Archivo eliminado!' })
  }

  return res.status(500).json({ message: 'Error Interno' })
}
