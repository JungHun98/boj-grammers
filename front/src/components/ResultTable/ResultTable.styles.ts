import styled from '@emotion/styled';

export const Table = styled('table')`
  width: 100%;
  margin-bottom: 12px;
  & tbody {
    width: 100%;
    background-color: #232a2f;
    margin-bottom: 15px;
    font-size: 14px;
    border: 1px solid #414547;
    box-sizing: border-box;
    & th {
      width: 15%;
      color: #8d8d8d;
      text-align: left;
      padding: 5px 10px;
    }
    & td {
      width: 80%;
      color: #e2e2e2;
      padding: 5px 10px;
    }
  }
`;
