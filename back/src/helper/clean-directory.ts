import fs from "fs";

export const cleanDirectory = (path: string) => {
  try {
    fs.promises.readdir(path).then((dir) => {
      dir.forEach((file) => {
        fs.promises.unlink(`${path}/${file}`);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
