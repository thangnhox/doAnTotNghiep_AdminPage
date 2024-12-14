import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { AppConstants, countriesArray } from "../../../constants";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "../../../firebase/firebaseConfig";
import { AxiosResponse } from "axios";
import Author from "../../../models/Author";
import { handleAPI } from "../../../remotes/apiHandle";

interface ModalProps {
  isOpen: boolean;
  form: FormInstance;
  onCancel: () => void;
}

const AddAuthorModal = (props: ModalProps) => {
  const { isOpen, form, onCancel } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  const onCompleteAdd = async () => {
    try {
      setLoading(true);
      const name: String = form.getFieldValue("name");
      const birthDate: dayjs.Dayjs = form.getFieldValue("birthDate");
      const nationality = form.getFieldValue("nationality");
      const description: String = form.getFieldValue("description");

      const authorBirthday = birthDate.format(AppConstants.dateFormat);

      if (!selectedImage) {
        message.error("Chưa chọn hình");
        return;
      }

      const imageRef = ref(fireStorage, `images/${selectedImage.name}`);

      const uploadImageResponse = await uploadBytes(imageRef, selectedImage);
      const urlImageLink: string = await getDownloadURL(
        uploadImageResponse.ref
      );
      const newAuthor = {
        name,
        birthDate: authorBirthday,
        nationality,
        description,
        avatar: urlImageLink,
      };

      console.log(newAuthor);

      const res: AxiosResponse<Author> = await handleAPI(
        `authors/add`,
        newAuthor,
        "post"
      );

      if (res.status === 201) {
        onCancel();
      }
    } catch (error: any) {
      console.log(`Add Author error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (date: dayjs.Dayjs, dateString: string | string[]) => {
    form.setFieldValue("birthDate", dayjs(date, AppConstants.dateFormat));
  };

  return (
    <Modal
      title={"Thêm thông tin tác giả"}
      closable={false}
      open={isOpen}
      centered
      footer={
        <div className="d-flex flex-row justify-content-end gap-3">
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Ok
          </Button>
          <Button type="primary" danger onClick={onCancel} loading={isLoading}>
            Huỷ
          </Button>
        </div>
      }
    >
      <Form form={form} onFinish={onCompleteAdd}>
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
        <Form.Item label="Quốc gia" name={"nationality"} required>
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
        <Form.Item initialValue={null} label="Hình ảnh" name={"avatar"}>
          <input
            style={{
              width: "100%",
            }}
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                setSelectedImage(e.target.files[0]);
              }
            }}
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
