import {render} from 'preact';
import GiftPopup from 'components/GiftPopup';

const defaultConfig = {
  open: true,
  collections: [],
  header: 'Select your gift!',
  buttonText: 'Receive the gift',
  openDelay: 0
};

module.exports = _config => {
  const config = Object.assign({}, defaultConfig, _config);
  if (!config.open) return;
  render(<GiftPopup {...config} />, document.body);
};
