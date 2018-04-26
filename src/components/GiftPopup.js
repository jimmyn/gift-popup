import cn from './GiftPopup.css';
import {Component} from 'preact';
import {fetchJSON} from '../utils';
import cx from 'classnames';

class GiftPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      visible: false,
      selectedCollection: props.collections[0].handle
    };
  }

  fetchResources() {
    const {collections, tag, storeUrl} = this.props;
    const promises = collections.map(c =>
      fetchJSON(`${storeUrl}/collections/${c.handle}/products.json`)
    );
    Promise.all(promises).then(results => {
      const products = {};
      collections.forEach(({title, handle}, i) => {
        products[handle] = results[i].products.filter(p => p.tags.includes(tag));
      });
      this.setState({
        open: true,
        products
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

  render({header, collections}, {open, visible, products, selectedCollection}) {
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
            <div className={cn.modalBody}>
              <div className={cn.collectionSelector}>
                {collections.map(c => (
                  <div
                    onClick={() => this.setState({selectedCollection: c.handle})}
                    className={cx(cn.collectionItem, {
                      [cn.collectionItem__active]: c.handle === selectedCollection
                    })}
                    key={c.handle}>
                    {c.title}
                  </div>
                ))}
              </div>
              <div className={cn.productsSelector}>
                {products[selectedCollection].map(p => (
                  <div className={cn.productItem}>
                    <div className={cn.productImage}>
                      <img src={p.images[0].src} alt={p.title} />
                      <img src={p.images[1].src} alt={p.title} />
                    </div>
                    {p.title}
                  </div>
                ))}
              </div>
            </div>
            <div className={cn.modalFooter}>Footer</div>
          </div>
        </div>
      </div>
    );
  }
}

export default GiftPopup;
