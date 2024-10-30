import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { AiOutlineDashboard } from "react-icons/ai";
import {
  MdLibraryBooks,
  MdOutlineDiscount,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { Link } from "react-router-dom";

type Props = {
  collapsed: boolean;
};

const SiderComponent = (props: Props) => {
  const { collapsed } = props;
  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: "dash-board",
      label: (
        <Link className="nav-item" to={"/"}>
          Chung
        </Link>
      ),
      icon: <AiOutlineDashboard />,
    },
    {
      key: "book",
      label: (
        <Link className="nav-item" to={"/book"}>
          Sách
        </Link>
      ),
      icon: <MdLibraryBooks />,
    },
    {
      key: "category",
      label: (
        <Link className="nav-item" to={"/category"}>
          Danh mục sách
        </Link>
      ),
      icon: <TbCategory />,
    },
    {
      key: "discount",
      label: (
        <Link className="nav-item" to={"/discount"}>
          Mã giảm giá
        </Link>
      ),
      icon: <MdOutlineDiscount />,
    },
    {
      key: "order",
      label: (
        <Link className="nav-item" to={"/order"}>
          Đơn hàng
        </Link>
      ),
      icon: <MdShoppingCartCheckout />,
    },
  ];
  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      style={{ background: "white-smoke" }}
      color="whitesmoke"
    >
      <div style={{ height: "100px" }}>This is the place for logo</div>
      <div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{ borderRadius: "8px", height: "100vh" }}
        />
      </div>
    </Sider>
  );
};

export default SiderComponent;
