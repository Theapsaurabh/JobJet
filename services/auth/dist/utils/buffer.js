import DataUriParser from "datauri/parser.js";
import path, { extname } from "path";
const getBuffer = (file) => {
    const parser = new DataUriParser();
    const extname = path.extname(file.originalname);
    return parser.format(extname, file.buffer).content;
};
export default getBuffer;
//# sourceMappingURL=buffer.js.map