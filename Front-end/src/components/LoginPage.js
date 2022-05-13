import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";
 
class LoginPage extends React.Component {
  formRef = React.createRef(); //创建一个ref的object
  state = {
    asHost: false,
    loading: false,
  };
 
  onFinish = () => {
    console.log("finish form");
  };
 
  handleLogin = async () => {
    const formInstance = this.formRef.current; //引用之前创建的ref
 
    try {
      await formInstance.validateFields(); //可以做validation，validation不通过就return
    } catch (error) {
      return;
    }
 
    this.setState({ // validation 通过就先把loading 设置为true（固定写法）
      loading: true,
    });
 
    try { // 然后拉取所需数据&参数
      const { asHost } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      // ”await“ 等价于 “then”，等到当前语句执行完成后再执行下面的语句，属于syntax sugar，优化阅读
      this.props.handleLoginSuccess(resp.token, asHost);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleRegister = async () => {
    const formInstance = this.formRef.current;
 
    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }
 
    this.setState({
      loading: true,
    });
 
    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    });
  };
 
  render() {
    return (
      <div style={{ width: 500, margin: "20px auto" }}>

        <Form ref={this.formRef} onFinish={this.onFinish}> 
        {/* 这里的onFinish可以不填，它在当前语法中完全没有被触发 */}

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              placeholder="Password"
            />
          </Form.Item>

        </Form>


        <Space>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asHost} // controlled component
            onChange={this.handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button //如果出现了HTMLType === submit, 就会trigger onFinish, 
          //此处两个button的作用完全不一样，所以单独抽取出来书写单独的业务定义
            onClick={this.handleLogin}
            disabled={this.state.loading} //当前state没结束时两个button会disable
            shape="round"
            type="primary" //ant design的默认颜色
          >
            Log in
          </Button>
          <Button
            onClick={this.handleRegister}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>


      </div>
    );
  }
}
 
export default LoginPage;
