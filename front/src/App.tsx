import './Main.css';
import Problem from './routes/problem';
import Modal from '@/components/common/Modal/Modal';
import { useState } from 'react';
import TestCaseModal from '@/components/TestCaseModal';
import AdditionalTestCaseModal from '@/components/AdditionalTestCaseModal';
import AdditionalModal from '@/components/common/AdditionalModal/AdditionalModal';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdditionalOpen, setAdditionalOpen] = useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleAdditionalModalClose = () => {
    setAdditionalOpen(false);
  };

  const handleAdditionalModalOpen = () => {
    setAdditionalOpen(true);
  };

  return (
    <>
      <Problem onOpen={handleModalOpen} />
      <Modal open={isOpen} onClose={handleModalClose}>
        <TestCaseModal
          onClose={handleModalClose}
          onOpen={handleAdditionalModalOpen}
        />
      </Modal>
      <AdditionalModal
        open={isAdditionalOpen}
        onClose={handleAdditionalModalClose}
      >
        <AdditionalTestCaseModal onClose={handleAdditionalModalClose} />
      </AdditionalModal>
    </>
  );
}

export default App;
