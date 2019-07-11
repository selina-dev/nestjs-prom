import dotenv from "dotenv";
import path from "path";

loadEnvironmentVariables();
setupMocks();

function loadEnvironmentVariables() {
  dotenv.config({ path: path.resolve(__dirname, "..", "test.env") });
}

function setupMocks() {
  // Here you associate modules to their test doubles.
  // jest.mock("<pathToModule>", () => ({
  //   MockService,
  // }));
}
