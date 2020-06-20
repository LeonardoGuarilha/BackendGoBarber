import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailProvider from './model/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

// Precisou ser feito dessa forma por causa do constructor da classe EtherialMailProvider
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver]
);
