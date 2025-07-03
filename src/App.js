import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { BookOutlined, CodeOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import Compiler from './pages/Compiler';
import './App.css';
import Header from './components/Header';

const {  Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
              <Header />

        <Content  style={{
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compiler" element={<Compiler />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;