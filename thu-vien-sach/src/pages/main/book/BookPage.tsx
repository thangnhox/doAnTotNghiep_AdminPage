import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  message,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";
import Book from "../../../models/book/Book";
import { handleAPI } from "../../../remotes/apiHandle";
import { reFormatToDDMMYY } from "../../../utils/datetimeUtil";

interface PageState {
  data: Book[];
  isLoading: boolean;
  pageNum: number;
  total: number;
  pageSize: number;
}

const BookPage = () => {
  const [state, setState] = useState<PageState>({
    data: [],
    isLoading: false,
    pageNum: 1,
    total: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();
  const tableColums: TableProps<Book>["columns"] = [
    {
      title: "Mã sách",
      dataIndex: "BookID",
      key: "id",
    },
    {
      title: "Hình ảnh",
      dataIndex: "cover_url",
      key: "coverUrl",
      render: (_, { cover_url }) => (
        <>
          <Image src={cover_url} alt="Book Cover Image" width={200} />
        </>
      ),
    },
    { title: "Tiêu đề", dataIndex: "Title", key: "title" },
    { title: "Giá sách", dataIndex: "Price", key: "price" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Nhà xuất bản", dataIndex: "PublisherName", key: "publisherId" },
    {
      title: "Ngày xuất bản",
      dataIndex: "PublishDate",
      key: "publishDate",
      render: (_, book, __) => (
        <Typography.Text>{reFormatToDDMMYY(book.PublishDate)}</Typography.Text>
      ),
    },

    {
      title: "Đề xuất",
      dataIndex: "IsRecommended",
      key: "isRecommend",
      render: (_, book, __) => (
        <Typography.Text>
          {book.isRecommend === 1 ? "Đang đề xuất" : "Không đề xuất"}
        </Typography.Text>
      ),
    },
    {
      key: "categories",
      title: "Danh mục",
      dataIndex: "Categories",
      // render: (_, book) => (
      //   <Space>
      //     {book.Categories && book.Categories.length > 0 ? (
      //       book.Categories.map((val, index) => <Tag key={index}>{val}</Tag>)
      //     ) : (
      //       <Tag color="default">Không có danh mục</Tag>
      //     )}
      //   </Space>

      // ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, book, __) => (
        <div className="d-flex flex-row justify-content-center">
          <Tooltip title="Chi tiết">
            <Button
              shape="circle"
              type="default"
              onClick={() => {
                navigate(`detail/${book.BookID}`);
              }}
              icon={<InfoCircleOutlined />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      const res: AxiosResponse<ResponseDTO<any>> = await handleAPI(
        `books?field=Title&page=${state.pageNum}&pageSize=${state.pageSize}`
      );
      setState((prev) => ({
        ...prev,
        data: res.data.data.map((data: any) => ({
          ...data,
          status: data.status.data,
        })),
      }));
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const onAddButtonClick = () => {
    navigate("add-book");
  };

  return (
    <>
      <Card
        loading={state.isLoading}
        title={"Sách"}
        extra={
          <Button onClick={onAddButtonClick} type="primary">
            Thêm
          </Button>
        }
      >
        <Table
          bordered
          columns={tableColums}
          dataSource={state.data}
          rowKey={(row) => row.BookID}
        />
      </Card>
    </>
  );
};

export default BookPage;
