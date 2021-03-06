import { decodePaymentRequest } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { DecodeType } from '../../types/QueryType';

interface RouteProps {
  base_fee_mtokens: string;
  channel: string;
  cltv_delta: number;
  fee_rate: number;
  public_key: string;
}

interface DecodeProps {
  chain_address: string;
  cltv_delta: number;
  description: string;
  description_hash: string;
  destination: string;
  expires_at: string;
  id: string;
  routes: RouteProps[][];
  tokens: number;
}

export const decodeRequest = {
  type: DecodeType,
  args: {
    ...defaultParams,
    request: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'decode');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const decode: DecodeProps = await decodePaymentRequest({
        lnd,
        request: params.request,
      });

      return decode;
    } catch (error) {
      logger.error('Error paying request: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
