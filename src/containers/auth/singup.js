import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col, Modal } from "antd";
import { Auth } from "aws-amplify";
const Signup = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState();
  const onFinish = ({ email, password, address, name }) => {
    console.log("Success:", email, "p", password);
    setEmail(email);
    Auth.signUp({
      username: email,
      password: password,
      attributes: { email, address, name },
    })
      .then((data) => {
        setVisible(true);
        console.log(data);
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const renderVerificationModal = () => {
    const OnVerification = ({ code }) => {
      // const email = "puja@uptoupmail.com";
      Auth.confirmSignUp(email, code)
        .then((data) => {
          console.log(data);
          setVisible(false);
          message.success(`Sign Up successfully`);
          form2.resetFields();
          form.resetFields();
          setEmail("");
        })
        .catch((err) => {
          console.log(err);
          form2.resetFields();
          form.resetFields();
          alert(err);
        });
    };

    const resendCode = () => {
      // const email = "puja@uptoupmail.com";
      Auth.resendSignUp(email)
        .then(() => {
          console.log("code resent successfully");
        })
        .catch((e) => {
          console.log(e);
        });
    };
    return (
      <Form
        name="verification"
        // title="Sign Up"
        form={form2}
        layout="vertical"
        onFinish={OnVerification}
        onFinishFailed={onFinishFailed}
        style={{
          width: "100%",
        }}
      >
        <Col span={24}>
          <Form.Item
            name="code"
            label="Verification code"
            rules={[
              {
                required: true,
                message: "Please enter your Verification code",
              },
            ]}
          >
            <Input size="large" placeholder="Enter your Verification code" />
          </Form.Item>
        </Col>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item style={{ marginLeft: "10%" }}>
            <Button
              onClick={() => {
                resendCode();
              }}
            >
              Resend Code
            </Button>
          </Form.Item>
        </Row>
      </Form>
    );
  };
  return (
    <Row
      style={{
        width: "100%",
        height: "100%",
        marginTop: "10%",
      }}
      justify="center"
      align="middle"
      className="justify-content-center"
    >
      <Form
        name="sign up"
        form={form}
        title="Sign Up"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          width: "30%",
        }}
      >
        <div className=" text-center mb-20">
          <h1>Sign Up</h1>
        </div>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Restaurant Name"
            rules={[
              {
                required: true,
                message: "Please enter your Restaurant Name",
              },
            ]}
          >
            <Input size="large" placeholder="Enter your Restaurant Name" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Restaurant Address"
            rules={[
              {
                required: true,
                message: "Please enter your Restaurant Address",
              },
            ]}
          >
            <Input size="large" placeholder="Enter your Restaurant Address" />
          </Form.Item>
        </Col>
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
            <Input size="large" placeholder="Enter your registered email" />
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
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        visible={visible}
        title="Verification"
        // onOk={this.handleOk}
        onCancel={() => {
          setVisible(false);
        }}
        footer={[]}
      >
        {renderVerificationModal()}
      </Modal>
    </Row>
  );
};

export default Signup;
