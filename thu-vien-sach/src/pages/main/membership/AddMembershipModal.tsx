import { Card, Form, FormInstance, Input, InputNumber, Modal } from 'antd';
import React from 'react'

interface Props {
    isOpen: boolean,
    form: FormInstance
    onFinish: () => void,
    onCancel: () => void
}

const AddMembershipModal = (props: Props) => {
    const { isOpen, form, onFinish, onCancel } = props;


    return <Modal
        title="Thêm gói thành viên"
        open={isOpen}
        centered
        onCancel={onCancel}
        onOk={() => form.submit()}
        closable={false} >
        <Form
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                label="Tên"
                name={"name"}
                rules={[
                    {
                        required: true,
                        min: 3,
                        message: "Tên không được để trống"
                    },

                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
              name={"price"}
              label={"Giá"}
              rules={[
                {
                  type: "number",
                  message: "Giá phải là một số",
                },
                {
                  required: true,
                  message: "Giá không được để trống",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                suffix="VND"
                inputMode="decimal"
                alt="Membership Price Input"
              />
            </Form.Item>
        </Form>
    </Modal>
}

export default AddMembershipModal