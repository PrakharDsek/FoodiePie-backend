import multer from "multer";
const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("files");

export default singleUpload;
