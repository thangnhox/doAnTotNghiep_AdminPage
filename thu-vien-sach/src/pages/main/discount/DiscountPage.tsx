import { useEffect, useState } from "react";
import { Discount } from "../../../models/Discount";
import { Button, Card, DatePickerProps, message, Table, TableProps } from "antd";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";
import { handleAPI } from "../../../remotes/apiHandle";
import { reFormatToDDMMYY } from "../../../utils/datetimeUtil";
import { formatStringRatio } from "../../../utils/numbericUtil";
import { useForm } from "antd/es/form/Form";
import DiscountAddModal from "./DiscountAddModal";
import dayjs, { Dayjs } from "dayjs";
import { AppConstants } from "../../../constants";

interface PageState {
  isLoading: boolean,
  discounts: Discount[],
  pageNum: number;
  total: number
}


const DiscountPage = () => {
  const [pageState, setPageState] = useState<PageState>({
    isLoading: false,
    discounts: [],
    pageNum: 0,
    total: 0
  })
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false)
  const [addForm] = useForm();
  const columns: TableProps<Discount>['columns'] = [
    {
      key: 'id',
      title: 'Id',
      dataIndex: 'id'
    }, {
      key: 'name',
      title: 'Tên mã',
      dataIndex: 'name'
    }, {
      key: 'ratio',
      title: 'Tỉ lệ giảm',
      dataIndex: 'ratio',
      render: (_,discount, __) => <div className="text-center">{formatStringRatio(discount.ratio)}</div>
    }, {
      key: 'expireDate',
      title: 'Ngày hết hạn',
      dataIndex: 'expireDate',
      render: (_,discount,__) => <div className="text-center">{reFormatToDDMMYY(discount.expireDate)}</div>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, discount, __) => discount.status === 0 ? 'Hết hạn' : 'Còn hạn'
    },
  ]

  useEffect(() => {
    getDiscount(pageState.pageNum);
  }, [pageState.pageNum])

  const getDiscount = async ( page: number ) => {
    try {
      setPageState(prev => ({ ...prev, isLoading: true }))
      const res: AxiosResponse<ResponseDTO<Discount[]>> = await handleAPI(`discount?page=${page}`);
      setPageState(prev => (
        {
          ...prev,
          discounts: res.data.data,
          total: res.data.total!
        }
      ))
    } catch (error: any) {
      console.log(error)
    } finally {
      setPageState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const onCancelAddModal = () => {
    addForm.resetFields();
    setAddModalOpen(false)
  }

  const onPerformAdd = async () => {
    const name: string = addForm.getFieldValue('name')
    const ratio: number = addForm.getFieldValue('ratio')
    const dateExpired: string = dayjs(addForm.getFieldValue('expireDate')).format(AppConstants.dateFormat)
    const newDiscount = {
      name,
      ratio: ratio/100 ,
      expireDate:dateExpired,
      status: 1
    }
    try {
      setPageState(prev => ({
        ...prev,
        isLoading: true
      }))
      const res: AxiosResponse<ResponseDTO<Discount>> = await handleAPI(`discount/add`,newDiscount,'post');
      if(res.status === 201) {
        onCancelAddModal()
        message.success(res.data.message)
        getDiscount(pageState.pageNum);
      }
    } catch (error: any) {
      console.log(error)
    }finally{
      setPageState(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }

  return <>
  <Card  loading={pageState.isLoading} title="Mã giảm giá" extra={<Button type="primary" onClick={()=> setAddModalOpen(true)} >Thêm</Button>} >
    <Table 
    columns={columns} 
    dataSource={pageState.discounts}
    rowKey={(row) => row.id} 
    pagination={{
      total: pageState.total,
      pageSize: 10,
      onChange: (page, _) => setPageState(prev => ({ ...prev, pageNum: page }))
    }} />
  </Card>
  <DiscountAddModal form={addForm} isOpen={isAddModalOpen} onCancel={onCancelAddModal} onFinish={ onPerformAdd } />
  </>
};

export default DiscountPage;
