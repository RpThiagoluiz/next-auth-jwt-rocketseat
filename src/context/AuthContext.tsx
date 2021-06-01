import { createContext, useContext, useEffect, useState } from "react";
import { recoverUserInformation, singInRequest } from "../services/auth";
import { setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/api";

type User = {
  name: string;
  email: string;
  avatar_url: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  //Promise porq ele é uma funcion Async
  singIn: (data: SingInData) => Promise<void>;
};

type SingInData = {
  email: string;
  password: string;
};

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }) => {
  //Salvar os dados do usuario em variaveis, porq sempre q o usuario entrar
  // E o token ja existir ele vai pegar as infos do usuario logado, e atualizar elas para sempre ter as informacoes mais atualizadas

  const [user, setUser] = useState<User | null>();
  //Eu posso simplismente passar se meu user esta autentificado passando se meu usuario existe ou nao
  //const isAuthenticated = false;

  const isAuthenticated = !!user;

  //desentruturar a data, em password e email fica mais facil pra quem ta lendo o codigo
  //Intender oq ta rolando

  //Assim que o component for exibido em tela, ele vai pegar se ele ja fez auth
  useEffect(() => {
    const { "nextauth-token": token } = parseCookies();
    //Msm coisa que
    // const cookies = parseCookie()
    // const token = cookies['nextauth-token']

    if (token) {
      //Se o token existir vou chamar o fetch q vai na rota do backend trazer as informacoes daquele usuario
      recoverUserInformation().then((response) => setUser(response.user));
    }
  }, []);

  const singIn = async ({ email, password }: SingInData) => {
    //Token e o user ele ta dentro da function
    //pra pegar as infos do user vc pode fazer assim tbm -< user:{name,email,avatar_url} >-
    const { token, user } = await singInRequest({
      email,
      password,
    });

    //vamos salvar o nosso tken, podemos utilizar o localStorage ou o cookies,
    //Ja no next temos uma camada de node - um backend.
    //Ele nao consegue enxergar o localStorage, o Server Side Rendering nao vai ter acesso ao browser, ao localStorage dele
    //Cookies - que sao estruturas de dados mais de boa para ser acessado tanto pelo servidor quando pelo front
    //o Document tbm so no browser, caso vc precisa tem altas bibliotecas que ajudam a pegar pelo back,
    //document.cookies
    //nookies - Biblioteca bem simples integrada com o next
    //o setCookie - recebe dois parametros, sendo o primeiro caso vc estaja utilizando o lado do backend do next | undefined+
    //Segundo parametro - nome do token
    //terceiro o token em si,
    //quarto o
    setCookie(undefined, "nextauth-token", token, {
      //maxAge -> tempo que ele vai demorar para ser destruido
      //experie tbm - faz a msm coisa
      maxAge: 60 * 60 * 1, //1 hora - ele é em segundos.
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setUser(user);
    Router.push("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, singIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
