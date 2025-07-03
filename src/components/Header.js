import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { 
  MenuOutlined, 
  BookOutlined, 
  CodeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const showSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const menuItems = [
    {
      key: '1',
      icon: <BookOutlined />,
      label: 'Home',
    },
    {
      key: '2',
      icon: <CodeOutlined />,
      label: 'Coding_questions',
    },
  ];

  const handleMenuClick = (e) => {
    console.log('Menu clicked:', e);
    
    // Navigation logic
    switch(e.key) {
      case '1':
        navigate('/');
        break;
      case '2':
        navigate('/compiler');
        break;
      default:
        break;
    }
    
    closeSidebar();
  };

  return (
    <>
      <AntHeader style={{ 
        position: 'fixed', 
        zIndex: 1, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#001529',
        padding: '0 20px'
      }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showSidebar}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
            color: 'white'
          }}
        />
        <div style={{ 
          color: 'white', 
          fontSize: '18px', 
          fontWeight: 'bold',
          marginLeft: '20px'
        }}>
          Question Bank
        </div>
      </AntHeader>

      <Drawer
        title="Navigation Menu"
        placement="left"
        closable={true}
        onClose={closeSidebar}
        open={sidebarVisible}
        width={280}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            height: '100%', 
            borderRight: 0 
          }}
        />
      </Drawer>
    </>
  );
};

export default Header;