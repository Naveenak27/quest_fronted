import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import QuestionForm from '../components/QuestionForm';
import QuestionList from '../components/QuestionList';
import { getQuestions } from '../services/api';

const { Content } = Layout;
const { Option } = Select;

const categories = {
  'HTML': ['Basic', 'Semantic HTML', 'Forms', 'HTML5 APIs', 'Accessibility', 'SEO'],
  'CSS': ['Basic', 'Flexbox', 'Grid', 'Animations', 'Transitions', 'Responsive Design', 'Preprocessors', 'CSS3', 'Box Model', 'Positioning'],
  'JavaScript': ['Basic', 'ES6+', 'DOM Manipulation', 'Async/Await', 'Promises', 'Closures', 'Prototypes', 'Event Handling', 'Error Handling', 'Modules'],
  'React': ['Components', 'Hooks', 'State Management', 'Props', 'Context API', 'Router', 'Lifecycle', 'Performance', 'Testing', 'Custom Hooks'],
  'Redux': ['Redux Toolkit', 'Actions', 'Reducers', 'Middleware', 'Store', 'Selectors', 'Thunk', 'Saga'],
  'Node.js': ['Basic', 'Express', 'APIs', 'Database', 'Authentication', 'Middleware', 'File System', 'Streams', 'Events', 'NPM'],
  'Database': ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Queries', 'Indexing', 'Relationships', 'Transactions'],
  'Backend': ['REST APIs', 'GraphQL', 'Authentication', 'Authorization', 'Security', 'Caching', 'Microservices', 'Server Architecture'],
  'Frontend': ['Performance', 'SEO', 'Accessibility', 'PWA', 'State Management', 'Component Design', 'Testing', 'Build Tools'],
  'DevOps': ['Git', 'CI/CD', 'Docker', 'AWS', 'Deployment', 'Monitoring', 'Testing', 'Version Control'],
  'TypeScript': ['Basic', 'Types', 'Interfaces', 'Generics', 'Decorators', 'Modules', 'Configuration'],
  'Testing': ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Jest', 'React Testing Library', 'Cypress', 'Mocking'],
  'Web Performance': ['Optimization', 'Bundling', 'Lazy Loading', 'Caching', 'CDN', 'Metrics', 'Core Web Vitals'],
  'Security': ['Authentication', 'Authorization', 'CORS', 'XSS', 'CSRF', 'SQL Injection', 'HTTPS', 'JWT'],
  'Architecture': ['Design Patterns', 'MVC', 'MVVM', 'Clean Architecture', 'Scalability', 'Microservices', 'Monolith']
};

function Home() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, selectedCategory, selectedSubCategory]);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedSubCategory !== 'All') {
      filtered = filtered.filter(q => q.subcategory === selectedSubCategory);
    }
    
    setFilteredQuestions(filtered);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSubCategory('All');
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <Content style={{ 
        padding: '20px',
        marginTop: 64, // Account for fixed header height
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <Option value="All">All Categories</Option>
                {Object.keys(categories).map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Sub-Category"
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                disabled={selectedCategory === 'All'}
              >
                <Option value="All">All Sub-Categories</Option>
                {selectedCategory !== 'All' && categories[selectedCategory]?.map(sub => (
                  <Option key={sub} value={sub}>{sub}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setShowForm(true)}
                style={{ width: '100%' }}
              >
                Add Question
              </Button>
            </Col>
          </Row>

          <QuestionForm 
            visible={showForm}
            onClose={handleCloseForm}
            onSuccess={fetchQuestions}
            categories={categories}
            editingQuestion={editingQuestion}
          />

          <QuestionList 
            questions={filteredQuestions}
            onUpdate={fetchQuestions}
            onEdit={handleEditQuestion}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default Home;