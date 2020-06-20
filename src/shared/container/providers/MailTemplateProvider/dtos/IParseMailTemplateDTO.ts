interface ITemplateVariables {
  // Posso passar um objeto onde, a chave seja uma string e o valor uma string ou um numero
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

// variables: { name: 'Leonardo', link: 'http...' }
