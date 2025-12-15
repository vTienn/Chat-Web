import { Modal, Form, Input } from 'antd'
import { AuthContext } from '../../../Context/AuthProvider'
import { addDocument } from '../../../firebase/service';
import { useContext } from 'react';
export default function ModalAddRoom() {
  const { visible, setVisible } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();


  const handleOk = () => {

    console.log("Form Values:", form.getFieldsValue());
    addDocument("rooms", {
      ...form.getFieldsValue(),
      member: [user.uid],
      createdAt: new Date()
    });

    form.resetFields();
    setVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      title="Add New Room"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Room Name"
          name="name"
          rules={[{ required: true, message: "Room name is required!" }]}
        >
          <Input placeholder="Room Name" />
        </Form.Item>

        <Form.Item
          label="Room Description"
          name="description"
        >

          <Input.TextArea placeholder="Room Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
