import styled from '@emotion/styled';

export const Wrapper = styled('main')`
  display: flex;
  height: calc(100vh - (3.5rem + 3.5625rem));
`;

export const Gutter = styled('div')`
  width: 15px;
  background-image: url('/public/gutter.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: e-resize;
`;
