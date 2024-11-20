import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { AppConstants } from "../../../constants";
import { ResponseDTO } from "../../../dtos/Response/ResponseListDTO";
import { fireStorage } from "../../../firebase/firebaseConfig";
import Author from "../../../models/Author";
import { BookStatus } from "../../../models/book/BookEnum";
import Category from "../../../models/Category";
import Publisher from "../../../models/Publisher";
import { handleAPI } from "../../../remotes/apiHandle";

interface PageState {
  isLoading: boolean;
  authors: Author[];
  categories: Category[];
  publishers: Publisher[];
}

const AddBookPage = () => {
  const [state, setState] = useState<PageState>({
    authors: [],
    categories: [],
    isLoading: false,
    publishers: [],
  });
  const [fileUpload, setFileUpload] = useState<File | undefined>(undefined);
  const [imageUpload, setImageUpload] = useState<File | undefined>(undefined);
  const [isRecommended, setRecommend] = useState<boolean>(true);
  const [bookStatus, setBookStatus] = useState<number>();
  const [selectedAuthorId, setSelectedAuthorId] = useState<number>();
  const [selectedPublisherId, setSelectedPublisherId] = useState<number>();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>();
  const [addBookForm] = useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const handleAddBook = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      if (!fileUpload) {
        message.error("Chưa có file");
        return;
      }
      if (!imageUpload) {
        message.error("Chưa có hình ảnh");
        return;
      }
      const pdfRef = ref(fireStorage, `pdfs/${fileUpload.name}`);
      const imageRef = ref(fireStorage, `images/${imageUpload.name}`);

      const uploadFileReponse = await uploadBytes(pdfRef, fileUpload);
      const urlPDFLink: string = await getDownloadURL(uploadFileReponse.ref);

      const uploadImageResponse = await uploadBytes(imageRef, imageUpload);
      const urlImageLink: string = await getDownloadURL(
        uploadImageResponse.ref
      );
      const title: string = addBookForm.getFieldValue("title");
      const description: string = addBookForm.getFieldValue("description");
      const publishDateObj: string = addBookForm.getFieldValue("publishDate");
      const pageCount: string = addBookForm.getFieldValue("pageCount");
      const price: string = addBookForm.getFieldValue("price");

      const publishDate: string = dayjs(publishDateObj).format(
        AppConstants.dateFormat
      );

      if (!selectedCategoryIds || selectedCategoryIds.length < 0) {
        message.error("Chưa chọn thể loại");
        return;
      }

      if (!selectedAuthorId) {
        message.error("Chưa chọn tác giả");
        return;
      }

      if (!selectedPublisherId) {
        message.error("Chưa chọn nhà xuất bản");
        return;
      }

      const newBook = {
        title,
        description,
        pageCount,
        price,
        fileUrl: urlPDFLink,
        coverUrl: urlImageLink,
        status: bookStatus,
        authorsId: selectedAuthorId,
        publisherId: selectedPublisherId,
        publishDate,
        categoryIds: selectedCategoryIds,
        isRecommended: isRecommended ? 1 : 0,
      };

      await handleAPI(`books/add`, newBook, "post");
      message.success("Tải lên file thành công");
      window.history.back();
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleSearchAuthor = async (authorName: string) => {
    if (!authorName.trim()) {
      return;
    }
    try {
      const res: AxiosResponse<ResponseDTO<Author[]>> = await handleAPI(
        `authors/find?name=${authorName}`
      );
      setState((prev) => ({
        ...prev,
        authors: res.data.data,
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchPublisher = async (publisherName: string) => {
    if (!publisherName.trim()) {
      return;
    }
    try {
      const res: AxiosResponse<ResponseDTO<Author[]>> = await handleAPI(
        `publisher/find/${publisherName}`
      );
      setState((prev) => ({
        ...prev,
        publishers: res.data.data,
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchCategory = async (categoryName: string) => {
    if (!categoryName.trim()) {
      return;
    }
    try {
      const res: AxiosResponse<ResponseDTO<Category[]>> = await handleAPI(
        `categories/find/${categoryName}`
      );
      setState((prev) => ({
        ...prev,
        categories: res.data.data,
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const onChageDate = (date: dayjs.Dayjs, dateString: string | string[]) => {
    addBookForm.setFieldValue(
      "publishDate",
      dayjs(date, AppConstants.dateFormat)
    );
  };

  return (
    <div className="container-fluid row ">
      <div className="col">
        <Card title={"Thêm sách"}>
          <Form {...formItemLayout} form={addBookForm} onFinish={handleAddBook}>
            <Form.Item
              name={"title"}
              label={"Tên sách"}
              rules={[
                {
                  required: true,
                  message: "Tên sách không được trống ",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name={"price"}
              label={"Giá sách"}
              rules={[
                {
                  type: "number",
                  message: "Giá sách phải là một số",
                },
                {
                  required: true,
                  message: "Giá sách không được để trống",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                suffix="VND"
                inputMode="decimal"
                alt="Book Price Input"
              />
            </Form.Item>
            <Form.Item
              name={"pageCount"}
              label={"Số trang"}
              rules={[
                {
                  type: "number",
                  message: "Số trang sách phải là một số",
                },
                {
                  required: true,
                  message: "Số trang không được để trống",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                suffix="Trang"
                inputMode="decimal"
                alt="Book Total Page Input"
              />
            </Form.Item>
            <Form.Item
              label="Ngày phát hành"
              name={"publishDate"}
              initialValue={dayjs(dayjs(), AppConstants.dateFormat)}
              rules={[
                {
                  required: true,
                  message: "Ngày phát hành không được để trống",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                allowClear={false}
                defaultValue={dayjs(dayjs(), AppConstants.dateFormat)}
                format={AppConstants.dateFormat}
                onChange={onChageDate}
              />
            </Form.Item>
            <Form.Item label="Thể loại">
              <Select
                showSearch
                placeholder={"Khoa học"}
                mode="multiple"
                defaultActiveFirstOption={false}
                notFoundContent={"Không tìm thấy"}
                optionFilterProp="label"
                onSearch={handleSearchCategory}
                onChange={setSelectedCategoryIds}
                options={(state.categories || []).map((categories) => ({
                  value: categories.id,
                  label: categories.name,
                }))}
                optionRender={(category) => (
                  <Typography.Text>{category.label}</Typography.Text>
                )}
              />
            </Form.Item>
            <Form.Item label={"Nhà xuất bản"}>
              <Select
                showSearch
                placeholder={"Kim Đồng"}
                defaultActiveFirstOption={false}
                notFoundContent={"Không tìm thấy"}
                optionFilterProp="label"
                onSearch={handleSearchPublisher}
                onChange={setSelectedPublisherId}
                options={(state.publishers || []).map((publisher) => ({
                  value: publisher.id,
                  label: publisher.name,
                }))}
              />
            </Form.Item>
            <Form.Item label="Tác giả">
              <Select
                showSearch
                placeholder={"Nguyễn Văn A"}
                defaultActiveFirstOption={false}
                notFoundContent={"Không tìm thấy"}
                optionFilterProp="label"
                onSearch={handleSearchAuthor}
                onChange={setSelectedAuthorId}
                options={(state.authors || []).map((author) => ({
                  value: author.id,
                  label: author.name,
                }))}
              />
            </Form.Item>
            <Form.Item label="Cho phép">
              <Select
                onChange={(val, _) => setBookStatus(val)}
                options={[
                  {
                    label: BookStatus.ALL.lable,
                    value: BookStatus.ALL.value,
                  },
                  {
                    label: BookStatus.BUY_ONLY.lable,
                    value: BookStatus.BUY_ONLY.value,
                  },
                  {
                    label: BookStatus.MEMBERSHIP_ONLY.lable,
                    value: BookStatus.MEMBERSHIP_ONLY.value,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"description"}
              label={"Mô tả"}
              rules={[
                {
                  min: 20,
                  message: "Mô tả ít nhất 20 ký tự",
                },
                {
                  required: true,
                  message: "Mô tả không được để trống",
                },
              ]}
            >
              <Input.TextArea allowClear />
            </Form.Item>
            <Form.Item valuePropName="checked">
              <Checkbox
                checked={isRecommended}
                onChange={(val) => setRecommend(val.target.checked)}
              >
                Đề cử
              </Checkbox>
            </Form.Item>

            <Form.Item label="File" name="file">
              <input
                style={{
                  width: "100%",
                }}
                id="file-upload"
                name="file"
                type="file"
                accept=".pdf"
                aria-label="Upload a PDF file"
                onChange={(event) => {
                  if (event.target.files) {
                    setFileUpload(event.target.files[0]);
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="Ảnh bìa" name="image">
              <input
                style={{
                  width: "100%",
                }}
                id="file-upload"
                name="image"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                aria-label="Upload a Image for cover book"
                onChange={(event) => {
                  if (event.target.files) {
                    setImageUpload(event.target.files[0]);
                  }
                }}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleAddBook}
              disabled={fileUpload === undefined && imageUpload === undefined}
              loading={state.isLoading}
              style={{ marginTop: 16 }}
            >
              {state.isLoading ? "Uploading" : "Start Upload"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddBookPage;
