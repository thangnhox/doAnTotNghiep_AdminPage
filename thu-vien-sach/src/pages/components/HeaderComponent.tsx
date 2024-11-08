import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const HeaderComponent = () => {
  const { Text } = Typography;
  const menu: ItemType<MenuItemType>[] = [
    {
      key: "infomation",
      label: <Text>Thông tin chung</Text>,
    },
    {
      key: "setting",
      label: <Text>Cài đặt</Text>,
    },
    {
      key: "logout",
      label: <Text>Đăng xuất</Text>,
    },
  ];
  return (
    <Header
      style={{ padding: 0, backgroundColor: "grey" }}
      className="d-flex align-items-between align-items-center"
    >
      <div className="col"></div>
      <div className="d-flex flex-row align-items-center gap-3 pe-3">
        {/* <Dropdown menu={menu} placement="bottom">
          <Avatar alt="User Avatar Image" src="" size={50} />
        </Dropdown> */}
      </div>
    </Header>
  );
};

export default HeaderComponent;
