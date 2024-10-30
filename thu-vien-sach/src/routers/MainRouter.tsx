import { Avatar, Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";

import { useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderComponent from "../pages/components/SiderComponent";
import BookPage from "../pages/main/book/BookPage";
import CategoryPage from "../pages/main/category/CategoryPage";
import DiscountPage from "../pages/main/discount/DiscountPage";
import HomePage from "../pages/main/home/HomePage";
import OrderPage from "../pages/main/order/OrderPage";

const MainRouter = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  return (
    <div className="container-fluid ">
      <BrowserRouter>
        <Layout>
          <SiderComponent collapsed={isMenuCollapsed} />
          <Layout>
            <Header
              style={{ padding: 0, backgroundColor: "red" }}
              className="row"
            >
              <Button
                type="text"
                icon={
                  isMenuCollapsed ? (
                    <AiOutlineMenuUnfold />
                  ) : (
                    <AiOutlineMenuFold />
                  )
                }
                onClick={() => setIsMenuCollapsed}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                  backgroundColor: "white",
                }}
              />
              <div className="row">
                <Avatar
                  size={50}
                  alt="User Avatar image"
                  src={""}
                  style={{ marginRight: "8px" }}
                />
              </div>
            </Header>
            <Content className="m-3 p-3">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/discount" element={<DiscountPage />} />
                <Route path="/order" element={<OrderPage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
};

export default MainRouter;
