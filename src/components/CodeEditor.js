import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Modal, 
  Input, 
  Select, 
  message, 
  Spin, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FilterOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CodeStorageApp = () => {
  const [codes, setCodes] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    category: 'algorithm'
  });

  const API_BASE = 'https://quest-backend-4w5k.onrender.com/api';

  // Categories array for consistency
  const categories = [
    { value: 'algorithm', label: 'Algorithm' },
    { value: 'data-structure', label: 'Data Structure' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'database', label: 'Database' },
    { value: 'utility', label: 'Utility' },
    { value: 'react', label: 'React' }
  ];

  // Fetch all codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/codes`);
      const data = await response.json();
      setCodes(data);
      setFilteredCodes(data);
    } catch (error) {
      message.error('Error fetching codes');
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter codes by category
  const filterCodesByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredCodes(codes);
    } else {
      const filtered = codes.filter(code => code.category === category);
      setFilteredCodes(filtered);
    }
  };

  // Update filtered codes when codes change
  useEffect(() => {
    filterCodesByCategory(selectedCategory);
  }, [codes]);

  // Create new code
  const createCode = async () => {
    try {
      const response = await fetch(`${API_BASE}/codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        message.success('Code created successfully');
        fetchCodes();
        closeModal();
      }
    } catch (error) {
      message.error('Error creating code');
      console.error('Error creating code:', error);
    }
  };

  // Update code
  const updateCode = async () => {
    try {
      const response = await fetch(`${API_BASE}/codes/${selectedCode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        message.success('Code updated successfully');
        fetchCodes();
        closeModal();
      }
    } catch (error) {
      message.error('Error updating code');
      console.error('Error updating code:', error);
    }
  };

  // Delete code
  const deleteCode = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/codes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        message.success('Code deleted successfully');
        fetchCodes();
      }
    } catch (error) {
      message.error('Error deleting code');
      console.error('Error deleting code:', error);
    }
  };

  // Modal handlers
  const openModal = (mode, code = null) => {
    setModalMode(mode);
    setSelectedCode(code);
    setIsModalOpen(true);
    
    if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        category: 'algorithm'
      });
    } else if (code) {
      setFormData({
        title: code.title,
        description: code.description,
        code: code.code,
        language: code.language,
        category: code.category
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      category: 'algorithm'
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.code) {
      message.error('Please fill in all required fields');
      return;
    }

    if (modalMode === 'create') {
      createCode();
    } else if (modalMode === 'edit') {
      updateCode();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'orange',
      python: 'blue',
      java: 'red',
      cpp: 'purple',
      c: 'geekblue',
      html: 'volcano',
      css: 'cyan',
      sql: 'green'
    };
    return colors[language] || 'default';
  };

  const getCategoryColor = (category) => {
    const colors = {
      algorithm: 'magenta',
      'data-structure': 'blue',
      'web-development': 'green',
      'mobile-development': 'orange',
      database: 'purple',
      utility: 'cyan',
      react: 'geekblue'
    };
    return colors[category] || 'default';
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <style jsx>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none;
          }
          .show-on-mobile {
            display: inline;
          }
          .mobile-modal .ant-modal {
            margin: 0 !important;
            max-width: 100% !important;
            top: 0 !important;
            padding-bottom: 0 !important;
          }
          .mobile-modal .ant-modal-content {
            border-radius: 0 !important;
            height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .mobile-modal .ant-modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 16px !important;
          }
          .mobile-modal .ant-modal-header {
            padding: 16px !important;
            border-bottom: 1px solid #e9ecef !important;
          }
          .mobile-modal .ant-modal-footer {
            padding: 16px !important;
            border-top: 1px solid #e9ecef !important;
          }
        }
        @media (min-width: 769px) {
          .hide-on-mobile {
            display: inline;
          }
          .show-on-mobile {
            display: none;
          }
        }
      `}</style>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Title level={2} style={{ margin: 0 }}>Code Storage</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => openModal('create')}
            size="large"
            style={{ minWidth: 'auto' }}
          >
            <span className="hide-on-mobile">Add New Code</span>
            <span className="show-on-mobile">Add</span>
          </Button>
        </div>
        
        {/* Filter Section - Mobile Responsive */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          flexWrap: 'wrap',
          backgroundColor: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <FilterOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
          <Text strong style={{ whiteSpace: 'nowrap' }}>Filter:</Text>
          <Select
            value={selectedCategory}
            onChange={filterCodesByCategory}
            style={{ minWidth: 150, flex: 1, maxWidth: 300 }}
            placeholder="Select category"
          >
            <Option value="all">All Categories</Option>
            {categories.map(category => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Showing {filteredCodes.length} of {codes.length} codes
          {selectedCategory !== 'all' && (
            <div style={{ marginTop: '4px' }}>
              <span>Category: </span>
              <Tag color={getCategoryColor(selectedCategory)} style={{ margin: 0 }}>
                {categories.find(cat => cat.value === selectedCategory)?.label}
              </Tag>
            </div>
          )}
        </Text>
      </div>

      {/* Main Content */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredCodes.map((code) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={code.id}>
              <Card
                actions={[
                  <EyeOutlined 
                    key="view" 
                    onClick={() => openModal('view', code)}
                    style={{ color: '#1890ff', fontSize: '16px' }}
                  />,
                  <EditOutlined 
                    key="edit" 
                    onClick={() => openModal('edit', code)}
                    style={{ color: '#52c41a', fontSize: '16px' }}
                  />,
                  <Popconfirm
                    title="Are you sure you want to delete this code?"
                    onConfirm={() => deleteCode(code.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="top"
                  >
                    <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                  </Popconfirm>
                ]}
                style={{ height: '100%' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Title level={5} style={{ margin: 0, marginBottom: '8px', fontSize: '16px' }}>
                    {code.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '13px', display: 'block', lineHeight: '1.4' }}>
                    {code.description.length > 80 ? `${code.description.substring(0, 80)}...` : code.description}
                  </Text>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <Space wrap>
                    <Tag color={getLanguageColor(code.language)} style={{ fontSize: '11px' }}>
                      {code.language.toUpperCase()}
                    </Tag>
                    <Tag color={getCategoryColor(code.category)} style={{ fontSize: '11px' }}>
                      {code.category.replace('-', ' ').toUpperCase()}
                    </Tag>
                  </Space>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '8px', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  overflow: 'hidden'
                }}>
                  <pre style={{ 
                    margin: 0, 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    maxHeight: '80px',
                    overflow: 'hidden',
                    lineHeight: '1.3'
                  }}>
                    {code.code.substring(0, 100)}...
                  </pre>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* No results message */}
        {filteredCodes.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <Title level={4} type="secondary">No codes found</Title>
            <Text type="secondary">
              {selectedCategory === 'all' 
                ? 'No codes available. Add your first code snippet!' 
                : `No codes found in the "${categories.find(cat => cat.value === selectedCategory)?.label}" category.`}
            </Text>
          </div>
        )}
      </Spin>

      {/* Modal */}
      <Modal
        title={modalMode === 'create' ? 'Add New Code' : 
               modalMode === 'edit' ? 'Edit Code' : selectedCode?.title}
        open={isModalOpen}
        onCancel={closeModal}
        width={modalMode === 'view' ? '90vw' : '85vw'}
        style={{ maxWidth: modalMode === 'view' ? 900 : 800, top: window.innerWidth <= 768 ? 0 : 20 }}
        className={window.innerWidth <= 768 ? 'mobile-modal' : ''}
        footer={modalMode === 'view' ? [
          <Button key="close" onClick={closeModal} block={window.innerWidth <= 768}>
            Close
          </Button>
        ] : [
          <Button key="cancel" onClick={closeModal} style={{ marginRight: window.innerWidth <= 768 ? 0 : 8, marginBottom: window.innerWidth <= 768 ? 8 : 0 }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} block={window.innerWidth <= 768}>
            {modalMode === 'create' ? 'Create' : 'Update'}
          </Button>
        ]}
      >
        {modalMode === 'view' ? (
          /* View Mode - Code Display */
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <Space size="large" wrap>
                <Tag color={getLanguageColor(selectedCode?.language)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                  {selectedCode?.language?.toUpperCase()}
                </Tag>
                <Tag color={getCategoryColor(selectedCode?.category)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                  {selectedCode?.category?.replace('-', ' ').toUpperCase()}
                </Tag>
              </Space>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '12px', color: '#1890ff', fontSize: '16px' }}>
                Description
              </Title>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {selectedCode?.description}
              </div>
            </div>

            <div>
              <Title level={5} style={{ marginBottom: '12px', color: '#1890ff', fontSize: '16px' }}>
                Code
              </Title>
              <div style={{ 
                backgroundColor: '#1f1f1f', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid #333',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                fontSize: '12px',
                lineHeight: '1.4',
                color: '#f8f8f2',
                overflow: 'auto',
                maxHeight: window.innerWidth <= 768 ? '300px' : '500px'
              }}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#f8f8f2'
                }}>
                  {selectedCode?.code}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Edit/Create Mode - Form */
          <div style={{ padding: '8px 0' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter code title"
                    size={window.innerWidth <= 768 ? 'large' : 'middle'}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    Language
                  </label>
                  <Select
                    value={formData.language}
                    onChange={(value) => handleInputChange('language', value)}
                    style={{ width: '100%' }}
                    size={window.innerWidth <= 768 ? 'large' : 'middle'}
                  >
                    <Option value="javascript">JavaScript</Option>
                                        <Option value="react">react</Option>

                    <Option value="python">Python</Option>
                    <Option value="java">Java</Option>
                    <Option value="cpp">C++</Option>
                    <Option value="c">C</Option>
                    <Option value="html">HTML</Option>
                    <Option value="css">CSS</Option>
                    <Option value="sql">SQL</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Category
              </label>
              <Select
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                style={{ width: '100%' }}
                size={window.innerWidth <= 768 ? 'large' : 'middle'}
              >
                {categories.map(category => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Description *
              </label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={window.innerWidth <= 768 ? 3 : 4}
                placeholder="Enter code description"
                size={window.innerWidth <= 768 ? 'large' : 'middle'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Code *
              </label>
              <TextArea
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                rows={window.innerWidth <= 768 ? 8 : 12}
                placeholder="Enter your code here..."
                style={{ fontFamily: 'monospace', fontSize: window.innerWidth <= 768 ? '13px' : '14px' }}
                size={window.innerWidth <= 768 ? 'large' : 'middle'}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CodeStorageApp;