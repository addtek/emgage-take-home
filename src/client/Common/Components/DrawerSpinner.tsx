import * as React from 'react';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { classNames } from '@shopify/react-utilities';

import {
  FlexBox,
} from 'engage-ui';

import { ESPINNER } from '../../ThemeIdentifiers';

import baseTheme from '../Styles/ESpinner.scss';

import ESpinner from '../Static/eSpinner.svg';
import EspinnerOrbit from '../Static/eSpinner-orbit.svg';

/*
  Component to show spinner in full page
*/

export interface IProps {
  componentClass?: string;
  componentStyle?: any;
  theme?: any;
  // Show any text after spinner
  spinnerText?: string;
}

class DrawerSpinner extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { componentClass = '', componentStyle = {}, spinnerText, theme } = this.props;
    const spinnerClass = classNames(
      componentClass,
      theme.eSpinnerContainer,
    );

    return (
      <div className={spinnerClass} style={componentStyle}>
        <FlexBox direction="Column">
          <ESpinner />
          <EspinnerOrbit className={theme.eSpinner} />
          {
            spinnerText ? <small className={theme.spinnerText}>{spinnerText}</small> : ''}
        </FlexBox>
      </div>
    );
  }
}

export default themr(ESPINNER, baseTheme)(DrawerSpinner) as ThemedComponentClass<IProps, {}>;
