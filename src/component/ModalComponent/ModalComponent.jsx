import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({ tittle = 'Modal', isOpen = false, children, ...rests }) => {
    return (
        <Modal title={tittle} open={isOpen} {...rests}>
            {children}
        </Modal>
    )
}

export default ModalComponent