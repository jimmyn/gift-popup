import cn from './GiftPopup.css';
import {Component} from 'preact';
import {fetchJSON} from '../utils';
import cx from 'classnames';

class GiftPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      visible: false
    };
  }

  fetchResources() {
    const {collections, tag, storeUrl} = this.props;
    const promises = collections.map(c =>
      fetchJSON(`${storeUrl}/collections/${c.handle}/products.json`)
    );
    Promise.all(promises).then(results => {
      const data = collections.map(({title, handle}, i) => ({
        handle,
        title,
        products: results[i].products.filter(p => p.tags.includes(tag))
      }));
      this.setState({
        open: true,
        collections: data
      });
      setTimeout(() => {
        this.setState({visible: true});
      }, 100);
    });
  }

  handleClose = e => {
    e.preventDefault();
    this.setState({visible: false});
    setTimeout(() => {
      this.setState({open: false});
    }, 500);
  };

  componentDidMount() {
    this.fetchResources();
  }

  render({header}, {open, visible, collections}) {
    if (!open) return null;
    return (
      <div className={cx(cn.container, {[cn.container__visible]: visible})}>
        <div className={cn.backdrop} />
        <div className={cn.content}>
          <div className={cn.modal}>
            <div className={cn.modalHeader}>
              <div className={cn.modalTitle}>{header}</div>
              <a href="#" className={cn.modalClose} onClick={this.handleClose}>
                &times;
              </a>
            </div>
            <div className={cn.modalBody}>Body</div>
            <div className={cn.modalFooter}>Footer</div>
          </div>
        </div>
      </div>
    );
  }
}

export default GiftPopup;
