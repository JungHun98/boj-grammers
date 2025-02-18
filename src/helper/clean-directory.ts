import fs from "fs";

export const cleanDirectory = (path: string) => {
  try {
    fs.readdirSync(path).forEach((file) => {
      fs.unlinkSync(`${path}/${file}`);
    });
  } catch (err) {
    console.log(err);
  }
};
