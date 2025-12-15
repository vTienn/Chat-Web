import UserInfo from './UserInfo';
import RoomList from './RoomList';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <UserInfo />
      <RoomList />
    </div>
  );
}
