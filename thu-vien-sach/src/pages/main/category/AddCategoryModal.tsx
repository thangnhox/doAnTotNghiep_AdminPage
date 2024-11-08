import { Button, Form, FormInstance, Input, Modal } from "antd";

interface Props {
  isOpen: boolean;
  form: FormInstance;
  onComplete: () => void;
  onCancel: () => void;
}

const AddCategoryModal = (props: Props) => {
  const { form, onCancel, onComplete, isOpen } = props;

  return (
    <Modal
      title="Thêm danh mục"
      centered
      open={isOpen}
      closable={false}
      footer={
        <div className="d-flex flex-row justify-content-end gap-3">
          <Button type="primary" onClick={onComplete}>
            Ok
          </Button>
          <Button type="primary" danger onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      }
    >
      <Form form={form} className="mt-3">
        <Form.Item
          name={"name"}
          rules={[
            {
              message: "Tên danh mục không được trống",
              whitespace: true,
              required: true,
            },
          ]}
        >
          <Input placeholder="Danh mục A" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
