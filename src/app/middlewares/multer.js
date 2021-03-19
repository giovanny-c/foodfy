const multer = require('multer')


const storage = multer.diskStorage({ //configurando onde as imagens serão armazenadas
    destination: (req, file, cb) => {
        cb(null, './public/images') //onde serao salvas
    
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`)//configurando o nome do arquivo na hora de salvar
    
    }

})

const fileFilter = (req, file, cb) => {

    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg' ].find(acceptedFormat => acceptedFormat == file.mimetype)
//quais tipos de imagem serão aceitas
    

    if(isAccepted){
        return cb(null, true)
    }

    return cb(null, false)
}

module.exports = multer({
    storage,
    fileFilter
})