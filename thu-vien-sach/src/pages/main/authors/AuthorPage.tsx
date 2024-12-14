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
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppConstants } from "../../../constants";
import Author from "../../../models/Author";
import { handleAPI } from "../../../remotes/apiHandle";
import { reFormatToDDMMYY } from "../../../utils/datetimeUtil";
import AddAuthorModal from "./AddAuthorModal";

interface PageState {
  isLoading: boolean;
  data: Author[];
  page: number | 1;
  pageSize: number;
  total: number;
  isOpenAddModal: boolean;
}

const AuthorPage = () => {
  const { Text } = Typography;
  const [state, setState] = useState<PageState>({
    isLoading: false,
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    isOpenAddModal: false,
  });
  const navigate = useNavigate();
  const [addAuthorForm] = useForm();
  const tableColumns: TableProps<Author>["columns"] = [
    {
      key: "id",
      dataIndex: "id",
      title: "Mã tác giả",
    },
    {
      key: "avatar",
      dataIndex: "avatar",
      title: "Hình ảnh",
      render: (_, author, __) => (
        <Image
          src={author.avatar}
          width={200}
          style={{ borderRadius: "8px" }}
        />
      ),
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên",
    },
    {
      key: "birthDate",
      dataIndex: "birthDate",
      title: "Ngày sinh",
      render: (_, author, __) => (
        <Text>{reFormatToDDMMYY(author.birthDate)}</Text>
      ),
    },
    {
      key: "nationality",
      dataIndex: "nationality",
      title: "Quốc gia",
    },
    {
      key: "bookCount",
      dataIndex: "books",
      title: "Số lượng sách",
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, author, __) => (
        <div className="d-flex flex-row gap-3 justify-content-end ">
          <Tooltip>
            <Button
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`${author.id}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAuthors();
  }, [state.page]);

  const getAuthors = async () => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const res: AxiosResponse<PageState> = await handleAPI(
        `authors?page=${state.page}&pageSize=${state.pageSize}`
      );
      setState((prev) => ({
        ...prev,
        data: res.data.data,
        page: res.data.page,
        total: res.data.total,
        pageSize: res.data.pageSize,
      }));
    } catch (error: any) {
      message.error(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const openAddModal = () => {
    setState((prev) => ({
      ...prev,
      isOpenAddModal: true,
    }));
  };

  const onCancelAdd = () => {
    setState((prev) => ({
      ...prev,
      isOpenAddModal: false,
    }));
    addAuthorForm.resetFields();
  };

  return (
    <Card
      loading={state.isLoading}
      title={"Tác giả"}
      extra={
        <Button type="primary" onClick={openAddModal}>
          Thêm
        </Button>
      }
    >
      <Table
        columns={tableColumns}
        dataSource={state.data}
        rowKey={(author) => author.id}
        pagination={{
          pageSize: state.pageSize,
          current: state.page,
          total: state.total,
          onChange: (page, _) => {
            setState((prev) => ({
              ...prev,
              page,
            }));
          },
        }}
      />
      <AddAuthorModal
        isOpen={state.isOpenAddModal}
        form={addAuthorForm}
        onCancel={onCancelAdd}
      />
    </Card>
  );
};

export default AuthorPage;
