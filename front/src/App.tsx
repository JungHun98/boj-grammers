import './Main.css';
import Problem from './routes/problem';
import Modal from './components/common/Modal/Modal';
import { useState } from 'react';
import TestCaseModal from './components/TestCaseModal';

function App() {
  const [isOpen, setIsOpen] = useState(true);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Problem />
      <Modal open={isOpen} onClose={handleModalClose}>
        <TestCaseModal onClose={handleModalClose} />
      </Modal>
    </>
  );
}

export default App;
