import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Card, message, Table, TableProps, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponseListDTO from "../../../dtos/Response/ResponseListDTO";
import Publisher from "../../../models/Publisher";
import { handleAPI } from "../../../remotes/apiHandle";
import AddPublisherModal from "./components/AddPublisherModal";

type PageState = {
  data: Publisher[];
  page: number;
  pageSize: number;
  total: number;
};

const PublisherPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpenAddForm, setOpenAddForm] = useState<boolean>(false);
  const [addPublisherForm] = useForm();
  const [pageState, setPageState] = useState<PageState>({
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();
  const tableColumns: TableProps<Publisher>["columns"] = [
    {
      key: "id",
      title: "Mã NXB",
      dataIndex: "id",
    },
    {
      key: "name",
      title: "Tên NXB",
      dataIndex: "name",
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, publisher, __) => (
        <div className="d-flex flex-row justify-content-end">
          <Tooltip title={"Chi tiết"} placement="top">
            <Button
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`${publisher.id}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData(pageState.page);
  }, [pageState.page]);

  const getData = async (page: number) => {
    try {
      setLoading(true);
      const res: AxiosResponse<PageState> = await handleAPI(
        `publisher?page=${page}&pageSize=${pageState.pageSize}`
      );
      setPageState((prev) => ({
        ...prev,
        data: res.data.data,
        page: res.data.page,
        total: res.data.total,
      }));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setOpenAddForm(true);
  };

  const onCancelAddPublisher = () => {
    addPublisherForm.resetFields();
    setOpenAddForm(false);
  };

  const onConfirmAddPublisher = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseListDTO<Publisher>> = await handleAPI(
        `publisher/add`,
        { publisherName: addPublisherForm.getFieldValue("publisherName") },
        "post"
      );
      if (res.status === 201) {
        message.success(res.data.message);
        onCancelAddPublisher();
      }
    } catch (error: any) {
      message.error(error.message);
      onCancelAddPublisher();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        loading={isLoading}
        title={"Nhà xuất bản"}
        extra={
          <Button type="primary" onClick={openAddForm}>
            Thêm
          </Button>
        }
      >
        <Table
          bordered
          columns={tableColumns}
          dataSource={pageState.data}
          rowKey={(row) => row.id}
          pagination={{
            total: pageState.total,
            pageSize: pageState.pageSize,
            current: pageState.page,
            onChange: (page, _) => {
              setPageState((prev) => ({
                ...prev,
                page,
              }));
            },
          }}
        />
      </Card>
      <AddPublisherModal
        form={addPublisherForm}
        isOpen={isOpenAddForm}
        onCancel={onCancelAddPublisher}
        onConfirm={onConfirmAddPublisher}
      />
    </>
  );
};

export default PublisherPage;
