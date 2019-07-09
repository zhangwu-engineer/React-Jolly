const copyToClipBoard = shareURL => {
  const el = document.createElement('textarea');
  const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  el.value = `${window.location.origin}${shareURL}`;
  el.setAttribute('readonly', '');
  el.style.position = 'fixed';
  el.style.opacity = '0';
  el.style.zIndex = '-1';
  el.style.right = '0px';
  el.style.height = '1px';
  el.style.width = '1px';
  el.style.pointerEvents = 'none';
  if (document.body) {
    document.body.appendChild(el);
  }
  if (isiOSDevice) {
    const { contentEditable, readOnly } = el;
    el.contentEditable = true;
    el.readOnly = false;
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);
    el.contentEditable = contentEditable;
    el.readOnly = readOnly;
  } else {
    el.select();
  }
  document.execCommand('copy');
  if (document.body) {
    document.body.removeChild(el);
  }
};

export default copyToClipBoard;
