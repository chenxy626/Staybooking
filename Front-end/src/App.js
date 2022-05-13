import { Layout, Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import GuestHomePage from "./components/GuestHomePage";
 
const { Header, Content } = Layout;
 
class App extends React.Component {
  state = {
    authed: false,
    asHost: false,
  };
 
  componentDidMount() {
    const authToken = localStorage.getItem("authToken"); // localStrorage是浏览器里的一个存储空间
    const asHost = localStorage.getItem("asHost") === "true";
    
    //Improvement: 可以先检查如果authToken不存在，不需要re-render，直接return（保持当前state就可以） 

    this.setState({
      authed: authToken !== null,  //如果检查有token（暂时不检查expire）就认为已登录
      asHost,
    });
  }
 
  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };
 
  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };
 
  renderContent = () => {
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }

 
    if (this.state.asHost) {
      return <HostHomePage />;

    }
 
    return  <GuestHomePage />;
  };
 
  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );
 
  render() {
    return (
      <Layout style={{ height: "100vh" }}>  
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stays Booking
          </div>
          {this.state.authed && ( //如果&&左边为TRUE，页面变成&&右面的格式-->带着下拉菜单；如果&&左边为false就整条语句显示为空
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }} //"calc"是CSS build-in的计算function
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}
 
export default App; //加 default，import 语法中就可以不加花括号
