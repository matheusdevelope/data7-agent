import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { CancelIcon, RefreshIcon, WhatsIcon } from '../../svg';
import DoneAnimation from '../../svg/animations/done.json';
import LoadingAnimation from '../../svg/animations/loading.json';
import CancelAnimation from '../../svg/animations/canceled.json';
import ErrorAnimation from '../../svg/animations/error.json';
import {
  AreaQrCode,
  Button,
  ButtonHeader,
  Column,
  Container,
  Footer,
  Header,
  ImgQrCode,
  Input,
  LineInput,
} from './style';
const temp_img = ''; //  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQa7jSAwFwXyE7n/lHC+5KkCQ7OlPMCJ+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CWVJ5LQqZwk4ZdUnijWKMUapVijXLxM5U1JuCMJnUqn8oTKm5LwpmKNUqxRijXKxZcl4Q6VO5JwkoQTlSeScIfKNxVrlGKNUqxRLoZT6ZLQJaFT+cuKNUqxRinWKMUapVijFGuUYo1y8WUqv6TSJaFT6ZLwhMq/pFijFGuUYo1y8bIkTJaEf1mxRinWKMUaJX7whyXhTSp/WbFGKdYoxRrl4qEkdCpdEt6k0qmcJKFT6ZJwkoQ3qXxTsUYp1ijFGuXiIZUTlS4JncodSehUuiS8SaVLQqfSJeGOJHQqTxRrlGKNUqxR4gcvSkKn0iXhRKVLQqfSJeEJlS4JncpJEp5QeVOxRinWKMUaJX7woiScqDyRhE7lJAmdyhNJeELlm4o1SrFGKdYo8YMHktCpdEn4JZWTJHQqXRI6lZMknKh0SehU3lSsUYo1SrFGiR/8YUk4UemS8CaVkyTcofJEsUYp1ijFGuXioST8kkqn0iWhS0Kn0iWhU+mScEcSOpUuCZ3Km4o1SrFGKdYoFy9TeVMSTpJwotIl4SQJJyp3JKFT6ZLQqTxRrFGKNUqxRrn4siTcofJNKl0SOpWTJHQqJypdEjqVNxVrlGKNUqxRLoZR+SaVLgknSehUvqlYoxRrlGKNcjFMEjqVLgmdSpeETqVLQqdykoRfKtYoxRqlWKNcfJnKN6ncoXKicqJykoT/U7FGKdYoxRrl4mVJ+KUkdCpdEk5UuiR0KneonCShU3lTsUYp1ijFGiV+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf3weEuTKsbeUAAAAAElFTkSuQmCC';

const InitialPix: IDataQrCode = {
  id: '',
  img: temp_img,
  link: '',
  phone: '',
  awaiting_payment: true,
  confirmed_payment: false,
  canceled: false,
  message: 'Aguardando pagamento Pix...',
};
function RenderAreaQrCode(dataQrCode: IDataQrCode) {
  return (
    <AreaQrCode>
      {dataQrCode.awaiting_payment && (
        <Column>
          <ImgQrCode src={dataQrCode.img} />
          <p>{dataQrCode.message}</p>
          <Player src={LoadingAnimation} autoplay loop style={{ height: 60, margin: 0 }} />
        </Column>
      )}
      {dataQrCode.confirmed_payment && (
        <Column>
          <Player src={DoneAnimation} autoplay loop style={{ height: 300 }} />
          <p>{dataQrCode.message}</p>
        </Column>
      )}
      {dataQrCode.canceled && (
        <Column>
          <Player src={CancelAnimation} autoplay loop style={{ height: 300 }} />
          <p>{dataQrCode.message}</p>
        </Column>
      )}
      {dataQrCode.error && (
        <Column>
          <Player src={ErrorAnimation} autoplay loop style={{ height: 300 }} />
          <p>{dataQrCode.message}</p>
        </Column>
      )}
    </AreaQrCode>
  );
}
function maskPhone(valor: string) {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
  valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
  return valor;
}

