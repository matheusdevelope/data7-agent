import { useEffect, useState } from 'react';
import Dialog, { DefaultDialog } from '../../components/modal_dialog';
import { Button, Center, Container, ContainerObj, Footer, Form, Header, Input, Label, Text } from './style';

function Config_Panel() {
  const [config, setConfig] = useState<IObjectConfig[]>([]);
  const [dialogState, setDialogState] = useState<IDialog>(DefaultDialog);

  async function GetLocalConfig() {
    try {
      const result = await window.ElectronAPI.GetLocalConfig();
      setConfig(result);
    } catch (error) {
      return setDialogState({
        ...dialogState,
        isOpen: true,
        message: 'Erro ao carregar configurações locais.\nError: ' + JSON.stringify(error),
        onClickOK: () =>
          setDialogState({
            ...dialogState,
          }),
      });
    }
  }
  async function SetLocalConfig() {
    try {
      const result = await window.ElectronAPI.SetLocalConfig(config);

      return setDialogState({
        ...dialogState,
        isOpen: true,
        message: 'Configurações atualizadas com sucesso!',
        onClickOK: () =>
          setDialogState({
            ...dialogState,
          }),
      });
    } catch (error) {
      return setDialogState({
        ...dialogState,
        isOpen: true,
        message: 'Erro ao salvar as novas configurações.\nError: ' + JSON.stringify(error),
        onClickOK: () =>
          setDialogState({
            ...dialogState,
          }),
      });
    }
  }
  function ChangeValue(index: number, value: string | number | boolean) {
    let newConfig = config;
    newConfig.splice(index, 1, {
      ...newConfig[index],
      value: value,
    });
    setConfig([...newConfig]);
  }

  useEffect(() => {
    GetLocalConfig();
  }, []);

  function RenderObjectConfig(obj: IObjectConfig, key: number) {
    return (
      <ContainerObj key={key}>
        <Label>{obj.label}:</Label>
        {obj.type === 'text' && (
          <Input
            type={obj.type}
            onChange={(e) => {
              ChangeValue(key, e.target.value);
            }}
            value={String(obj.value)}
          />
        )}
        {obj.type === 'number' && (
          <Input
            type={obj.type}
            onChange={(e) => {
              ChangeValue(key, e.target.value);
            }}
            value={Number(obj.value)}
          />
        )}
        {obj.type === 'checkbox' && (
          <Input
            type={obj.type}
            onChange={(e) => {
              ChangeValue(key, e.target.checked);
            }}
            checked={Boolean(obj.value)}
          />
        )}
      </ContainerObj>
    );
  }

  return (
    <Container>
      <Header>Configurações</Header>
      <Center>
        <Form>{config.sort((obj_a, obj_b) => obj_a.order - obj_b.order).map(RenderObjectConfig)}</Form>
      </Center>
      <Footer>
        <Button onClick={SetLocalConfig}>Salvar Alterações</Button>
      </Footer>
      <Dialog {...dialogState} />
    </Container>
  );
}

export default Config_Panel;
