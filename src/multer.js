import multer from 'multer'

export let nuevoNombrePdf = null

const storagePdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/pdf')
  },
  filename: function (req, file, cb) {
    nuevoNombrePdf = `${Date.now()}-${file.originalname}`
    cb(null, nuevoNombrePdf)
  }
})

const pdfFilter = (req, file, cb) => {
  const mimeType = file.mimetype
  const mimePermitidos = ['application/pdf']

  if (mimePermitidos.includes(mimeType)) {
    return cb(null, true)
  } else {
    cb(new Error('Archivo no aceptado'))
  }
}

export const uploadPdf = multer({ storage: storagePdf, fileFilter: pdfFilter })