export default function QrCode() {
  const [dataQrCode, setDataQrcode] = useState<IDataQrCode>(InitialPix);
  const [phone, setPhone] = useState(maskPhone(dataQrCode.phone || ''));
  function AddListennersInApp() {
    window.ElectronAPI?.RegisterEventOpenQr('new-qrcode', (qrcode: any) => {
      setDataQrcode({
        ...NewStatus('Aguardando recebimento Pix...'),
        img: qrcode,
        awaiting_payment: true,
      });
      window.ElectronAPI.OpenQr();
    });
    window.ElectronAPI?.RegisterEventCloseQr('clean-qrcode', () => {
      setDataQrcode({
        ...NewStatus('Pix recebido com sucesso!'),
        confirmed_payment: true,
      });
      CloseWindow(2000);
    });
  }
  function CloseWindow(time: number) {
    setTimeout(() => {
      window.ElectronAPI.CloseQr();
      setDataQrcode(InitialPix);
    }, time);
  }
  function NewStatus(message: string) {
    return {
      ...dataQrCode,
      message: message,
      awaiting_payment: false,
      confirmed_payment: false,
      canceled: false,
      error: undefined,
    };
  }
  async function CancelPix() {
    if (confirm('Tem certeza que deseja solicitar o cancelamento?')) {
      const result = await window.ElectronAPI.CancelQr(dataQrCode.id);
      if (result.canceled) {
        setDataQrcode({ ...NewStatus(result.message), canceled: result.canceled });
        CloseWindow(2000);
      }
    }
  }
  async function RefreshPix() {
    const result = await window.ElectronAPI.RefreshQr(dataQrCode.id);
    if (result.confirmed_payment) {
      setDataQrcode({ ...NewStatus('Pix recebido com sucesso!'), confirmed_payment: true });
      CloseWindow(2000);
      return;
    }
    if (result.canceled) {
      setDataQrcode({ ...NewStatus(result.message), canceled: true });
      CloseWindow(2000);
      return;
    }

    if (result.error) {
      setDataQrcode({ ...NewStatus(result.message), error: result.error });
      alert('Houve um erro ao processar a solicitação: ' + JSON.stringify(result.error, null, 2));
      return;
    }
    if (result.awaiting_payment) {
      setDataQrcode({ ...NewStatus(result.message), awaiting_payment: true });
      alert('Aguardando confirmação do recebimento do Pix. Aguarde.');
      return;
    }
  }
  function SendMessageToWhats() {
    window.ElectronAPI.SendWhats({
      message: `Olá, seque abaixo o link copia e cola do seu PIX, basta copiar e efetuar o pagamento no seu aplicativo preferido. 👇🏻\n\n${dataQrCode.link}`,
      phone: phone,
    });
  }
  useEffect(() => {
    AddListennersInApp();
  }, []);

  return (
    <Container className="App">
      <Header>
        <ButtonHeader onClick={RefreshPix}>
          <RefreshIcon />
        </ButtonHeader>

        <p> Se7e Sistemas - PIX </p>
        <ButtonHeader onClick={CancelPix}>
          <CancelIcon />
        </ButtonHeader>
      </Header>
      {RenderAreaQrCode(dataQrCode)}
      {dataQrCode.link && (
        <Footer>
          <LineInput>
            <WhatsIcon />
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(maskPhone(e.target.value));
              }}
              type="text"
              placeholder="Whatsapp"
            />
          </LineInput>
          <Button onClick={SendMessageToWhats}>Enviar Link</Button>
        </Footer>
      )}
    </Container>
  );
}

//     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQa7jSAwFwXyE7n/lHC+5KkCQ7OlPMCJ+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CWVJ5LQqZwk4ZdUnijWKMUapVijXLxM5U1JuCMJnUqn8oTKm5LwpmKNUqxRijXKxZcl4Q6VO5JwkoQTlSeScIfKNxVrlGKNUqxRLoZT6ZLQJaFT+cuKNUqxRinWKMUapVijFGuUYo1y8WUqv6TSJaFT6ZLwhMq/pFijFGuUYo1y8bIkTJaEf1mxRinWKMUaJX7whyXhTSp/WbFGKdYoxRrl4qEkdCpdEt6k0qmcJKFT6ZJwkoQ3qXxTsUYp1ijFGuXiIZUTlS4JncodSehUuiS8SaVLQqfSJeGOJHQqTxRrlGKNUqxR4gcvSkKn0iXhRKVLQqfSJeEJlS4JncpJEp5QeVOxRinWKMUaJX7woiScqDyRhE7lJAmdyhNJeELlm4o1SrFGKdYo8YMHktCpdEn4JZWTJHQqXRI6lZMknKh0SehU3lSsUYo1SrFGiR/8YUk4UemS8CaVkyTcofJEsUYp1ijFGuXioST8kkqn0iWhS0Kn0iWhU+mScEcSOpUuCZ3Km4o1SrFGKdYoFy9TeVMSTpJwotIl4SQJJyp3JKFT6ZLQqTxRrFGKNUqxRrn4siTcofJNKl0SOpWTJHQqJypdEjqVNxVrlGKNUqxRLoZR+SaVLgknSehUvqlYoxRrlGKNcjFMEjqVLgmdSpeETqVLQqdykoRfKtYoxRqlWKNcfJnKN6ncoXKicqJykoT/U7FGKdYoxRrl4mVJ+KUkdCpdEk5UuiR0KneonCShU3lTsUYp1ijFGiV+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf3weEuTKsbeUAAAAAElFTkSuQmCC';