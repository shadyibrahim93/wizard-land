'use client';

import { useEffect } from 'react';

const BuyMeACoffee = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const widgetButtonExists = !!document.getElementById('bmc-wbtn');
    const widgetScriptSrc =
      'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    const scriptAlreadyAdded = !!document.querySelector(
      `script[src="${widgetScriptSrc}"]`
    );

    // If the button OR the script is already on the page, do nothing.
    if (widgetButtonExists || scriptAlreadyAdded) {
      return;
    }

    const script = document.createElement('script');
    script.src = widgetScriptSrc;
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-id', 'wizardland');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute(
      'data-message',
      'Tip a brew, and make dreams come true! ✨☕ Get 5000 💎 for every $1 contributed. Thanks for your support 🙏'
    );
    script.setAttribute('data-color', '#FF813F');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    // onload dispatch so the widget initializes
    script.onload = () => {
      const evt = document.createEvent('Event');
      evt.initEvent('DOMContentLoaded', true, true);
      window.dispatchEvent(evt);
    };

    document.body.appendChild(script);

    // no cleanup: we want this script (and its widget) to persist
  }, []);

  return null;
};

export default BuyMeACoffee;
