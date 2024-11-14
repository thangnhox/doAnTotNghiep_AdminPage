import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { AppConstants, countriesArray } from "../../../constants";

interface ModalProps {
  isOpen: boolean;
  form: FormInstance;
  onChangeDate: (date: dayjs.Dayjs, dateString: string | string[]) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const AddAuthorModal = (props: ModalProps) => {
  const { isOpen, form, onComplete, onCancel, onChangeDate } = props;

  return (
    <Modal
      title={"Thêm thông tin tác giả"}
      closable={false}
      open={isOpen}
      centered
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
      <Form form={form}>
        <Form.Item
          name={"name"}
          label="Tên tác giả"
          rules={[
            {
              message: "Tên tác giả không được trống",
              required: true,
            },
          ]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>
        <Form.Item
          label="Năm sinh"
          name={"birthDate"}
          required
          initialValue={dayjs(dayjs(), AppConstants.dateFormat)}
        >
          <DatePicker
            allowClear={false}
            defaultValue={dayjs(dayjs(), AppConstants.dateFormat)}
            format={AppConstants.dateFormat}
            onChange={onChangeDate}
          />
        </Form.Item>
        <Form.Item
          label="Quốc gia"
          name={"nationality"}
          initialValue={countriesArray[0]}
          required
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            allowClear
            onChange={(val) => {
              form.setFieldValue("nationality", val);
            }}
            options={countriesArray}
          />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name={"description"}
          rules={[
            {
              required: true,
              message: "Mô tả không được trống",
            },
            {
              min: 20,
              message: "Mô tả phải có ít nhất 20 ký tự",
            },
          ]}
        >
          <Input.TextArea placeholder="Đây là nội dung mô tả" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAuthorModal;
