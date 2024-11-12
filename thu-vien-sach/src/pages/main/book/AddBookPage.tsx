import { Button, Card, Form, Input, InputNumber, message, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import ResponseListDTO from "../../../dtos/Response/ResponseListDTO";
import { fireStorage } from "../../../firebase/firebaseConfig";
import Author from "../../../models/Author";
import Category from "../../../models/Category";
import Publisher from "../../../models/Publisher";
import { handleAPI } from "../../../remotes/apiHandle";

interface PageState {
  isLoading: boolean;
  authors: Author[];
  categories: Category[];
  publishers: Publisher[];
}

type SearchParams = {
  value: number;
  lable: string;
};

const AddBookPage = () => {
  const [state, setState] = useState<PageState>({
    authors: [],
    categories: [],
    isLoading: false,
    publishers: [],
  });
  const [fileUpload, setFileUpload] = useState<File | undefined>(undefined);

  const [publisherParams, setPublisherParams] = useState<string | undefined>();

  const [authorSelected, setAuthorSelected] = useState<
    SearchParams | undefined
  >(undefined);

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

  useEffect(() => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      getAuthors();
      getCategories();
      getPublisher(publisherParams);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [publisherParams]);

  const getAuthors = async () => {};

  const getCategories = async () => {};

  const getPublisher = async (publisherParams?: string) => {
    const res: AxiosResponse<ResponseListDTO<Publisher[]>> = await handleAPI(
      publisherParams ? `publisher/find/${publisherParams}` : `publisher`
    );
    if (res.status === 200) {
      setState((prev) => ({
        ...prev,
        publishers: res.data.data,
      }));
    }
  };

  const onChangePublisherSelect = (value: string) => {
    // console.log(value);
    // setAuthorSelected({
    //   lable: value.lable,
    //   value: value.value,
    // });
  };

  const onSearchPublisherSelect = (value: string) => {
    // console.log(value);
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
      const pdfRef = ref(fireStorage, `pdfs/${fileUpload.name}`);

      const uploadFileReponse = await uploadBytes(pdfRef, fileUpload);
      const urlLink: string = await getDownloadURL(uploadFileReponse.ref);

      //Todo: handle request Back-end

      message.success("Tải lên file thành công");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <div className="container-fluid row ">
      <div className="col">
        <Card title={"Thêm sách"}>
          <Form {...formItemLayout} form={addBookForm} onFinish={handleAddBook}>
            <Form.Item
              name={"title"}
              label={"Tên sách"}
              required
              rules={[
                {
                  message: "Tên sách không được trống ",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name={"price"}
              label={"Giá sách"}
              required
              rules={[
                {
                  type: "number",
                  message: "Giá sách phải là một số",
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
              required
              rules={[
                {
                  type: "number",
                  message: "Số trang sách phải là một số",
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
              name={"description"}
              label={"Mô tả"}
              required
              rules={[
                {
                  min: 10,
                  message: "Mô tả ít nhất 10 ký tự",
                },
              ]}
            >
              <Input.TextArea allowClear />
            </Form.Item>
            <Form.Item label={"Nhà xuất bản"}>
              <Select
                showSearch
                optionFilterProp="label"
                labelInValue={true}
                optionLabelProp="value"
                onChange={onChangePublisherSelect}
                onSearch={onSearchPublisherSelect}
              >
                {state.publishers.map((index) => (
                  <Select.Option key={index.id} value={index.name}>
                    {index.name}
                  </Select.Option>
                ))}
              </Select>
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

            <Button
              type="primary"
              onClick={handleAddBook}
              disabled={fileUpload === undefined}
              loading={state.isLoading}
              style={{ marginTop: 16 }}
            >
              {state.isLoading ? "Uploading" : "Start Upload"}
            </Button>
          </Form>
        </Card>
      </div>
      <div className="col"></div>
    </div>
  );
};

export default AddBookPage;
