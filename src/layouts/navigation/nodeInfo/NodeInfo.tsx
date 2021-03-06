import React from 'react';
import { Zap, Anchor, Circle } from 'react-feather';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { getPrice } from 'src/components/price/Price';
import { AnimatedNumber } from 'src/components/animated/AnimatedNumber';
import { useAccountState } from 'src/context/AccountContext';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { textColorMap, unSelectedNavButton } from '../../../styles/Themes';
import { getErrorContent } from '../../../utils/error';
import { getTooltipType } from '../../../components/generic/helpers';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import { useStatusState } from '../../../context/StatusContext';
import { usePriceState } from '../../../context/PriceContext';

const Closed = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Margin = styled.div`
  margin: 8px 0 2px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  font-size: 14px;
  color: #bfbfbf;
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

const Balance = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 0;
  padding: 0 5px;
  cursor: default;
`;

const Alias = styled.div`
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

interface NodeInfoProps {
  isOpen?: boolean;
  isBurger?: boolean;
}

export const NodeInfo = ({ isOpen, isBurger }: NodeInfoProps) => {
  const {
    syncedToChain,
    chainBalance,
    chainPending,
    channelBalance,
    channelPending,
  } = useStatusState();

  const { auth } = useAccountState();

  const { loading, data } = useGetNodeInfoQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const tooltipType: any = getTooltipType(theme);

  if (loading || !data || !data.getNodeInfo) {
    return (
      <Closed>
        <ScaleLoader height={10} width={2} color={textColorMap[theme]} />
      </Closed>
    );
  }

  const {
    color,
    active_channels_count,
    closed_channels_count,
    alias,
    peers_count,
    pending_channels_count,
    version,
  } = data.getNodeInfo;

  const formatCB = format({ amount: chainBalance });
  const formatPB = format({ amount: chainPending });
  const formatCCB = format({ amount: channelBalance });
  const formatPCB = format({ amount: channelPending });

  if (isBurger) {
    return (
      <>
        <SingleLine>
          <SubTitle>{alias}</SubTitle>
          <Circle
            size={18}
            strokeWidth={'0'}
            fill={syncedToChain ? '#95de64' : '#ff7875'}
          />
        </SingleLine>
        <SingleLine>
          <Sub4Title>Channels</Sub4Title>
          {`${active_channels_count} / ${pending_channels_count} / ${closed_channels_count} / ${peers_count}`}
        </SingleLine>
        <SingleLine>
          <Zap
            color={channelPending === 0 ? '#FFD300' : '#652EC7'}
            fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
          />
          {channelPending > 0 ? (
            `${formatCCB} / ${formatPCB}`
          ) : (
            <AnimatedNumber amount={channelBalance} />
          )}
        </SingleLine>
        <SingleLine>
          <Anchor
            size={18}
            color={chainPending === 0 ? '#FFD300' : '#652EC7'}
          />
          {chainPending > 0 ? (
            `${formatCB} / ${formatPB}`
          ) : (
            <AnimatedNumber amount={chainBalance} />
          )}
        </SingleLine>
      </>
    );
  }

  if (!isOpen) {
    return (
      <>
        <Closed>
          <div data-tip data-for="full_balance_tip">
            <Circle
              size={18}
              strokeWidth={'0'}
              fill={syncedToChain ? '#95de64' : '#ff7875'}
            />
            {(channelPending > 0 || chainPending > 0) && (
              <div>
                <Circle size={18} fill={'#652EC7'} strokeWidth={'0'} />
              </div>
            )}
            <Margin>
              <Zap
                size={18}
                fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
                color={channelPending === 0 ? '#FFD300' : '#652EC7'}
              />
            </Margin>
            <Anchor
              size={18}
              color={chainPending === 0 ? '#FFD300' : '#652EC7'}
            />
          </div>
          <div data-tip data-for="full_node_tip">
            <SingleLine>{active_channels_count}</SingleLine>
            <SingleLine>{pending_channels_count}</SingleLine>
            <SingleLine>{closed_channels_count}</SingleLine>
            <SingleLine>{peers_count}</SingleLine>
          </div>
        </Closed>
        <Separation lineColor={unSelectedNavButton} />
        <ReactTooltip
          id={'full_balance_tip'}
          effect={'solid'}
          place={'right'}
          type={tooltipType}
        >
          <div>{`Channel Balance: ${formatCCB}`}</div>
          <div>{`Pending Channel Balance: ${formatPCB}`}</div>
          <div>{`Chain Balance: ${formatCB}`}</div>
          <div>{`Pending Chain Balance: ${formatPB}`}</div>
        </ReactTooltip>
        <ReactTooltip
          id={'full_node_tip'}
          effect={'solid'}
          place={'right'}
          type={tooltipType}
        >
          <div>{`Active Channels: ${active_channels_count}`}</div>
          <div>{`Pending Channels: ${pending_channels_count}`}</div>
          <div>{`Closed Channels: ${closed_channels_count}`}</div>
          <div>{`Peers: ${peers_count}`}</div>
        </ReactTooltip>
      </>
    );
  }

  return (
    <>
      <Title>
        <Alias
          bottomColor={color}
          data-tip={`Version: ${version.split(' ')[0]}`}
        >
          {alias}
        </Alias>
      </Title>
      <Separation lineColor={unSelectedNavButton} />
      <Balance data-tip data-for="balance_tip">
        <Zap size={18} color={channelPending === 0 ? '#FFD300' : '#652EC7'} />
        <AnimatedNumber amount={channelBalance} />
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <Anchor size={18} color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
        <AnimatedNumber amount={chainBalance} />
      </Balance>
      <Balance
        data-tip
        data-for="node_tip"
      >{`${active_channels_count} / ${pending_channels_count} / ${closed_channels_count} / ${peers_count}`}</Balance>
      <Balance>
        <Info bottomColor={syncedToChain ? '#95de64' : '#ff7875'}>
          {syncedToChain ? 'Synced' : 'Not Synced'}
        </Info>
      </Balance>
      <Separation lineColor={unSelectedNavButton} />
      <ReactTooltip effect={'solid'} place={'right'} type={tooltipType} />
      <ReactTooltip
        id={'balance_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Channel Balance: ${formatCCB}`}</div>
        <div>{`Pending Channel Balance: ${formatPCB}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={'chain_balance_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Chain Balance: ${formatCB}`}</div>
        <div>{`Pending Chain Balance: ${formatPB}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={'node_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Active Channels: ${active_channels_count}`}</div>
        <div>{`Pending Channels: ${pending_channels_count}`}</div>
        <div>{`Closed Channels: ${closed_channels_count}`}</div>
        <div>{`Peers: ${peers_count}`}</div>
      </ReactTooltip>
    </>
  );
};
