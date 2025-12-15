
import {Row, Col } from 'antd'
import Chatwindow from './Chatwindow';
import Sidebar from './Sidebar';
export default function ChatRoom() {
  return (
    <Row  >
  <Col span={6}>
    <Sidebar />
  </Col>

  <Col span={18}>
    <Chatwindow />
  </Col>
</Row>
  )
}
