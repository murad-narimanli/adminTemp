import React from "react";
import Loader from "./Elements/Loader";
import { connect } from "react-redux";
import TopMenu from "./Layout/TopMenu/TopMenu";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./Layout/Login/Login";
import { getUserData } from "./../redux/actions";
import MenuList from "./Elements/MenuList";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { Button, Drawer, notification } from "antd";
import logo from "../assets/img/logo.svg";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { withTranslation } from "react-i18next";
import history from "../const/history";
import Home from "./Pages/Home/Home";
const { Content, Sider } = Layout;

class App extends React.Component {
  state = {
    collapsed: window.innerWidth < 1200,
    web: true,
    ismap: false,
    stocks: null,
    isWhite: true
  };

  toggleButtons = () => {
    const className = `flex sider-btn ${
      this.state.collapsed ? "all-center" : "flex-between open"
    }`;
    return (
      <div className={className}>
        {!this.state.collapsed ? (
          <Link to="/">
            {" "}
            <img src={logo} alt="" />{" "}
          </Link>
        ) : null}
        <Button type="primary" onClick={this.onCollapse}>
          {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    );
  };


  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
    this.setState({ web: window.innerWidth > 1200 });
  };

  componentDidMount() {
    this.props.getUserData();
    this.setState({ web: window.innerWidth > 1200 });
    window.addEventListener("resize", () => {
      this.setState({
        web: window.innerWidth > 1200,
        collapsed: window.innerWidth < 1200,
      });
    });
    this.setState({ ismap: window.location.pathname === "/" , isWhite: window.location.pathname === "/"  });
    history.listen((location) => {
      this.setState({ ismap: location.pathname === "/" , isWhite: location.pathname === "/" });
    });
  }

  componentDidUpdate(prevProps) {
    const prev = prevProps.notification;
    const curr = this.props.notification;
    if (prev.notify !== curr.notify) {
      let desc = !curr.isHappy
        ? curr.description?.status === 400
          ? curr.description.data
          : this.props.t("errorMessage")
        : curr.description;
      notification.info({
        message: curr.isHappy
          ? this.props.t("successMessage")
          : this.props.t("errMessage"),
        description: desc.length ? desc : null,
        icon: curr.isHappy ? <SmileOutlined /> : <FrownOutlined />,
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <>
        {this.props.isLoading ? <Loader /> : null}
        {this.props.isLoggedIn ? (
          <>
            <div id="page">
              <Layout className="letside">
                {this.state.web ? (
                  <Sider
                    className="side-menu"
                    style={{ backgroundColor: "white" }}
                    collapsed={this.state.collapsed}
                    collapsedWidth={80}
                    onCollapse={this.onCollapse}
                    width={300}
                  >
                    {this.toggleButtons()}
                    <MenuList collapsed={this.state.collapsed} />
                  </Sider>
                ) : (
                  <Drawer
                    className="drawer"
                    width={320}
                    title={this.toggleButtons()}
                    placement="left"
                    closable={false}
                    onClose={this.onCollapse}
                    visible={!this.state.collapsed}
                    key="key"
                  >
                    <MenuList collapsed={this.state.collapsed} />
                  </Drawer>
                )}
                <Layout
                  className={
                    this.state.collapsed
                      ? "collapsedRight"
                      : "nonCollapsedRight"
                  }
                >
                  <TopMenu
                    toggleDrawer={this.onCollapse}
                    showDrawerButton={!this.state.web}
                    collapsed={this.state.collapsed}
                  />
                  <Content>
                    <div
                      className={`page-routes`}
                    >
                      <Switch>
                        <Route
                          exact
                          path={`/`}
                          component={Home}
                        />
                        <Redirect to="/" />
                        <Route path="/">
                          <p className='flex all-center h-100vh'>Not found</p>
                        </Route>
                      </Switch>
                    </div>
                  </Content>
                </Layout>
              </Layout>
            </div>
          </>
        ) : (
          <>
            <Switch>
              <Route exact path="/" component={Login} />
                {/* <Route exact path="/register" component={Register}/> */}
              <Route path="/">
                <p className='flex all-center h-100vh'>Not found</p>
              </Route>
            </Switch>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ user, loader, notification }) => {
  return {
    isLoggedIn: user.isLoggedIn,
    isLoading: loader,
    notification,
  };
};

const exp = withTranslation()(App);
export default connect(mapStateToProps, { getUserData })(exp);
