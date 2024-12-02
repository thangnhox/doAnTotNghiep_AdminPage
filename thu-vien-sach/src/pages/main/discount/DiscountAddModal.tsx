import { DatePicker, DatePickerProps, Form, FormInstance, Input, InputNumber, Modal } from 'antd'
import React from 'react'

interface Props {
    isOpen: boolean,
    onFinish: () => void,
    onCancel: () => void,
    form: FormInstance
}

const DiscountAddModal = (props: Props) => {

    const { isOpen, onFinish, onCancel, form } = props

    return <Modal title="Thêm mã giảm giá" open={isOpen} onCancel={onCancel} onOk={() => form.submit()} closable={false}  >
        <Form
            onFinish={onFinish}
            form={form} >
            <Form.Item
                label="Tên mã"
                rules={[
                    {
                        required: true,
                        min: 3,
                        message: 'Tên mã không để được trống'
                    },
                ]}
                name={"name"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Tỉ lệ giảm"
                rules={[
                    {
                        required: true,
                        message: 'Tỉ lệ giảm không để được trống'
                    }
                ]}
                name={"ratio"}
            >
                <InputNumber suffix={'%'} />
            </Form.Item>
            <Form.Item
                label="Ngày hết hạn"
                name={"expireDate"}
            >
                <DatePicker />
            </Form.Item>
        </Form>
    </Modal>
}

export default DiscountAddModal