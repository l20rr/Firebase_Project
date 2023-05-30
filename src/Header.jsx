import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

export default function Header() {
  const [showBasic, setShowBasic] = useState(false);

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Adm</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/home'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'></MDBNavbarLink>
            </MDBNavbarItem>

            

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/email'>
                Enviar Email
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          
          <MDBNavbarItem  className='d-flex input-group w-auto'>
          <MDBNavbarLink active aria-current='page' href='/login'>
                Sair
              </MDBNavbarLink>
            </MDBNavbarItem>
        
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}