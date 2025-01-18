import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { AiOutlineDashboard } from "react-icons/ai";
import {
  MdBook,
  MdLibraryBooks,
  MdOutlineDiscount,
  MdPerson,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { Link } from "react-router-dom";

const SiderComponent = () => {
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
        <Link className="nav-item" to={"/books"}>
          Sách
        </Link>
      ),
      icon: <MdLibraryBooks />,
      children: [
        {
          key: "add-book",
          label: (
            <Link className="nav-item" to={"books/add-book"}>
              Thêm sách
            </Link>
          ),
        },
      ],
    },
    {
      key: "category",
      label: (
        <Link className="nav-item" to={"/categories"}>
          Danh mục sách
        </Link>
      ),
      icon: <TbCategory />,
    },
    {
      key: "membership",
      label: (
        <Link className="nav-item" to={"/memberships"}>
          Gói thành viên
        </Link>
      ),
      icon: <TbCategory />,
    },
    {
      key: "authors",
      label: (
        <Link className="nav-item" to={"/authors"}>
          Tác giả
        </Link>
      ),
      icon: <MdPerson />,
    },
    {
      key: "publisher",
      label: (
        <Link className="nav-item" to={"/publishers"}>
          Nhà xuất bản
        </Link>
      ),
      icon: <TbCategory />,
    },
    {
      key: "discount",
      label: (
        <Link className="nav-item" to={"/discounts"}>
          Mã giảm giá
        </Link>
      ),
      icon: <MdOutlineDiscount />,
    },
    {
      key: "book-requested",
      label: (
        <Link className="nav-item" to={"/requested-book"}>
          Đơn yêu cầu
        </Link>
      ),
      icon: <MdBook />,
    },
    {
      key: "order",
      label: (
        <Link className="nav-item" to={"/orders"}>
          Đơn hàng
        </Link>
      ),
      icon: <MdShoppingCartCheckout />,
    },
  ];
  return (
    <Sider
      trigger={null}
      collapsed={false}
      style={{ background: "white-smoke", borderRadius: "8px", height: "100%" }}
      color="whitesmoke"
    >
      {/* <div style={{ height: "100px" }}>This is the place for logo</div> */}
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
