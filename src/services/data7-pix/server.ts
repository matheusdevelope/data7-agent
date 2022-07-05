import Api from './aplication/api';
import App from './aplication/app';
const api = new Api();
const app = new App(api);
app.execute(() => console.log('Iniciando Aplicacao'));
