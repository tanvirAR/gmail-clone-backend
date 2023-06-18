
export interface signUpUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface HashedUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
}