import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  message,
  Spin,
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
          <Image
            src={cover_url}
            alt="Book Cover Image"
            width={200}
            style={{ borderRadius: "8px" }}
          />
        </>
      ),
    },
    { title: "Tiêu đề", dataIndex: "Title", key: "title" },
    { title: "Giá sách", dataIndex: "Price", key: "price" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, book, __) => renderStatus(book),
    },
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
          {book.IsRecommended === 1 ? "Đang đề xuất" : "Không đề xuất"}
        </Typography.Text>
      ),
    },
    {
      key: "categories",
      title: "Danh mục",
      dataIndex: "Categories",
    },
    {
      key: "rank",
      title: "Độ tuổi",
      render: (_, book, __) => renderRank(book),
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
        isLoading: true,
      }));

      const res: AxiosResponse<ResponseDTO<any>> = await handleAPI(
        `books?field=Title&page=${state.pageNum}&pageSize=${state.pageSize}`
      );
      setState((prev) => ({
        ...prev,
        data: res.data.data,
        pageNum: res.data.page!,
        pageSize: res.data.pageSize!,
        total: res.data.total!,
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

  const renderStatus = (book: Book) => {
    switch (book.status) {
      case 1:
        return <Typography.Text>Tất cả</Typography.Text>;
      case 2:
        return <Typography.Text>Chỉ mua</Typography.Text>;
      case 3:
        return <Typography.Text>Chỉ thành viên</Typography.Text>;
      default:
        return <Typography.Text>Tất cả</Typography.Text>;
    }
  };

  const renderRank = (book: Book) => {
    switch (book.rank) {
      case 1:
        return <Typography.Text>Tất cả</Typography.Text>;
      case 2:
        return <Typography.Text>Trên 6 tuổi</Typography.Text>;
      case 3:
        return <Typography.Text>Trên 11 tuổi</Typography.Text>;
      case 4:
        return <Typography.Text>Trên 18 tuổi</Typography.Text>;
      default:
        return <Typography.Text>Tất cả</Typography.Text>;
    }
  };

  return state.isLoading ? (
    <Spin />
  ) : (
    <Card
      title={"Sách"}
      extra={
        <Button onClick={() => navigate("add-book")} type="primary">
          Thêm
        </Button>
      }
    >
      <Table
        bordered
        scroll={{
          x: true,
        }}
        columns={tableColums}
        dataSource={state.data}
        rowKey={(row) => row.BookID}
        pagination={{
          total: state.total,
          pageSize: state.pageSize,
          current: state.pageNum,
        }}
      />
    </Card>
  );
};

export default BookPage;
