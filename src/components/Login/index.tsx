import { Button, Row, Col, Typography, Card } from 'antd';
import {
  FacebookFilled,
  GoogleOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';

import { auth } from '../../firebase/config';
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAdditionalUserInfo } from 'firebase/auth';
import { addNewUserToFirestore } from '../../firebase/service';

import styles from './Login.module.css';

const { Title, Text } = Typography;

export default function Login() {
  const handleLoginFb = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser) {
        await addNewUserToFirestore(user, additionalInfo);
      }
    } catch (error) {
      console.log('Error during Facebook login', error);
    }
  };

  return (
    <Row className={styles.wrapper} justify="center" align="middle">
      <Col>
        <Card className={styles.card} bordered={false}>
          <div className={styles.logo}>
            <ThunderboltFilled />
          </div>

          <Title level={2} className={styles.title}>
            Welcome to Web Realtime
          </Title>

          <Text type="secondary" className={styles.subtitle}>
            Sign in to continue
          </Text>

          <Button
            icon={<GoogleOutlined />}
            size="large"
            block
            className={styles.googleBtn}
          >
            Login with Google
          </Button>

          <Button
            icon={<FacebookFilled />}
            size="large"
            block
            className={styles.facebookBtn}
            onClick={handleLoginFb}
          >
            Login with Facebook
          </Button>
        </Card>
      </Col>
    </Row>
  );
}
