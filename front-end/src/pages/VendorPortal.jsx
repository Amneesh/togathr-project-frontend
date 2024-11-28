import React, { useState } from 'react';
import MainHeaderVendor from '../components/MainHeaderVendor';
import MainContentVendor from '../components/MainContentVendor'
import UserProfileVendor from '../components/UserProfileVendor';

const VendorPortal = () => {
  const [showComponent, setShowComponent] = useState('vendor-form');
  
  const handleActiveItem = (data) => {
    setShowComponent(data);
    console.log(data, 'a');
  }

  return (
    <div>
      <MainHeaderVendor setComponentActive={handleActiveItem} />
      {
        showComponent == 'vendor-form' ?
          <MainContentVendor />
          :
          showComponent == 'user-profile' ?
          <UserProfileVendor />
          : <></>

      }


      
    </div>
  )
}

export default VendorPortal