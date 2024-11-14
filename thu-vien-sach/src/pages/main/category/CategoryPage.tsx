import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Card, message, Table, TableProps, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../../../models/Category";
import { handleAPI } from "../../../remotes/apiHandle";
import AddCategoryModal from "./AddCategoryModal";

type PageState = {
  data: Category[];
  pageSize: number;
  page: number;
  total: number;
  isLoading: boolean;
  isAddCategoryModalOpen: boolean;
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const [addCategoryForm] = useForm();
  const [pageState, setPageState] = useState<PageState>({
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    isAddCategoryModalOpen: false,
    isLoading: false,
  });

  const tableColums: TableProps<Category>["columns"] = [
    {
      key: "id",
      dataIndex: "id",
      title: "Mã thể loại",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên",
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, cat, __) => (
        <div className="d-flex flex-row justify-content-end">
          <Tooltip title={"Chi tiết"} placement="top">
            <Button
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`${cat.id}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getCategory(pageState.page);
  }, [pageState.page]);

  const getCategory = async (page: number) => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const res: AxiosResponse<PageState> = await handleAPI(
        `categories?page=${page}&pageSize=${pageState.pageSize}`
      );
      setPageState((prev) => ({
        ...prev,
        data: res.data.data,
        page: res.data.page,
        pageSize: res.data.pageSize,
        total: res.data.total,
      }));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setPageState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const openAddCategoryModal = () => {
    setPageState((prev) => ({
      ...prev,
      isAddCategoryModalOpen: true,
    }));
  };

  const onCancelAddCategoryModal = () => {
    addCategoryForm.resetFields();
    setPageState((prev) => ({
      ...prev,
      isAddCategoryModalOpen: false,
    }));
  };

  const performAddCategory = async () => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      addCategoryForm.submit();
      const categoryName: string =
        addCategoryForm.getFieldValue("categoryName");
      const newCategory = {
        categoryName,
      };
      const res: AxiosResponse<Category> = await handleAPI(
        `categories/add`,
        newCategory,
        "post"
      );
      if (res.status === 201) {
        onCancelAddCategoryModal();
        message.success("Thêm thành công");
      }
    } catch (error: any) {
      message.error(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      setPageState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <>
      <div className="container-fulid">
        <div className="m-3">
          <Card
            loading={pageState.isLoading}
            title="Danh mục sách"
            extra={
              <Button onClick={openAddCategoryModal} type="primary">
                Thêm
              </Button>
            }
          >
            <Table
              bordered
              columns={tableColums}
              dataSource={pageState.data}
              rowKey={(row) => row.id}
              pagination={{
                pageSize: pageState.pageSize,
                current: pageState.page,
                total: pageState.total,
                onChange(page, _) {
                  setPageState((prev) => ({
                    ...prev,
                    page,
                  }));
                },
              }}
            />
            <AddCategoryModal
              form={addCategoryForm}
              isOpen={pageState.isAddCategoryModalOpen}
              onCancel={onCancelAddCategoryModal}
              onComplete={performAddCategory}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
