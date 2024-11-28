

import React, { useState, useEffect } from 'react';

const ModalPopupBox = ({
  buttonId = '',
  buttonLabel = '',
  buttonClassName='',
  // buttonOpenFunction = '',

  backgroundColorButton,
  modalHeaderTitle = '',
  modalHeaderDescription = '',

  modalBodyHeader = '',
  modalBodyContent = '',

  saveDataAndCloseName = '',
  saveDataAndCloseId = '',
  saveDataAndCloseFunction = '',

  saveDataAndOpenName = '',
  saveDataAndOpenId = '',
  saveDataAndOpenFunction = '',

  closeButtonName = '',
  closeButtonID = '',

  onModalClose = '',
  buttonAlign = '',

  closeModalAfterDataSend = ''
}) => {
  const [modalActive, setModalActive] = useState(null);


  const handleButtonClick = () => {

      setModalActive(true);
      // setModalClass(buttonId);
  
    // buttonOpenFunction();

  };

;

  const handleModalClickOpen = () => {
    if (closeModalAfterDataSend == 'true') {
      setModalActive(null);
      console.log("cllose");
    } else {
      console.log("open");
      setModalActive(true);
    }
    saveDataAndOpenFunction();
    onModalClose();

  }

  const handleModalClickClose = () => {

    saveDataAndCloseFunction();
    // setAnimateClass('fourClose');
    // setModalClass('fourClose');
    setModalActive(null);

    onModalClose();
  };

  // className="modal-button"

  return (
    <div className='custom-modal-maker'>
      <button className={`${buttonClassName} modal-button`} id={buttonId} style={{ backgroundColor: { backgroundColorButton } }} onClick={handleButtonClick}>{buttonLabel}</button>
      <div id="modal-container"
        // className={modalActive ? 'four' : (isModalClosed ? 'fourClose': ``)} >
        className={`${modalActive == true ? ('four') : modalActive == false ? ( 'fourClose') :modalActive == null ? ('') : '' }`} >
             
        <div className="modal-background">
          <div className="modal-togather">

            <div className="modal-header">
              <div className="modal-header-title">
                <h4>{modalHeaderTitle}</h4>
                <i className="fa-solid fa-xmark close" onClick={() => { setModalActive(null); }}></i>

              </div>
              <div className='modal-header-description'><h5>{modalHeaderDescription}</h5></div>
            </div>

            <hr />

            <div className="modal-body">
              <h5 className='modal-body-header'>{modalBodyHeader}</h5>
              <>{modalBodyContent}</>
            </div>

            <hr />

            <div className="modal-footer" style={{ flexFlow: `${buttonAlign}` }}>
              {saveDataAndOpenId != '' ? <button className='modal-submit-button-open' id={saveDataAndOpenId} onClick={handleModalClickOpen}>{saveDataAndOpenName}</button> : <></>}

              {saveDataAndCloseId != '' ? <button className='modal-submit-button-close' id={saveDataAndCloseId} onClick={handleModalClickClose}>{saveDataAndCloseName}</button> : <></>}

              {closeButtonID != '' ? <button className='modal-close-button' id={closeButtonID} onClick={() => { setModalActive(null); }}>{closeButtonName}</button> : <></>}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPopupBox;