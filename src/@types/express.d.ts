// sobreescrever tipos de uma biblioteca importada na aplicação
declare namespace Express {
  // sobreescrevo a importação do request do Express, ele não vai substituir nada, ele vai anexar junto com o Request do express
  export interface Request {
    user: {
      id: string;
    };
  }
}
