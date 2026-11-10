import serverless from "serverless-http";
// @ts-ignore
import app from "../../dist/server.cjs";

export const handler = serverless(app);
