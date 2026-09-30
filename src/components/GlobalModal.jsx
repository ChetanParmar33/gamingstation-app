import React from 'react';

export default function GlobalModal() {
  return (
    <>
      <div id="globalModalBackdrop" className="modal-backdrop hidden">
        <div id="globalModalDialog" className="modal-dialog">
          <div className="modal-header">
            <h3 id="globalModalTitle">Modal Title</h3>
            <button type="button" className="modal-close-btn" onClick={() => window.GZ?.Utils?.closeModal()}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div id="globalModalBody" className="modal-body"></div>
          <div id="globalModalFooter" className="modal-footer"></div>
        </div>
      </div>

      <div id="toastContainer" className="toast-container"></div>
    </>
  );
}
