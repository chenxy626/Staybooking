import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadStay } from "../utils";
 
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
 
class UploadStay extends React.Component {
  state = {
    loading: false,
  };
 
  fileInputRef = React.createRef(); //浏览器原始的function
 
  handleSubmit = async (values) => {
    const formData = new FormData(); //FormData是浏览器环境自带的，用于处理文件类的信息并发送至后端API时
    const { files } = this.fileInputRef.current; //React通用写法
 
    if (files.length > 5) {
      message.error("You can at most upload 5 pictures.");
      return;
    }
 
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]); //文件只能每次一个一个地往上传，浏览器要求
    }
 
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("guest_number", values.guest_number);
 
    this.setState({
      loading: true,
    });
    try {
      await uploadStay(formData);
      message.success("upload successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  render() {
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={this.handleSubmit} // line 87, 88点击时button时会触发Form执行onFinish, 这个是AntD自带的函数
        style={{ maxWidth: 1000, margin: "auto" }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item
          name="guest_number"
          label="Guest Number"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
          <input
            type="file"
            accept="image/png, image/jpeg" //前端基本没有限制，只是帮助在前端控制filter了一个筛选
            ref={this.fileInputRef} //读取用户上传文件内的内容
            multiple={true}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
              {/* htmlType = "submit"被点击时会触发onFinish, line 55 */}
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
 
export default UploadStay;
