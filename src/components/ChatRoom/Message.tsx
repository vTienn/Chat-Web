import styles from "./Message.module.css";
import { Avatar } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { delDocument } from "../../firebase/service";

export default function Message({
  text,
  displayName,
  photoURL,
  createdAt,
  uid,
  docId,
}: {
  text: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  uid: string;
  docId: string;
}) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async () => {
    // ❌ Không phải người gửi
    if (user?.uid !== uid) {
      window.alert("Bạn không có quyền xoá tin nhắn này");
      setOpen(false);
      return;
    }

    // ✅ Là người gửi → hỏi xác nhận
    const ok = window.confirm("Bạn có chắc chắn muốn xoá tin nhắn này không?");
    if (!ok) return;

    try {
      await delDocument("messages", docId);
      console.log("Deleted message:", docId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setOpen(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.message}>
      <Avatar className={styles.avatar} size={40} src={photoURL} />

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{displayName}</span>
          <span className={styles.time}>{createdAt}</span>

          <div className={styles.moreWrapper} ref={menuRef}>
            <EllipsisOutlined
              className={styles.moreIcon}
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className={styles.moreMenu}>
                <div
                  className={styles.menuItem}
                  onClick={handleDelete}
                >
                  Delete
                </div>

                <div className={styles.menuItem}>Report</div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.bubble}>{text}</div>
      </div>
    </div>
  );
}
