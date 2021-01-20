import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { assert, expect } from 'chai';

describe('Array', () => {
    describe('#indexOf()', () => {
      it('should return -1 when the value is not present', () => {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
});
