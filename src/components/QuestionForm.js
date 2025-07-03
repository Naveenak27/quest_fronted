import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { createQuestion, updateQuestion } from '../services/api';

const { TextArea } = Input;
const { Option } = Select;

function QuestionForm({ visible, onClose, onSuccess, categories, editingQuestion }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (editingQuestion && visible) {
      form.setFieldsValue({
        question: editingQuestion.question,
        answer: editingQuestion.answer,
        category: editingQuestion.category,
        subcategory: editingQuestion.subcategory
      });
      setSelectedCategory(editingQuestion.category);
    } else if (!editingQuestion && visible) {
      // Reset form for new question
      form.resetFields();
      setSelectedCategory(null);
    }
  }, [editingQuestion, visible, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingQuestion) {
        // Update existing question
        await updateQuestion(editingQuestion.id, values);
        message.success('Question updated successfully!');
      } else {
        // Create new question
        await createQuestion(values);
        message.success('Question added successfully!');
      }
      
      form.resetFields();
      setSelectedCategory(null);
      onSuccess();
      onClose();
    } catch (error) {
      message.error(editingQuestion ? 'Failed to update question' : 'Failed to add question');
    }
    setLoading(false);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Reset subcategory when category changes
    form.setFieldsValue({ subcategory: undefined });
  };

  return (
    <Modal
      title={editingQuestion ? "Edit Question" : "Add New Question"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: 'Please enter the question' }]}
        >
          <TextArea rows={3} placeholder="Enter your question here..." />
        </Form.Item>

        <Form.Item
          name="answer"
          label="Answer"
          rules={[{ required: true, message: 'Please enter the answer' }]}
        >
          <TextArea rows={5} placeholder="Enter the answer here..." />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select category"
            onChange={handleCategoryChange}
          >
            {Object.keys(categories).map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subcategory"
          label="Sub-Category"
          rules={[{ required: true, message: 'Please select a sub-category' }]}
        >
          <Select
            placeholder="Select sub-category"
            disabled={!selectedCategory}
          >
            {selectedCategory && categories[selectedCategory]?.map(sub => (
              <Option key={sub} value={sub}>{sub}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default QuestionForm;