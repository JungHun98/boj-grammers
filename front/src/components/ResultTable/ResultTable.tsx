import { Table } from './ResultTable.styles';

interface ResultTableProps {
  input: string;
  output: string;
  result: string | null;
}

function ResultTable({ input, output, result }: ResultTableProps) {
  return (
    <Table>
      <tbody>
        <tr>
          <th>입력값</th>
          <td style={{ whiteSpace: 'pre-line' }}>{input}</td>
        </tr>
        <tr>
          <th>기댓값</th>
          <td style={{ whiteSpace: 'pre-line' }}>{output}</td>
        </tr>
        <tr>
          <th>출력</th>
          <td style={{ whiteSpace: 'pre-line' }}>{result ?? '로딩중...'}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default ResultTable;
