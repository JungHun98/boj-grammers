import styled from '@emotion/styled';

export const ProblemNumberInput = styled('input')`
  padding: 0px 1.5rem 0px 1.0625rem;
  width: 15rem;
  height: 1.7rem;
  background-color: #151f29;
  border: 0.05rem solid #d5d5d5;
  border-radius: 0.25rem;
  appearance: none;
  color: white;
  caret-color: white;

  &:hover,
  &:focus-within {
    outline: none;
    border: 0.05rem solid rgb(0, 120, 255);
    box-shadow: rgb(0, 120, 255) 0px 0;
  }
`;

export const ProblemSearchButton = styled('button')`
  position: absolute;
  right: 0;
  top: 2px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  cursor: pointer;
`;

export const Wrapper = styled('div')`
  position: relative;
`;
