import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  ModalProps
} from '@chakra-ui/react';

const ModalComponent = ({
  isOpen = false,
  onOpen = () => { },
  onClose = () => { },
  title,
  success,
  cancel,
  children,
  showCloseButton = false,
  ...rest
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnEsc={showCloseButton} {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {showCloseButton && (<ModalCloseButton />)}

        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          {showCloseButton && (
            <Button onClick={onClose} mr={3}>Fechar</Button>
          )}
          {success && (
            <Button
              isLoading={success.isSubmitting}
              onClick={success.callback}
              colorScheme={'green'}
            >
              {success.text}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;