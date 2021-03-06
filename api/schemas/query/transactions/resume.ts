import { GraphQLString } from 'graphql';
import { getPayments, getInvoices, getNode } from 'ln-service';
import { compareDesc } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { GetResumeType } from '../../types/QueryType';
import { PaymentsProps, InvoicesProps, NodeProps } from './resume.interface';

export const getResume = {
  type: GetResumeType,
  args: {
    ...defaultParams,
    token: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'payments');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    let payments;
    let invoices;

    try {
      const paymentList: PaymentsProps = await getPayments({
        lnd,
      });

      const getMappedPayments = () =>
        Promise.all(
          paymentList.payments.map(async payment => {
            let nodeInfo: NodeProps;
            try {
              nodeInfo = await getNode({
                lnd,
                is_omitting_channels: true,
                public_key: payment.destination,
              });
            } catch (error) {
              nodeInfo = { alias: payment.destination?.substring(0, 6) };
            }
            return {
              type: 'payment',
              alias: nodeInfo.alias,
              date: payment.created_at,
              ...payment,
            };
          })
        );
      payments = await getMappedPayments();
    } catch (error) {
      logger.error('Error getting payments: %o', error);
      throw new Error(getErrorMsg(error));
    }

    const invoiceProps = params.token ? { token: params.token } : { limit: 25 };

    let lastInvoiceDate = '';
    let firstInvoiceDate = '';
    let token = '';
    let withInvoices = true;

    try {
      const invoiceList: InvoicesProps = await getInvoices({
        lnd,
        ...invoiceProps,
      });

      invoices = invoiceList.invoices.map(invoice => {
        return {
          type: 'invoice',
          date: invoice.confirmed_at || invoice.created_at,
          ...invoice,
        };
      });

      if (invoices.length <= 0) {
        withInvoices = false;
      } else {
        const { date } = invoices[invoices.length - 1];
        firstInvoiceDate = invoices[0].date;
        lastInvoiceDate = date;
        token = invoiceList.next;
      }
    } catch (error) {
      logger.error('Error getting invoices: %o', error);
      throw new Error(getErrorMsg(error));
    }

    const filterArray = payment => {
      const last =
        compareDesc(new Date(lastInvoiceDate), new Date(payment.date)) === 1;
      const first = params.token
        ? compareDesc(new Date(payment.date), new Date(firstInvoiceDate)) === 1
        : true;
      return last && first;
    };

    const filteredPayments = withInvoices
      ? payments.filter(filterArray)
      : payments;

    const resumeArray = sortBy(
      [...invoices, ...filteredPayments],
      'date'
    ).reverse();

    return {
      token,
      resume: JSON.stringify(resumeArray),
    };
  },
};
