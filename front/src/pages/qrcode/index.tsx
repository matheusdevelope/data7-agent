import { useEffect, useRef, useState } from 'react';
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
  Form,
  Header,
  ImgQrCode,
  Input,
  LineInput,
} from './style';
import Dialog from '../../components/modal_dialog';

const InitialPix: IDataQrCode = {
  action: '',
  id: '',
  img: '',
  link: '',
  phone: '',
  awaiting_payment: true,
  confirmed_payment: false,
  canceled: false,
  message: 'Aguardando Ação',
};
const DefaultDialog: IDialog = {
  isOpen: false,
  title: 'Atenção',
  message: '',
  onClickOK: () => null,
  onClickCancel: undefined,
};
function RenderAreaQrCode(dataQrCode: IDataQrCode) {
  function Awaiting() {
    return (
      <Column>
        <ImgQrCode src={dataQrCode.img} />
        <p>{dataQrCode.message}</p>
        <Player src={LoadingAnimation} autoplay loop style={{ height: 60, margin: 0 }} />
      </Column>
    );
  }
  function Confirmed() {
    return (
      <Column>
        <Player src={DoneAnimation} autoplay loop style={{ height: 300 }} />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }
  function Canceled() {
    return (
      <Column>
        <Player src={CancelAnimation} autoplay loop style={{ height: 300 }} />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }
  function Error() {
    return (
      <Column>
        <Player src={ErrorAnimation} autoplay loop style={{ height: 300 }} />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }

  function SelectAnimation() {
    if (!dataQrCode.id || (!dataQrCode.img && dataQrCode.action !== 'close') || !dataQrCode.action) return Error();
    if (dataQrCode.confirmed_payment) return Confirmed();
    if (dataQrCode.canceled) return Canceled();
    if (dataQrCode.error) return Error();
    return Awaiting();
  }

  return <AreaQrCode>{SelectAnimation()}</AreaQrCode>;
}
function maskPhone(valor: string) {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
  valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
  return valor;
}
function MessageBasedInStatus(qrcode: IDataQrCode) {
  if (!qrcode.action) return 'A Ação não foi infomarda, verifique!';
  if (!qrcode.id) return 'O ID do PIX não foi infomardo, verifique!';
  if (!qrcode.img && qrcode.action !== 'close') return 'O QrCode não foi infomardo, verifique!';
  if (qrcode.message) return qrcode.message;
  if (qrcode.confirmed_payment) return 'Pix recebido com sucesso!';
  if (qrcode.canceled) return 'O pagamento por PIX foi cancelado.';
  if (qrcode.error) return 'Houve um erro ao processar a solicitação.';
  if (qrcode.awaiting_payment) return 'Aguardando recebimento Pix...';
  return 'Status não informado';
}
export default function QrCode() {
  const [dataQrCode, setDataQrcode] = useState<IDataQrCode>(InitialPix);
  const [phone, setPhone] = useState(maskPhone(dataQrCode.phone || ''));
  const [dialog, setDialog] = useState<IDialog>(DefaultDialog);
  const phoneRef = useRef<HTMLInputElement>(null);
  function AddListennersInApp() {
    window.ElectronAPI?.RegisterEventUpdateQr('update-qrcode', (qrcode: IDataQrCode) => {
      setDataQrcode({
        ...qrcode,
        message: MessageBasedInStatus(qrcode),
      });
      setPhone(maskPhone(qrcode.phone || ''));
      if (qrcode.action === 'close') return CloseWindow(2000);
      return window.ElectronAPI.OpenQr();
    });
  }

  function CloseWindow(time: number) {
    setTimeout(() => {
      window.ElectronAPI.CloseQr();
      setDataQrcode(InitialPix);
      setPhone(dataQrCode.phone);
      setDialog({ ...DefaultDialog });
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

  function CancelPix() {
    setDialog({
      ...dialog,
      isOpen: true,
      message: 'Tem certeza que deseja solicitar o cancelamento?',
      onClickOK: () => {
        setDialog({ ...DefaultDialog });
        CallCancel();
      },
      onClickCancel: () => {
        setDialog({ ...DefaultDialog });
        phoneRef.current?.focus();
      },
      textbuttonOK: 'Sim',
    });

    async function CallCancel() {
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
      AlertDialog('Houve um erro ao processar a solicitação: ' + JSON.stringify(result.error, null, 2));
      return;
    }
    if (result.awaiting_payment) {
      setDataQrcode({ ...NewStatus(result.message), awaiting_payment: true });
      AlertDialog('Aguardando confirmação do recebimento do Pix.');
      return;
    }
  }

  function SendMessageToWhats(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phone.length < 15) {
      AlertDialog('Telefone Inválido, verifique!');
      return;
    }
    window.ElectronAPI.SendWhats({
      message: `Olá, seque abaixo o link copia e cola do seu PIX, basta copiar e efetuar o pagamento no seu aplicativo preferido. 👇🏻\n\n${dataQrCode.link}`,
      phone: phone,
    });
  }

  function AlertDialog(message: string, callback?: Function) {
    setDialog({
      ...dialog,
      isOpen: true,
      message: message,
      onClickOK: () => {
        setDialog({ ...DefaultDialog });
        callback && callback();
        phoneRef.current?.focus();
      },
    });
  }

  useEffect(() => {
    AddListennersInApp();
  }, []);

  useEffect(() => {
    phoneRef.current?.focus();
  }, [dataQrCode.img]);

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
          <Form onSubmit={SendMessageToWhats}>
            <LineInput>
              <WhatsIcon />
              <Input
                ref={phoneRef}
                value={phone}
                onChange={(e) => {
                  setPhone(maskPhone(e.target.value));
                }}
                type="text"
                placeholder="Whatsapp"
              />
            </LineInput>
            <Button type="submit">Enviar Link</Button>
          </Form>
        </Footer>
      )}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onClickOK={dialog.onClickOK}
        onClickCancel={dialog.onClickCancel}
        textbuttonOK={dialog.textbuttonOK}
        textbuttonCancel={dialog.textbuttonCancel}
      />
    </Container>
  );
}

//     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQa7jSAwFwXyE7n/lHC+5KkCQ7OlPMCJ+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CWVJ5LQqZwk4ZdUnijWKMUapVijXLxM5U1JuCMJnUqn8oTKm5LwpmKNUqxRijXKxZcl4Q6VO5JwkoQTlSeScIfKNxVrlGKNUqxRLoZT6ZLQJaFT+cuKNUqxRinWKMUapVijFGuUYo1y8WUqv6TSJaFT6ZLwhMq/pFijFGuUYo1y8bIkTJaEf1mxRinWKMUaJX7whyXhTSp/WbFGKdYoxRrl4qEkdCpdEt6k0qmcJKFT6ZJwkoQ3qXxTsUYp1ijFGuXiIZUTlS4JncodSehUuiS8SaVLQqfSJeGOJHQqTxRrlGKNUqxR4gcvSkKn0iXhRKVLQqfSJeEJlS4JncpJEp5QeVOxRinWKMUaJX7woiScqDyRhE7lJAmdyhNJeELlm4o1SrFGKdYo8YMHktCpdEn4JZWTJHQqXRI6lZMknKh0SehU3lSsUYo1SrFGiR/8YUk4UemS8CaVkyTcofJEsUYp1ijFGuXioST8kkqn0iWhS0Kn0iWhU+mScEcSOpUuCZ3Km4o1SrFGKdYoFy9TeVMSTpJwotIl4SQJJyp3JKFT6ZLQqTxRrFGKNUqxRrn4siTcofJNKl0SOpWTJHQqJypdEjqVNxVrlGKNUqxRLoZR+SaVLgknSehUvqlYoxRrlGKNcjFMEjqVLgmdSpeETqVLQqdykoRfKtYoxRqlWKNcfJnKN6ncoXKicqJykoT/U7FGKdYoxRrl4mVJ+KUkdCpdEk5UuiR0KneonCShU3lTsUYp1ijFGiV+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf3weEuTKsbeUAAAAAElFTkSuQmCC';
