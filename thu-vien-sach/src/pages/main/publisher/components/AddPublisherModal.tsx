import { Button, Form, FormInstance, Input, Modal } from "antd";

interface AddPublisherModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  form: FormInstance;
}

const AddPublisherModal = (props: AddPublisherModalProps) => {
  const { isOpen, onCancel, onConfirm, form } = props;
  return (
    <Modal
      centered
      title={"Thêm mới nhà xuất bản"}
      open={isOpen}
      closable={false}
      footer={
        <div className="d-flex flex-row gap-3 justify-content-end ">
          <Button onClick={onConfirm} type="primary">
            Ok
          </Button>
          <Button onClick={onCancel} type="primary" danger>
            Hủy
          </Button>
        </div>
      }
    >
      <Form form={form}>
        <Form.Item
          required
          name={"publisherName"}
          label="Tên nhà xuất bản"
          rules={[
            {
              message: "Tên không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Nhà xuất bản A" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPublisherModal;
