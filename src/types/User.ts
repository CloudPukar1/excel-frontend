export interface IUser {
  _id: string;
  name: string;
  email: string;
  colorCode: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  name: string;
}
