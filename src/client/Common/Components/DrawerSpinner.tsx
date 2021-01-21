import * as React from 'react';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { classNames } from '@shopify/react-utilities';

import {
  FlexBox,
} from 'engage-ui';

import { ESPINNER } from '../../ThemeIdentifiers';

const baseTheme = require('../Styles/ESpinner.scss');

const ESpinner = require('../Static/eSpinner.svg');
const EspinnerOrbit = require('../Static/eSpinner-orbit.svg');

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

const DrawerSpinner: React.FC<IProps> = ({ componentClass = '', componentStyle = {}, spinnerText, theme }): React.ReactElement => {

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
};

export default themr(ESPINNER, baseTheme)(DrawerSpinner) as ThemedComponentClass<IProps, {}>;
