import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";
import { FileTypesEnum } from "src/enums/file-types.enum";

@Injectable()
export class FilesService {
  async createStatic(file, type: FileTypesEnum): Promise<string> {
    const fileExt = file.originalname.split(".").at(-1);
    const fileName = uuid.v4() + `.${fileExt}`;
    const filePath = path.resolve(__dirname, "..", "..", "static", type);

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    fs.writeFileSync(path.join(filePath, fileName), file.buffer);

    return fileName;
  }

  async save(file: Express.Multer.File, filePath: string): Promise<string> {
    const resultPath = path.resolve(__dirname, "..", "..", filePath);
    const fileName = path.basename(file.originalname);
    const fullPath = path.join(resultPath, fileName);

    await fs.promises.mkdir(resultPath, { recursive: true });
    await fs.promises.writeFile(fullPath, file.buffer);

    return fullPath;
  }

  async removeStatic(fileName: string, type: FileTypesEnum) {
    const file = path.resolve(__dirname, "..", "..", "static", type, fileName);
    if (fs.existsSync(file)) {
      fs.rmSync(file);
    }
    return fileName;
  }

  async remove(path: string) {
    if (fs.existsSync(path)) {
      fs.rmSync(path);
    }
    return path;
  }

  async updateStatic(oldName: string, file, type: FileTypesEnum): Promise<string> {
    await this.removeStatic(oldName, type);
    return await this.createStatic(file, type);
  }
}
