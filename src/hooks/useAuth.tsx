import { cookie } from "@/lib/utils";
import { ILogin, IRegister, IUser } from "@/types/User";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/services/User";

interface IAuthContext {
  user?: IUser;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  login: (data: ILogin) => Promise<void>;
  register: (data: IRegister) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as IAuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser>();

  const navigate = useNavigate();

  const logout = () => {
    cookie.remove("auth_token");
    navigate("/");
    setUser(undefined);
  };

  const handleAuthResponse = (token: string) => {
    console.log(token);
    debugger
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode<IUser>(token));
    navigate("/sheet");
  };

  const login = async (data: ILogin) => {
    const {
      data: {
        data: { token },
      },
    } = await loginUser(data);
    handleAuthResponse(token);
  };

  const register = async (data: IRegister) => {
    const {
      data: {
        data: { token },
      },
    } = await registerUser(data);
    handleAuthResponse(token);
  };

  useEffect(() => {
    const authToken = cookie.get("auth_token");
    authToken && setUser(jwtDecode<IUser>(authToken));
    document.addEventListener("unauthorized", logout);

    return () => {
      document.removeEventListener("unauthorized", logout);
    };
  }, []);

  return (
    <AuthContext
      value={{
        user,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
