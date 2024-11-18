import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppConstants } from "../constants";
import { addAuth, authState, AuthState } from "../redux/authSlice";
import { validateToken } from "../utils/jwtUtil";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

const Routers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authState);
  const dispatch = useDispatch();
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    setIsLoading(true);
    const res = localStorage.getItem(AppConstants.token) ?? undefined;
    const isValid = validateToken(res);
    res && isValid && dispatch(addAuth(JSON.parse(res)));
    setIsLoading(false);
  };
  return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
