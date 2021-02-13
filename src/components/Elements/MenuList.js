import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  FundOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { SubMenu } = Menu;

const MenuList = ({ collapsed, perms, stock, getStock }) => {
  console.log(stock);
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);

  const rootSubmenuKeys = ["10", "21", "31", "41", "51", "61"];


  const onOpenChange = (openKeysList) => {
    const latestOpenKey = openKeysList.find(
      (key) => openKeys.indexOf(key) === -1
    );
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeysList);
    } else {
      const opens = latestOpenKey ? [latestOpenKey] : [];
      setOpenKeys(opens);
    }
  };

  return (
    <Menu
      openKeys={openKeys}
      // inlineCollapsed={collapsed}
      mode="inline"
      theme="light"
      onOpenChange={onOpenChange}
      className="menu-ul"
    >
        <SubMenu
          key="11"
          title={
            <span>
              <FundOutlined />
              <span>{t("admin")}</span>
            </span>
          }
        >
          <Menu.Item key="12">
            <Link to={`/`}>
              <span>{t("layoutLinks.home")}</span>
            </Link>
          </Menu.Item>
        </SubMenu>
    </Menu>
  );
};

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};

export default connect(mapStateToProps)(MenuList);
