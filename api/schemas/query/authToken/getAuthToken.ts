import { GraphQLString } from 'graphql';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { readCookie, refreshCookie } from 'api/helpers/fileHelpers';
import { ContextType } from 'api/types/apiTypes';
import { SSO_ACCOUNT } from 'src/context/AccountContext';
import { logger } from 'api/helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';

const { serverRuntimeConfig } = getConfig();
const { cookiePath } = serverRuntimeConfig;

export const getAuthToken = {
  type: GraphQLString,
  args: {
    cookie: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, secret, sso } = context;
    await requestLimiter(ip, 'getAuthToken');

    if (!sso.host || !sso.macaroon) {
      logger.warn('Host and macaroon are required for SSO');
      return null;
    }

    if (!params.cookie) {
      return null;
    }

    if (cookiePath === '') {
      logger.warn('SSO auth not available since no cookie path was provided');
      return null;
    }

    const cookieFile = readCookie(cookiePath);

    if (cookieFile === params.cookie) {
      refreshCookie(cookiePath);
      const token = jwt.sign({ user: SSO_ACCOUNT }, secret);
      return token;
    }

    return null;
  },
};
