import * as React from 'react';
import { Modal, ModalBody, ModalHeader, FlexBox, Column, Icon, Label, ModalContent, ModalFooter, Button } from 'engage-ui';

export interface IProps {
    showModal: boolean;
    onCancel: () => void;
    onOkay: (action?: boolean) => void;
    titleText: string;
    content: HTMLElement | React.ReactNode;
}
export const AlertDialog: React.FC<IProps> = ({ showModal, onCancel, onOkay, content, titleText }): React.ReactElement => {
    return (
        <Modal active={showModal} componentWidth="small" closeOnBackgroud={true} closeOnEsc={true} toggle={onCancel}>
            <ModalBody>
                <ModalHeader>
                    <FlexBox direction="Row" justify="Start">
                        <Column small="1-2">
                            <Icon source="alert" componentColor="red" />
                        </Column>
                        <Column large="2-6"><Label>{titleText}</Label></Column>
                    </FlexBox>
                </ModalHeader>
                <ModalContent active={showModal}>
                    {content}
                </ModalContent>
                <ModalFooter>
                    <FlexBox direction="Row" justify="SpaceBetween">
                        <Button componentSize="slim" onClick={onCancel}>Cancel</Button>
                        <Button componentSize="slim" onClick={() => onOkay(true)}>Delete</Button>
                    </FlexBox>
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
};
