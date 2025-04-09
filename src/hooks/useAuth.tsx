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
import toast from "react-hot-toast";

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
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode<IUser>(token));
    navigate("/sheet");
  };

  const login = async (data: ILogin) => {
    try {
      const {
        data: {
          data: { token },
        },
      } = await loginUser(data);
      handleAuthResponse(token);
    } catch (error: any) {
      toast.error(error?.message);
      if (error.message === "User not exist") navigate("/login");
    }
  };

  const register = async (data: IRegister) => {
    try {
      const {
        data: {
          data: { token },
        },
      } = await registerUser(data);
      handleAuthResponse(token);
    } catch (error: any) {
      toast.error(error?.message);
    }
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
