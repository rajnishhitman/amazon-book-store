//import cloudinary related modules
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary")




//configure cloudinary
cloudinary.config({
    cloud_name: 'cognizanttraining',
    api_key: '461465923565863',
    api_secret: 'rTsakEbJFWkuc7nMaJCwU1NWys8'
});
//configure cloudinary storage
const clStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'Book-Store',
            public_key: file.fieldname + '-' + Date.now()
        }
    }
})
//configure multer
const multerObj=multer({storage: clStorage})



module.exports = multerObj;