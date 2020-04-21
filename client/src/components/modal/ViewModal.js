import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export default ({ isOpen, toggle, title, children, onConfirm, viewOnly }) => (
    <Modal toggle={toggle} isOpen={isOpen} centered>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
            {onConfirm && !viewOnly && (
                <Button color="primary" onClick={onConfirm}>
                    Confirm
                </Button>
            )}
            <Button color="secondary" onClick={toggle}>
                Cancel
            </Button>
        </ModalFooter>
    </Modal>
);
