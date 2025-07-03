import React from 'react';
import { Card } from 'antd';
import CodeStorageApp from '../components/CodeEditor';

function Compiler() {
  return (
    <div>
      <Card title="Code Compiler" >
        <CodeStorageApp/>
      </Card>
    </div>
  );
}

export default Compiler;