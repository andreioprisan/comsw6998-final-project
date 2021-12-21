import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Checkbox,
  Row,
  Col,
  notification,
} from "antd";
import { MailTwoTone, LockTwoTone } from "@ant-design/icons";
import { Auth } from "aws-amplify";

import { useHistory } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const onFinish = ({ email, password }) => {
    Auth.signIn({
      username: email,
      password,
    })
      .then(async (user) => {
        form.resetFields();
        await localStorage.setItem(
          "token",
          user?.signInUserSession?.accessToken?.jwtToken
        );
        await localStorage.setItem("res_id", user?.username);
        message.success(`Sign in successfully`);
        await history.push("/dashboard");
      })
      .catch((err) => {
        message.error(`${err}`);
        form.resetFields();
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row
      style={{
        width: "100%",
        height: "100%",
        marginTop: "15%",
      }}
      justify="center"
      align="middle"
      className="justify-content-center"
    >
      <Form
        name="login"
        title="Login"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          width: "30%",
        }}
      >
        <div className=" text-center mb-20">
          <h1>Login</h1>
        </div>
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email" || "number",
                required: true,
                message: "Please enter your E-mail",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<MailTwoTone />}
              placeholder="Enter your registered email"
            />
          </Form.Item>
        </Col>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },

            {
              pattern:
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,50}$/m,
              message: `Password must be 8 characters`,
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Enter your password"
            prefix={<LockTwoTone />}
          />
        </Form.Item>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item style={{ marginLeft: "15%" }}>
            <Button
              onClick={() => {
                history.push({
                  pathname: "/signup",
                });
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Row>
  );
};

export default Login;
