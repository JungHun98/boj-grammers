import styled from '@emotion/styled';

export const Wrapper = styled('div')`
  border: 1px solid #414547;
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  background-color: #182025;
  overflow-y: auto;
  & h3 {
    color: #e2e2e2;
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

export const ErrorPre = styled('pre')`
  margin: 0;
  padding: 0;
  color: red;
  font-size: 14px;
  font-weight: 600;
  line-height: 130%;
  background-color: transparent;
`;
