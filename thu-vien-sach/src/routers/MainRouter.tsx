import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderComponent from "../pages/components/SiderComponent";
import AuthorPage from "../pages/main/authors/AuthorPage";
import AddBookPage from "../pages/main/book/AddBookPage";
import BookDetail from "../pages/main/book/BookDetail";
import BookPage from "../pages/main/book/BookPage";
import BookReader from "../pages/main/book/BookReader";
import CategoryDetail from "../pages/main/category/CategoryDetail";
import CategoryPage from "../pages/main/category/CategoryPage";
import DiscountPage from "../pages/main/discount/DiscountPage";
import HomePage from "../pages/main/home/HomePage";
import MembershipPage from "../pages/main/membership/MembershipPage";
import OrderPage from "../pages/main/order/OrderPage";
import PublisherDetail from "../pages/main/publisher/PublisherDetail";
import PublisherPage from "../pages/main/publisher/PublisherPage";

const MainRouter = () => {
  return (
    <div className="container-fluid p-0 m-0">
      <BrowserRouter>
        <Layout>
          <SiderComponent />
          <Layout>
            {/* <HeaderComponent /> */}
            <Content className="m-3 p-3">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BookPage />} />
                <Route path="/books/add-book" element={<AddBookPage />} />
                <Route path="/books/detail/:id" element={<BookDetail />} />
                <Route path="/books/detail/:id/read" element={<BookReader />} />
                <Route path="/authors" element={<AuthorPage />} />
                <Route path="/publishers" element={<PublisherPage />} />
                <Route path="/publishers/:id" element={<PublisherDetail />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/categories/:id" element={<CategoryDetail />} />
                <Route path="/memberships" element={<MembershipPage />} />
                <Route path="/discounts" element={<DiscountPage />} />
                <Route path="/orders" element={<OrderPage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
};

export default MainRouter;
