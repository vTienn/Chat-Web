import { Avatar, Button } from "antd";
import styles from "./UserInfo.module.css";
import { auth } from "../../firebase/config";
import { useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useContext } from "react";
export default function UserInfo() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.userRow}>
        <Avatar
          size={48}
          src={currentUser?.photoURL || "https://joeschmoe.io/api/v1/random"}
        />
        <p className={styles.username}>{currentUser?.displayName || "User"}</p>
      </div>

      <Button onClick={() => auth.signOut()} className={styles.logoutBtn}>
        Log Out
      </Button>
    </div>
  );
}
