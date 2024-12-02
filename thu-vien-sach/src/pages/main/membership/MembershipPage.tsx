import { useEffect, useState } from "react";
import Membership from "../../../models/Membership";
import { Button, Card, message, Table, TableProps, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";
import { handleAPI } from "../../../remotes/apiHandle";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import AddMembershipModal from "./AddMembershipModal";
import { useForm } from "antd/es/form/Form";

interface PageState {
  isLoading: boolean,
  memberships: Membership[],
  pageNum: number,
  total: number
}

const MembershipPage = () => {
  const [pageState, setPageState] = useState<PageState>({
    isLoading: false,
    memberships: [],
    pageNum: 1,
    total: 0
  });
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [addForm] = useForm()
  const navigate = useNavigate();
  const tableColums: TableProps<Membership>['columns'] = [
    {
      key: 'id',
      title: 'Id',
      dataIndex: 'id'
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name'
    },
    {
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, membership, __) => (
        <Tooltip title="Chi tiết">
          <Button
            shape="circle"
            type="default"
            onClick={() => {
              navigate(`detail/${membership.id}`);
            }}
            icon={<InfoCircleOutlined />}
          />
        </Tooltip>
      )
    }
  ]

  useEffect(() => {
    getMemberships(pageState.pageNum)
  }, [pageState.pageNum])

  const getMemberships = async (pageNum: number) => {
    setPageState((prev) => ({
      ...prev,
      isLoading: true
    }))
    try {
      const res: AxiosResponse<ResponseDTO<Membership[]>> = await handleAPI(`membership?page=${pageNum}`);
      setPageState((prev) => ({
        ...prev,
        memberships: res.data.data,
        total: res.data.total ?? 0,
      }))
    } catch (error: any) {
      console.log(error);
      message.error(error)
    } finally {
      setPageState((prev) => ({
        ...prev,
        isLoading: false
      }))
    }
  }

  const onCancelAdd = () => {
    setAddModalOpen(false)
    addForm.resetFields()
  }
  const onPerformAdd = async () => {
    const name: string = addForm.getFieldValue('name');
    const price: number = addForm.getFieldValue('price');

    const newMembership = {
      name,
      price,
      rank: 1,
      allowNew: 1
    }

    try {
      setPageState(prev => ({
        ...prev,
        isLoading: true
      }))
      const res: AxiosResponse<ResponseDTO<Membership>> = await handleAPI(`membership/add`, newMembership, 'post')
      if (res.status === 201) {
        onCancelAdd()
        message.success(res.data.message)
        getMemberships(pageState.pageNum)
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setPageState(prev => ({
        ...prev,
        isLoading: false
      }))
    }

  }

  return <>
    <Card
      title={'Gói thành viên'}
      loading={pageState.isLoading}
      extra={
        <Button
          type="primary"
          onClick={() => setAddModalOpen(true)} >Thêm</Button>
      } >
      <Table
        dataSource={pageState.memberships}
        columns={tableColums}
        rowKey={(row) => row.id}
        pagination={
          {
            total: pageState.total,
            pageSize: 10,
            onChange: (page, _) => setPageState((prev) => ({ ...prev, pageNum: page }))
          }
        } />
    </Card>;
    <AddMembershipModal
      form={addForm}
      isOpen={isAddModalOpen}
      onCancel={onCancelAdd}
      onFinish={onPerformAdd} />
  </>
};

export default MembershipPage;

