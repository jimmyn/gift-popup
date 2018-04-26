import 'whatwg-fetch';
import {render} from 'preact';
import GiftPopup from 'components/GiftPopup';

const defaultConfig = {
  storeUrl: 'https://paez.com',
  open: true,
  collections: []
};

module.exports = _config => {
  const config = Object.assign({}, defaultConfig, _config);
  if (!config.open) return;
  render(<GiftPopup {...config} />, document.body);
};
