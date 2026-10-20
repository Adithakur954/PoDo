import multer from "multer";
import path from "node:path"; // in older you can use path module from node.js to work with file and directory paths. The path module provides utilities for working with file and directory paths. In this case, we are using the path.resolve() method to get the absolute path of the "tmp/uploads" directory.
const uploadDir = path.resolve("tmp/uploads"); // this is the directory where the uploaded files will be stored. The path.resolve() method is used to get the absolute path of the directory, which is "tmp/uploads" in this case.
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir); // cb is callback function that is called when the destination directory is determined. The first argument is an error (if any), and the second argument is the destination directory. In this case, we are passing null as the first argument to indicate that there is no error, and uploadDir as the second argument to specify the destination directory for the uploaded files.
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // null is passed as the first argument to indicate that there is no error, and uniqueName is passed as the second argument to specify the filename for the uploaded file.
    },
});
export const upload = multer({
    storage, // storage is the storage engine that will be used to store the uploaded files. In this case, we are using diskStorage, which saves the files to the disk.
});
//# sourceMappingURL=upload.middleware.js.map