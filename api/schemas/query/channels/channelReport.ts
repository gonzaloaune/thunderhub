import { getChannels } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ChannelReportType } from '../../types/QueryType';

interface GetChannelsProps {
  channels: ChannelsProps[];
}

interface ChannelsProps {
  remote_balance: number;
  local_balance: number;
}

export const getChannelReport = {
  type: ChannelReportType,
  args: defaultParams,
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'channelReport');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const channels: GetChannelsProps = await getChannels({ lnd });

      if (channels.channels.length <= 0) {
        return;
      }

      const maxOutgoing = Math.max(
        ...channels.channels.map(o => {
          return o.local_balance;
        })
      );

      const maxIncoming = Math.max(
        ...channels.channels.map(o => {
          return o.remote_balance;
        })
      );

      const consolidated = channels.channels.reduce((p, c) => {
        return {
          remote_balance: p.remote_balance + c.remote_balance,
          local_balance: p.local_balance + c.local_balance,
        };
      });

      return {
        local: consolidated.local_balance,
        remote: consolidated.remote_balance,
        maxIn: maxIncoming,
        maxOut: maxOutgoing,
      };
    } catch (error) {
      logger.error('Error getting channel report: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
