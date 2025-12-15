import { Modal, Form, Select, Spin } from 'antd';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthProvider';
import { addDocument } from '../../../firebase/service';
import { db } from '../../../firebase/config';
import { collection, query, where, orderBy, limit, getDocs, updateDoc ,doc,arrayUnion} from "firebase/firestore";

interface UserOption {
  uid: string;
  label: string;
  value: string;
}

export default function AddMember() {
  const [options, setOptions] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const {selectedRoom,setSelectedRoom}=useContext(AuthContext);
  const { visibleInviteMember, setVisibleInviteMember, user } = useContext(AuthContext);
  const [form] = Form.useForm();

//   const handleSearch = async (text: string) => {
//     if (!text) return setOptions([]);
//     setLoading(true);

//     const q = query(
//       collection(db, "users"),
//         where("keyWords", "array-contains", text.toLowerCase()),
//       orderBy("displayName"),
//       limit(20)
//     );

//     const snapshot = await getDocs(q);
//     console.log("Search Query Snapshot:", snapshot);
//     const userList = snapshot.docs
//       .map(doc => ({
//         uid: doc.data().uid,
//         label: doc.data().displayName,
//         value: doc.data().uid
//       }))
//       .filter(u => u.uid !== user?.uid);

//     setOptions(userList);
//     console.log("Search Results:", userList);
//     setLoading(false);
//   };
  const handleSearch = async (text: string) => {
    if(!selectedRoom){
      return ;
    }
  setLoading(true);

  
  const q = query(collection(db, "users"), orderBy("displayName"), limit(50));
  const snapshot = await getDocs(q);

  const userList = snapshot.docs
    .map(doc => ({
      uid: doc.data().uid,
      label: doc.data().displayName,
      value: doc.data().uid
    }))
    .filter(u => u.uid !== user?.uid)
    .filter(u=> !selectedRoom.member.includes(u.uid))
    .filter(u => !text || u.label.toLowerCase().includes(text.toLowerCase())); 

  setOptions(userList);
  setLoading(false);
};


  


const handleOk = async () => {
  try {
    if (!user || !selectedRoom) return;

    const roomRef = doc(db, "rooms", selectedRoom.id);
    await updateDoc(roomRef, {
      member: arrayUnion(...selectedUsers)
    });

    form.resetFields();
    setSelectedUsers([]);
    setVisibleInviteMember(false);

    console.log("Thêm thành viên thành công vào phòng:", selectedRoom.name);
  } catch (error) {
    console.error("Error adding members to room:", error);
  }
};


  const handleCancel = () => {
    form.resetFields();
    setSelectedUsers([]);
    setVisibleInviteMember(false);
  };

  return (
    <Modal
      title="Add New Member"
      open={visibleInviteMember}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="roomName" >
          <Select
            mode="multiple"
            showSearch
            placeholder="Nhập tên thành viên..."
            onSearch={handleSearch}
            filterOption={false}
            onChange={v => setSelectedUsers(v)}
            notFoundContent={loading ? <Spin size="small" /> : null}
            options={options}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
