import { v4 as uuid } from "uuid";
// que aq ele pegou o nome e deu um rename para o metodo ou variavel q ele pegou dentro do uui

type SingInRequestData = {
  email: string;
  password: string;
};

//Delay como se fosse uma chamada ao backend -750MS
const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export const singInRequest = async (data: SingInRequestData) => {
  await delay();

  return {
    token: uuid(),
    user: {
      name: "Thiago Luiz",
      email: "thiago@dev.com",
      avatar_url: "https://github.com/RpThiagoluiz.png",
    },
  };
};

//Aqui no backend Vou ter q ter uma rota que vai receber um token,
//e emitir os dados daquele usuario que criou o token

export const recoverUserInformation = async () => {
  await delay();
  return {
    //Imitar que estivesse voltando os dados do usuario passeado no cookies
    user: {
      name: "Thiago Luiz",
      email: "thiago@dev.com",
      avatar_url: "https://github.com/RpThiagoluiz.png",
    },
  };
};
