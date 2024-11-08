import { Button, Card, Image, Table, TableProps } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Book from "../../../models/Book";

const BookPage = () => {
  const navigate = useNavigate();
  const tableColums: TableProps<Book>["columns"] = [
    {
      title: "Mã sách",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình ảnh",
      dataIndex: "coverUrl",
      key: "coverUrl",
      render: (_, { coverUrl }) => (
        <>
          <Image src={coverUrl} alt="Book Cover Image" />
        </>
      ),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Giá sách", dataIndex: "price", key: "price" },
    { title: "Đường dẫn file", dataIndex: "fileUrl", key: "fileUrl" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Nhà xuất bản", dataIndex: "publisherId", key: "publisherId" },
    { title: "Ngày xuất bản", dataIndex: "publishDate", key: "publishDate" },
    { title: "Đề xuất", dataIndex: "isRecommend", key: "isRecommend" },
  ];
  const tableDatas: TableProps<Book>["dataSource"] = [];
  useEffect(() => {}, []);

  const onAddButtonClick = () => {
    navigate("add-book");
  };

  return (
    <>
      <Card
        title={"Sách"}
        extra={
          <Button onClick={onAddButtonClick} type="primary">
            Thêm
          </Button>
        }
      >
        <Table bordered columns={tableColums} dataSource={tableDatas} />
      </Card>
    </>
  );
};

export default BookPage;
