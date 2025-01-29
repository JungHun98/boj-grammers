import { execSync } from "child_process";

export const dockerBuild = () => {
  try {
    execSync("docker build -t test-image ./docker");
    execSync("docker run -d --name test-app test-image");
  } catch (error) {
    console.error(
      `Error occurred while building Docker image: ${(error as any).message}`
    );
    process.exit(1);
  }
};
