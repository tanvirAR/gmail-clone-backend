import { Express } from "express-serve-static-core";


interface tokenData {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    tokenData: tokenData;
  }
}
