interface ExampleProps {
  content: string;
}

function Example({ content }: ExampleProps) {
  return (
    <div>
      <pre>{content}</pre>
    </div>
  );
}

export default Example;
