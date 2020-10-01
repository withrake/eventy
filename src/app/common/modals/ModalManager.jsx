import React from 'react';
import {useSelector} from 'react-redux';
import TestModal from '../../../features/sandbox/TestModal';
import LoginForm from '../../../features/auth/LoginForm';
import RegisterForm from '../../../features/auth/RegisterForm';

export default function ModalManager() {
    const modalLookup = {
        TestModal,
        LoginForm,
        RegisterForm
    };
    const currentModal = useSelector((state) => state.modals); //if we have a modal opened, it will be stored inside the currentModal
    let renderedModal;
    if (currentModal) { 
        const {modalType, modalProps} = currentModal; //if we have a currentModal we have access to modalType and modalProps
        const ModalComponent = modalLookup[modalType]; //then we create a new modal component, and set it to the type of modal we have opened
        renderedModal = <ModalComponent {...modalProps} /> //then we create a rendered Modal that we pass on to the modal component along with any properties
    } 

    return <span>{renderedModal}</span> //then we return it and display it
}