import { Button } from '@mui/material';
import React from 'react'

export const Logout = () => {
 const button={marginRight:'20px', fontSize:'1.2rem', fontWeight:'700', padding:'0.3rem 1.4rem'}
  return (
    <Button style={button}variant='contained'>Logout</Button>
  )
}
export default Logout;