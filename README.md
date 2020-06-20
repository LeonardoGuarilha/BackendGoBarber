# Recuperação de senha

**RF (Requisitos funcionais)**

- O usuário deve poder recuperar sua senha informando o seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF (Requisitos não funcionais)**

- Utilizar Mailtrap para testar o envio em ambiente de dev;
- Utilizar Amazon SES(Simple email Service) para envios em produção;
- O envio de email deve acontecer em segundo plano (background job);

**RN Regra de negócio**

- O link enviado por email para resetar a senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário debe poder atualizar seu nome, email e senha;

**RN**

- O usuário não pode alterar o seu email para um email já utilizado;
- Para atualizar a sua senha, o usuário deve informar a senha antiga;
- Para atualizar a sua senha, o usuário deve confirmar a sua senha;

# Painel do prestador

**RF**

- O usuário deve poder listar os seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviços cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro horário às 8h, último horário às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar um serviço consigo mesmo;
