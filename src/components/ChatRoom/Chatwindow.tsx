import { Button, Avatar, Tooltip, Form, Input, Alert } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import Message from "./Message";
import styles from "./Chatwindow.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { addDocument, formatCreatedAt } from "../../firebase/service";

export default function Chatwindow() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { selectedRoom, setSelectedRoom } = useContext(AuthContext);
  const { visibleInviteMember, setVisibleInviteMember } =
    useContext(AuthContext);
  const [roomMembers, setRoomMembers] = useState([]);
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [messages, setMessages] = useState<string>("");
  const [messagesData, setMessagesData] = useState<any[]>([]);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView();
      isFirstLoad.current = false;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  useEffect(() => {
    if (!selectedRoom?.id) return;

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", selectedRoom.id),
      orderBy("createAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessagesData(msgs);
    });

    return () => unsubscribe();
  }, [selectedRoom?.id]);

  const handleSubmit = () => {
    if (!messages.trim()) return;
    if (!user || !selectedRoom) return;
    addDocument("messages", {
      text: messages,
      uid: user.uid,
      roomId: selectedRoom.id,
      disPlayName: user.displayName,
      photoURL: user.photoURL,
    });

    form.resetFields(["messages"]);
  };
  const handleChange = (e) => {
    setMessages(e.target.value);
  };
  useEffect(() => {
    if (!selectedRoom?.member || selectedRoom.member.length === 0) return;

    const q = query(
      collection(db, "users"),
      where("uid", "in", selectedRoom.member)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoomMembers(users);
    });

    return () => unsubscribe();
  }, [selectedRoom?.member]);

  return (
    <div className={styles.chatWindow}>
      {!selectedRoom ? (
        <Alert
          message="Please select a room to start chatting."
          style={{ height: "56px" }}
          type="info"
          showIcon
        />
      ) : (
        <div className={styles.chatWindowHeader}>
          <div className={styles.roomInfo}>
            <p className={styles.roomName}>
              {selectedRoom ? selectedRoom.name : "Room Name"}{" "}
            </p>
            <span className={styles.roomDescription}>
              {selectedRoom ? selectedRoom.description : "Room Description"}
            </span>
          </div>
          <div className={styles.roomActions}>
            <Button
              onClick={() => setVisibleInviteMember(true)}
              type="text"
              icon={<UserAddOutlined />}
            >
             Add Member
            </Button>
            <Avatar.Group maxCount={4}>
              {roomMembers.map((member) => (
                <Tooltip title={member.displayName} key={member.uid}>
                  <Avatar src={member.photoURL} />
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
        </div>
      )}

      <div className={styles.chatContent}>
        <div className={styles.messages}>
          {messagesData &&
            messagesData.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                docId={message.id}
                displayName={message.disPlayName}
                photoURL={message.photoURL}
                uid={message.uid}
                createdAt={formatCreatedAt(message.createAt)
                }
              />
            ))}
          <div ref={bottomRef}></div>
        </div>
        <div className={styles.messageInput}>
          <Form form={form} className={styles.inputForm}>
            <Form.Item name="messages">
              <Input
                onChange={handleChange}
                onPressEnter={handleSubmit}
                placeholder="Type your message..."
              />
            </Form.Item>
            <Button onClick={handleSubmit}>Send</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
