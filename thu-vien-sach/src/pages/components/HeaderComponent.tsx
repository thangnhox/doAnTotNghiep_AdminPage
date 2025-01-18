import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const HeaderComponent = () => {
  const { Text } = Typography;
  return (
    <Header
      style={{ padding: 0, backgroundColor: "grey" }}
      className="d-flex align-items-between align-items-center"
    >
      <div className="col"></div>
      <div className="d-flex flex-row align-items-center gap-3 pe-3">
      </div>
    </Header>
  );
};

export default HeaderComponent;
