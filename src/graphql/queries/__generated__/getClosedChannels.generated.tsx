import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetClosedChannelsQueryVariables = {
  auth: Types.AuthType;
};

export type GetClosedChannelsQuery = { __typename?: 'Query' } & {
  getClosedChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'closedChannelType' } & Pick<
          Types.ClosedChannelType,
          | 'capacity'
          | 'close_confirm_height'
          | 'close_transaction_id'
          | 'final_local_balance'
          | 'final_time_locked_balance'
          | 'id'
          | 'is_breach_close'
          | 'is_cooperative_close'
          | 'is_funding_cancel'
          | 'is_local_force_close'
          | 'is_remote_force_close'
          | 'partner_public_key'
          | 'transaction_id'
          | 'transaction_vout'
        > & {
            partner_node_info?: Types.Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                Types.PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export const GetClosedChannelsDocument = gql`
  query GetClosedChannels($auth: authType!) {
    getClosedChannels(auth: $auth) {
      capacity
      close_confirm_height
      close_transaction_id
      final_local_balance
      final_time_locked_balance
      id
      is_breach_close
      is_cooperative_close
      is_funding_cancel
      is_local_force_close
      is_remote_force_close
      partner_public_key
      transaction_id
      transaction_vout
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;

/**
 * __useGetClosedChannelsQuery__
 *
 * To run a query within a React component, call `useGetClosedChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClosedChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClosedChannelsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetClosedChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, baseOptions);
}
export function useGetClosedChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, baseOptions);
}
export type GetClosedChannelsQueryHookResult = ReturnType<
  typeof useGetClosedChannelsQuery
>;
export type GetClosedChannelsLazyQueryHookResult = ReturnType<
  typeof useGetClosedChannelsLazyQuery
>;
export type GetClosedChannelsQueryResult = ApolloReactCommon.QueryResult<
  GetClosedChannelsQuery,
  GetClosedChannelsQueryVariables
>;
