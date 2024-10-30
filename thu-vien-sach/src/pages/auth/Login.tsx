import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppConstants } from "../../constants";
import { addAuth } from "../../redux/authSlice";
import { handleAPI } from "../../remotes/apiHandle";

type LoginObject = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const [loginForm] = useForm<LoginObject>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRememberme, setIsRememberme] = useState(false);
  const dispatch = useDispatch();
  const { Text } = Typography;

  const handleFormSubmitted = async () => {
    try {
      setIsLoading(true);
      let email = loginForm.getFieldValue("email") as string;
      let password = loginForm.getFieldValue("password") as string;
      email = email.trim();
      password = password.trim();
      const loginReq = {
        email,
        password,
      };
      const res = await handleAPI(`admin/login`, loginReq, "post");
      res && dispatch(addAuth({ token: res.data.token }));
      if (isRememberme) {
        localStorage.setItem(AppConstants.token, res.data.token);
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title={"Login"}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="d-flex flex-column justify-start"
        form={loginForm}
        onFinish={handleFormSubmitted}
      >
        <Form.Item<LoginObject>
          style={{
            minWidth: "400px",
          }}
          label={"Email"}
          name={"email"}
          rules={[
            {
              required: true,
              min: 7,
              pattern: AppConstants.regex.email,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item<LoginObject>
          label={"Password"}
          name={"password"}
          rules={[
            {
              required: true,
              message: "Mật khẩu không được trống",
            },
          ]}
        >
          <Input.Password allowClear />
        </Form.Item>
        <Text type="danger">{errorMessage}</Text>
        <div className="m-3">
          <Checkbox
            checked={isRememberme}
            onChange={(val: CheckboxChangeEvent) =>
              setIsRememberme(val.target.checked)
            }
          >
            Remember me
          </Checkbox>
        </div>
        <Button
          onClick={() => loginForm.submit()}
          type="primary"
          loading={isLoading}
        >
          Login
        </Button>
      </Form>
    </Card>
  );
};

export default Login;
