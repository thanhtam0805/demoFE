import { Drawer } from 'antd'
import React from 'react'

const DrawerComponent = ({ tittle = 'Drawer', placement = 'right', isOpen = 'false',children, ...rests }) => {
    return (
        <>
            <Drawer title={tittle} placement={placement} open={isOpen} {...rests}>
                {children}
            </Drawer>
        </>
    )
}

export default DrawerComponent