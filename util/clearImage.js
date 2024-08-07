import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const clearImage = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Dosya silinirken bir hata oluştu:", err);
    } else {
      console.log("Dosya başarıyla silindi.");
    }
  });
};

export default clearImage;
