import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, InputNumber, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { pdfRef } from "../../../firebase/firebaseConfig";

const AddBookPage = () => {
  const [fileUpload, setFileUpload] = useState<any>();
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
  const { Dragger } = Upload;

  const handleAddBook = () => {
    // TODO: Làm xong cái thể loại + tác giả thì quay lại làm tiếp
    console.log(fileUpload);
  };
  const uploadPDF = async (file: File) => {
    const uploadTask = uploadBytesResumable(pdfRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
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
            <Form.Item label="File sách">
              <Dragger
                name="pdfFile"
                multiple={false}
                accept=".pdf"
                customRequest={(info) => {
                  setFileUpload(info.file);
                }}
                className="m-3"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click hoặc thả file vào vùng này để tải lên
                </p>
              </Dragger>
            </Form.Item>
            <Button onClick={() => addBookForm.submit()} type="primary">
              Thêm
            </Button>
          </Form>
        </Card>
      </div>
      <div className="col"></div>
    </div>
  );
};

export default AddBookPage;
