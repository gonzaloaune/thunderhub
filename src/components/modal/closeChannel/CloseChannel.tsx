import React, { useState } from 'react';
import { AlertTriangle } from 'react-feather';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useCloseChannelMutation } from 'src/graphql/mutations/__generated__/closeChannel.generated';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { SecureButton } from '../../buttons/secureButton/SecureButton';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../buttons/multiButton/MultiButton';
import { Input } from '../../input/Input';
import { useBitcoinState } from '../../../context/BitcoinContext';

interface CloseChannelProps {
  setModalOpen: (status: boolean) => void;
  channelId: string;
  channelName: string;
}

const WarningCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CenterLine = styled(SingleLine)`
  justify-content: center;
`;

export const CloseChannel = ({
  setModalOpen,
  channelId,
  channelName,
}: CloseChannelProps) => {
  const { fast, halfHour, hour, dontShow } = useBitcoinState();

  const [isForce, setIsForce] = useState<boolean>(false);
  const [isType, setIsType] = useState<string>(dontShow ? 'fee' : 'none');
  const [amount, setAmount] = useState<number>(0);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [closeChannel] = useCloseChannelMutation({
    onCompleted: data => {
      if (data.closeChannel) {
        toast.success('Channel Closed');
      }
    },
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: [
      'GetChannels',
      'GetPendingChannels',
      'GetClosedChannels',
      'GetChannelAmountInfo',
    ],
  });

  const handleOnlyClose = () => setModalOpen(false);

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const renderWarning = () => (
    <WarningCard>
      <AlertTriangle size={32} color={'red'} />
      <SubTitle>Are you sure you want to close the channel?</SubTitle>
      <SecureButton
        callback={closeChannel}
        variables={{
          id: channelId,
          forceClose: isForce,
          ...(isType !== 'none'
            ? isType === 'fee'
              ? { tokens: amount }
              : { target: amount }
            : {}),
        }}
        color={'red'}
        disabled={false}
        withMargin={'4px'}
      >
        {`Close Channel [ ${channelName}/${channelId} ]`}
      </SecureButton>
      <ColorButton withMargin={'4px'} onClick={handleOnlyClose}>
        Cancel
      </ColorButton>
    </WarningCard>
  );

  const renderContent = () => (
    <>
      <SingleLine>
        <SubTitle>{'Close Channel'}</SubTitle>
        <Sub4Title>{`${channelName} [${channelId}]`}</Sub4Title>
      </SingleLine>
      <Separation />
      <SingleLine>
        <Sub4Title>Fee:</Sub4Title>
      </SingleLine>
      <MultiButton>
        {!dontShow &&
          renderButton(() => setIsType('none'), 'Auto', isType === 'none')}
        {renderButton(() => setIsType('fee'), 'Fee', isType === 'fee')}
        {renderButton(() => setIsType('target'), 'Target', isType === 'target')}
      </MultiButton>
      {isType === 'none' && (
        <>
          <SingleLine>
            <Sub4Title>Fee Amount:</Sub4Title>
          </SingleLine>
          <MultiButton>
            {renderButton(
              () => setAmount(fast),
              `Fastest (${fast} sats)`,
              amount === fast
            )}
            {halfHour !== fast &&
              renderButton(
                () => setAmount(halfHour),
                `Half Hour (${halfHour} sats)`,
                amount === halfHour
              )}
            {renderButton(
              () => setAmount(hour),
              `Hour (${hour} sats)`,
              amount === hour
            )}
          </MultiButton>
        </>
      )}
      {isType !== 'none' && (
        <>
          <SingleLine>
            <Sub4Title>
              {isType === 'target' ? 'Target Blocks:' : 'Fee (Sats/Byte)'}
            </Sub4Title>
          </SingleLine>
          <SingleLine>
            <Input
              placeholder={isType === 'target' ? 'Blocks' : 'Sats/Byte'}
              type={'number'}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </SingleLine>
        </>
      )}
      <SingleLine>
        <Sub4Title>Force Close Channel:</Sub4Title>
      </SingleLine>
      <MultiButton>
        {renderButton(() => setIsForce(true), 'Yes', isForce)}
        {renderButton(() => setIsForce(false), 'No', !isForce)}
      </MultiButton>
      <Separation />
      <CenterLine>
        <ColorButton
          withMargin={'4px'}
          withBorder={true}
          onClick={handleOnlyClose}
        >
          Cancel
        </ColorButton>
        <ColorButton
          arrow={true}
          withMargin={'4px'}
          withBorder={true}
          color={'red'}
          onClick={() => setIsConfirmed(true)}
        >
          Close Channel
        </ColorButton>
      </CenterLine>
    </>
  );

  return isConfirmed ? renderWarning() : renderContent();
};
