// Configuração para envio de email em produção com Amazon SES.
// Não será enviado o email, porque precisa de dominio e email próprio

interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      emailTest: string;
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      emailTest: 'lsguarilha01@gamil.com',
      email: 'leonardo@meudominioqueeunaotenho.com.br', // Coloco o meu email configurado no amazon SES
      name: 'Leonardo',
    },
  },
} as IMailConfig;
