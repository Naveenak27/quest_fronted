import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadDocument } from '../services/api';

function FileUpload({ visible, onClose, onSuccess }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', fileList[0]);

    try {
      await uploadDocument(formData);
      message.success('Document processed successfully!');
      setFileList([]);
      onSuccess();
      onClose();
    } catch (error) {
      message.error('Failed to process document');
    }
    setUploading(false);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'application/vnd.oasis.opendocument.text'; // ODT MIME type
      
      if (!isValidType) {
        message.error('You can only upload PDF, Word (DOC/DOCX), or ODT documents!');
        return false;
      }
      
      // Check file size (10MB limit)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => setFileList([]),
    accept: '.pdf,.doc,.docx,.odt' // Explicitly show supported file types
  };

  return (
    <Modal
      title="Upload Document"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="upload" 
          type="primary" 
          onClick={handleUpload}
          loading={uploading}
          disabled={fileList.length === 0}
        >
          Process Document
        </Button>
      ]}
    >
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Select Document</Button>
      </Upload>
      <div style={{ marginTop: '16px', color: '#666' }}>
        <p>Supported formats: PDF, Word (DOC/DOCX), and ODT documents.</p>
        <p>Maximum file size: 10MB.</p>
        <p>The system will automatically extract and organize questions and answers.</p>
      </div>
    </Modal>
  );
}

export default FileUpload;