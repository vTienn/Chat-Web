import { Collapse, Button } from "antd";
import styles from "./RoomList.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { AuthContext } from "../../Context/AuthProvider";
import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import { db } from "../../firebase/config";

const { Panel } = Collapse;

export default function RoomList() {
  const { user } = useContext(AuthContext);
  const { visible, setVisible } = useContext(AuthContext);
  const [roomData, setRoomData] = useState<any[]>([]);
  const { selectedRoom, setSelectedRoom } = useContext(AuthContext);

  const handleSetVisible = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "rooms"),
      where("member", "array-contains", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoomData(roomsData);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <Collapse
      ghost
      defaultActiveKey={["1"]}
      className={styles.customCollapse}
      expandIconPosition="end"
    >
      <Panel header="Room List" key="1">
        {roomData.length > 0 ? (
          roomData.map((room) => (
            <div
              onClick={() => setSelectedRoom(room)}
              className={styles.roomItem}
              key={room.id}
            >
              {room.name || "Unnamed Room"}
            </div>
          ))
        ) : (
          <p className={styles.noRoomText}>No rooms found</p>
        )}

        <Button
          onClick={() => {
            handleSetVisible();
          }}
          icon={<PlusOutlined />}
          className={styles.addRoom}
        >
          Add Room
        </Button>
      </Panel>
    </Collapse>
  );
}
