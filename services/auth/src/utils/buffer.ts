import DataUriParser from "datauri/parser.js";
import path, { extname } from "path";
const getBuffer= (file: Express.Multer.File): Buffer => {
  const parser= new DataUriParser();
    const extname= path.extname(file.originalname
  );
  return parser.format(extname, file.buffer).content as unknown as Buffer;
};
export default getBuffer;
