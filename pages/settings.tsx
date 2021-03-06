import React from 'react';
import styled from 'styled-components';
import { SingleLine, SimpleButton } from '../src/components/generic/Styled';
import { InterfaceSettings } from '../src/views/settings/Interface';
import { textColor } from '../src/styles/Themes';
import { AccountSettings } from '../src/views/settings/Account';
import { DangerView } from '../src/views/settings/Danger';
import { CurrentSettings } from '../src/views/settings/Current';
import { SyncSettings } from '../src/views/settings/Sync';
import { ChatSettings } from '../src/views/settings/Chat';
import { PrivacySettings } from '../src/views/settings/Privacy';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

export const SettingsLine = styled(SingleLine)`
  margin: 8px 0;
`;

export const SettingsButton = styled(SimpleButton)`
  padding: 8px;

  &:hover {
    border: 1px solid ${textColor};
  }
`;

const SettingsView = () => {
  return (
    <>
      <InterfaceSettings />
      <PrivacySettings />
      <ChatSettings />
      <SyncSettings />
      <CurrentSettings />
      <AccountSettings />
      <DangerView />
    </>
  );
};

export default SettingsView;
