import { useState } from 'react';


function ConfigPanel() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello This Will B the Config Panel</p>

      </header>
    </div>
  );
}

export default ConfigPanel;
