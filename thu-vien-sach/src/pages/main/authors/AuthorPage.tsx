import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
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

  const onCompleteAdd = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      addAuthorForm.submit();
      const name: String = addAuthorForm.getFieldValue("name");
      const birthDate: dayjs.Dayjs = addAuthorForm.getFieldValue("birthDate");
      const nationality = addAuthorForm.getFieldValue("nationality");
      const description: String = addAuthorForm.getFieldValue("description");

      const authorBirthday = birthDate.format(AppConstants.dateFormat);

      const newAuthor = {
        name,
        birthDate: authorBirthday,
        nationality,
        description,
      };

      console.log(newAuthor);

      const res: AxiosResponse<Author> = await handleAPI(
        `authors/add`,
        newAuthor,
        "post"
      );

      if (res.status === 201) {
        onCancelAdd();
        getAuthors();
      }
    } catch (error: any) {
      message.error(error.message);
      console.log(`Add Author error: ${error}`);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const onChageDate = (date: dayjs.Dayjs, dateString: string | string[]) => {
    addAuthorForm.setFieldValue(
      "birthDate",
      dayjs(date, AppConstants.dateFormat)
    );
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
        onComplete={onCompleteAdd}
        onChangeDate={onChageDate}
      />
    </Card>
  );
};

export default AuthorPage;
