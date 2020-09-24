import React from 'react';
import ModalWrapper from '../../app/common/modals/ModalWrapper';

export default function TestModal({data}) {
    return (
        <ModalWrapper size='mini' header='Test Modal'>
            <div>The data is: {data}</div> 
        </ModalWrapper> //the div is the children of the ModalWrapper.jsx
    )
}