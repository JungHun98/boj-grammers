import Loder from '../Loder';
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
          <th>실행 결과</th>
          {result === null ? (
            <td style={{ padding: 0 }}>
              <Loder />
            </td>
          ) : (
            <td style={{ whiteSpace: 'pre-line' }}>{result}</td>
          )}
        </tr>
      </tbody>
    </Table>
  );
}

export default ResultTable;
