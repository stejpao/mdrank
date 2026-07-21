export const GA_MEASUREMENT_ID = "G-KEB95QJD5F";

export const GA_CONSENT_BOOTSTRAP = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}', {
    'send_page_view': false,
    'anonymize_ip': true
  });
`;
