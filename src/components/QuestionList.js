import React from 'react';
import { Card, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteQuestion } from '../services/api';

function QuestionList({ questions, onUpdate, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      message.success('Question deleted successfully!');
      onUpdate();
    } catch (error) {
      message.error('Failed to delete question');
    }
  };

  const handleEdit = (question) => {
    if (onEdit) {
      onEdit(question);
    }
  };

  return (
    <div>
      {questions.map(q => (
        <Card 
          key={q.id}
          style={{ marginBottom: '16px' }}
          title={
            <div>
              <span>{q.category} - {q.subcategory}</span>
            </div>
          }
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => handleEdit(q)}
              />
              <Popconfirm
                title="Are you sure you want to delete this question?"
                onConfirm={() => handleDelete(q.id)}
              >
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Popconfirm>
            </Space>
          }
        >
          <div style={{ marginBottom: '12px' }}>
            <strong>Q: </strong>{q.question}
          </div>
          <div>
            <strong>A: </strong>{q.answer}
          </div>
        </Card>
      ))}
      {questions.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', color: '#999' }}>
            No questions found. Add some questions to get started!
          </div>
        </Card>
      )}
    </div>
  );
}

export default QuestionList;