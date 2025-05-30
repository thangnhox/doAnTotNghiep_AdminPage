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
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { AppConstants } from "../../../constants";
  import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";
  import Author from "../../../models/Author";
  import { BookStatus } from "../../../models/book/BookEnum";
  import Category from "../../../models/Category";
  import Publisher from "../../../models/Publisher";
  import { handleAPI } from "../../../remotes/apiHandle";
  import { debounceSearch } from "../../../utils/debouce";
  
  interface PageState {
    isLoading: boolean;
    authors: Author[];
    categories: Category[];
    publishers: Publisher[];
  }
  
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  
  const EditBookPage = () => {
    const { id } = useParams<{ id: string }>(); // Get book ID from URL
    const navigate = useNavigate();
    const [state, setState] = useState<PageState>({
      authors: [],
      categories: [],
      isLoading: false,
      publishers: [],
    });
    const [isRecommended, setRecommend] = useState<boolean>(true);
    const [bookStatus, setBookStatus] = useState<number>();
    const [selectedAuthorId, setSelectedAuthorId] = useState<number>();
    const [selectedPublisherId, setSelectedPublisherId] = useState<number>();
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>();
    const [editBookForm] = useForm();
  
    useEffect(() => {
      const fetchBookDetails = async () => {
        try {
          setState((prev) => ({ ...prev, isLoading: true }));
          const res: AxiosResponse<ResponseDTO<any>> = await handleAPI(
            `books/fetch/${id}`
          );
          const book = res.data.data;

          // Populate form fields with book data
          editBookForm.setFieldsValue({
            title: book.Title,
            description: book.Description,
            price: book.Price,
            pageCount: book.PageCount,
            publishDate: dayjs(book.PublishDate, AppConstants.dateFormat),
            rank: book.rank, // Set rank dynamically
          });
  
          setBookStatus(book.status);
          setRecommend(book.IsRecommended === 1);
          setSelectedAuthorId(undefined); // Author is selected separately
          setSelectedPublisherId(undefined); // Publisher is selected separately
          setSelectedCategoryIds([]); // Categories are selected separately
        } catch (error) {
          console.error(error);
          message.error("Không thể tải thông tin sách");
        } finally {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      };
  
      fetchBookDetails();
    }, [id, editBookForm]);
  
    const handleEditBook = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      try {
        const title: string = editBookForm.getFieldValue("title");
        const description: string = editBookForm.getFieldValue("description");
        const publishDateObj: string = editBookForm.getFieldValue("publishDate");
        const pageCount: string = editBookForm.getFieldValue("pageCount");
        const price: string = editBookForm.getFieldValue("price");
        const rank: number = editBookForm.getFieldValue("rank");
  
        const publishDate: string = dayjs(publishDateObj).format(
          AppConstants.dateFormat
        );
  
        // Remove validation for these fields
        // if (!selectedCategoryIds || selectedCategoryIds.length < 0) {
        //   message.error("Chưa chọn thể loại");
        //   return;
        // }

        // if (!selectedAuthorId) {
        //   message.error("Chưa chọn tác giả");
        //   return;
        // }

        // if (!selectedPublisherId) {
        //   message.error("Chưa chọn nhà xuất bản");
        //   return;
        // }
  
        const updatedBook = {
          title,
          description,
          pageCount,
          price,
          fileUrl: undefined, // Not editable
          coverUrl: undefined, // Not editable
          status: bookStatus,
          authorsId: selectedAuthorId || undefined, // Allow undefined
          publisherId: selectedPublisherId || undefined, // Allow undefined
          publishDate,
          categoryIds: selectedCategoryIds?.length ? selectedCategoryIds : undefined, // Allow undefined
          isRecommended: isRecommended ? 1 : 0,
          rank: rank,
        };
  
        const res = await handleAPI(`books/edit/${id}`, updatedBook, "post");
        console.log(res);
        message.success("Cập nhật sách thành công");
        navigate(-1); // Go back to the previous page
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
        const res: AxiosResponse<ResponseDTO<Publisher[]>> = await handleAPI(
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
      editBookForm.setFieldValue(
        "publishDate",
        dayjs(date, AppConstants.dateFormat)
      );
    };
  
    return (
      <div className="container-fluid row ">
        <div className="col">
          <Card title={"Chỉnh sửa sách"}>
            <Form {...formItemLayout} form={editBookForm} onFinish={handleEditBook}>
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
                  onSearch={debounceSearch(handleSearchCategory, 1000)}
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
                  onSearch={debounceSearch(handleSearchPublisher, 1000)}
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
                  onSearch={debounceSearch(handleSearchAuthor, 1000)}
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
                        label: BookStatus.HIDE.lable,
                        value: BookStatus.HIDE.value,
                    },
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
              <Form.Item label="Độ tuổi" name="rank">
                <Select
                  value={editBookForm.getFieldValue("rank")} // Ensure correct value is displayed
                  onSelect={(val) => editBookForm.setFieldValue("rank", val)}
                >
                  <Select.Option key={"1"} value={"1"} children={"Tất cả"} />
                  <Select.Option key={"2"} value={"2"} children={"Trên 6 tuổi"} />
                  <Select.Option key={"3"} value={"3"} children={"Trên 11 tuổi"} />
                  <Select.Option key={"4"} value={"4"} children={"Trên 18 tuổi"} />
                </Select>
              </Form.Item>
              <Form.Item valuePropName="checked">
                <Checkbox
                  checked={isRecommended}
                  onChange={(val) => {
                    console.log(val)
                    setRecommend(val.target.checked)
                  }}
                >
                  Đề cử
                </Checkbox>
              </Form.Item>
              <Button
                type="primary"
                onClick={handleEditBook}
                loading={state.isLoading}
                style={{ marginTop: 16 }}
              >
                {state.isLoading ? "Updating" : "Update Book"}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    );
  };
  
  export default EditBookPage;