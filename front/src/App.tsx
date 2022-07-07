import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [img, setImg] = useState('');
  const win: any = window;

  win.electronAPI?.openQr('new-qrcode', (qrcode: any) => {
    setImg(qrcode);
  });
  win.electronAPI?.closeQr('clean-qrcode', (qrcode: any) => {
    setImg('');
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={img} />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;

// const setButton: any = document.getElementById('btn');
// const titleInput: any = document.getElementById('title');
// const imagem: any = document.getElementById('imagemqr');
// const win: any = window;
// console.log('aquiii');
// setButton.addEventListener('click', async () => {
//   // const title = titleInput.value;
//   // const Qr = await win.electronAPI.GenerateQrCode(title);
//   // imagem.src = Qr;
//   imagem.src =
//     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQa7jSAwFwXyE7n/lHC+5KkCQ7OlPMCJ+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CWVJ5LQqZwk4ZdUnijWKMUapVijXLxM5U1JuCMJnUqn8oTKm5LwpmKNUqxRijXKxZcl4Q6VO5JwkoQTlSeScIfKNxVrlGKNUqxRLoZT6ZLQJaFT+cuKNUqxRinWKMUapVijFGuUYo1y8WUqv6TSJaFT6ZLwhMq/pFijFGuUYo1y8bIkTJaEf1mxRinWKMUaJX7whyXhTSp/WbFGKdYoxRrl4qEkdCpdEt6k0qmcJKFT6ZJwkoQ3qXxTsUYp1ijFGuXiIZUTlS4JncodSehUuiS8SaVLQqfSJeGOJHQqTxRrlGKNUqxR4gcvSkKn0iXhRKVLQqfSJeEJlS4JncpJEp5QeVOxRinWKMUaJX7woiScqDyRhE7lJAmdyhNJeELlm4o1SrFGKdYo8YMHktCpdEn4JZWTJHQqXRI6lZMknKh0SehU3lSsUYo1SrFGiR/8YUk4UemS8CaVkyTcofJEsUYp1ijFGuXioST8kkqn0iWhS0Kn0iWhU+mScEcSOpUuCZ3Km4o1SrFGKdYoFy9TeVMSTpJwotIl4SQJJyp3JKFT6ZLQqTxRrFGKNUqxRrn4siTcofJNKl0SOpWTJHQqJypdEjqVNxVrlGKNUqxRLoZR+SaVLgknSehUvqlYoxRrlGKNcjFMEjqVLgmdSpeETqVLQqdykoRfKtYoxRqlWKNcfJnKN6ncoXKicqJykoT/U7FGKdYoxRrl4mVJ+KUkdCpdEk5UuiR0KneonCShU3lTsUYp1ijFGiV+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf3weEuTKsbeUAAAAAElFTkSuQmCC';

//   // window.electronAPI.setTitle(title);
// });
// win.electronAPI.openQr('new-qrcode', (qrcode: any) => {
//   imagem.src = qrcode;
// });
// win.electronAPI.closeQr('clean-qrcode', (qrcode: any) => {
//   imagem.src = '';
// });
