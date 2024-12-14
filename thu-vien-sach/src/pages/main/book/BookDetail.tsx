import {
  BookOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  LikeOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Image,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";
import Book from "../../../models/book/Book";
import { handleAPI } from "../../../remotes/apiHandle";
import { reFormatToDDMMYY } from "../../../utils/datetimeUtil";
import DescriptionTextIconComponent from "../../components/DescriptionTextIconComponent";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { Text, Paragraph, Title, Link } = Typography;

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book>> = await handleAPI(
        `books/fetch/${id}`
      );
      setBook(res.data.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-10">
          <Card className="p-4 shadow-lg">
            <div className="row">
              <div className="col-lg-8">
                <Space
                  direction="vertical"
                  size="small"
                  className="d-flex flex-column w-100 align-items-start"
                >
                  <Title level={2}>{book?.Title}</Title>
                  <Title level={5}>
                    Ngày phát hành:
                    <Text type="secondary" className="ms-3">
                      {reFormatToDDMMYY(book?.PublishDate!)}
                    </Text>
                  </Title>
                  <Title level={5}>
                    Nhà xuất bản:
                    <Text type="secondary" className="ms-3">
                      {book?.PublisherName}
                    </Text>
                  </Title>
                  <Title level={5}>
                    Tác giả:
                    <Link className="ms-3">{book?.AuthorName}</Link>
                  </Title>
                  <Title level={5}>
                    Giá:
                    <Text type="secondary" className="ms-3">
                      {book?.Price} VND
                    </Text>
                  </Title>
                  <Title level={5}>
                    Hình thức:
                    <Text type="secondary" className="ms-3">
                      {book?.status === 1
                        ? "Chỉ bán"
                        : book?.status === 3
                        ? "Gói thành viên và bán"
                        : "Chỉ gói thành viên"}
                    </Text>
                  </Title>
                  <Space size="middle">
                    <DescriptionTextIconComponent
                      title="Ebook"
                      icon={<BookOutlined />}
                    />
                    <DescriptionTextIconComponent
                      title="Pages"
                      content={`${book?.PageCount}`}
                    />
                    <DescriptionTextIconComponent
                      title="Likes"
                      content={`${book?.LikesCount}`}
                    />
                    {book?.IsRecommended === 1 ? (
                      <DescriptionTextIconComponent
                        title="Recommend"
                        icon={<LikeOutlined />}
                      />
                    ) : null}
                  </Space>
                </Space>
              </div>
              <div className="col-lg-4 d-flex flex-column justify-content-center">
                <Image
                  src={book?.cover_url}
                  width={300}
                  alt="Cover Book Image"
                  className="rounded shadow-sm"
                />

                <div className="d-flex flex-row gap-3 mt-4  justify-content-center">
                  <Tooltip title="Đọc">
                    <Button
                      shape="circle"
                      icon={<ReadOutlined />}
                      size="large"
                      onClick={() => navigate("read")}
                    />
                  </Tooltip>

                  <Tooltip title="Chỉnh sửa thông tin">
                    <Button
                      shape="circle"
                      icon={<EditOutlined />}
                      size="large"
                    />
                  </Tooltip>

                  <Tooltip title="Ẩn sách">
                    <Button
                      shape="circle"
                      icon={<EyeInvisibleOutlined />}
                      size="large"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <Divider className="mt-4" />
            <div className="d-flex flex-column mt-3 align-items-start ">
              <Title level={3}>Về sách này</Title>
              <Paragraph>{book?.Description}</Paragraph>
            </div>
            <Divider className="mt-4" />
            <div className="d-flex flex-column align-items-start">
              <Title level={3}>Thể loại</Title>
              <div className="d-flex flex-row mt-2 gap-3">
                {book?.Categories.split(",").map((val) => (
                  <DescriptionTextIconComponent title={val} />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
