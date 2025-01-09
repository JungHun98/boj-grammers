import styled from '@emotion/styled';

export const Wrapper = styled('div')`
  border-bottom: 1px solid #414547;
  display: flex;
  align-items: center;
  justify-content: right;
  box-sizing: border-box;
  & select {
    cursor: pointer;
    font-size: 15px;
    background-color: #474b4d;
    border-radius: 6px;
    color: #fff;
    border: 0;
    font-family: 'Pretendard-Regular';
    padding: 8px 15px;
    outline: none;
  }
`;
