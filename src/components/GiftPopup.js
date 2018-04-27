import cn from './GiftPopup.css';
import {Component} from 'preact';
import {resizeImage, frontApi} from '../utils';
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
    const {collections, tag, openDelay, minCartTotal} = this.props;
    const promises = collections.map(c => frontApi.get(`/collections/${c.handle}/products.json`));
    promises.push(frontApi.get('/cart.js'));
    Promise.all(promises).then(results => {
      const products = {};
      const cart = results.pop();
      if (cart.total_price / 100 < minCartTotal) return;
      if (cart.items.some(item => item.properties && item.properties.gift)) return;
      collections.forEach(({handle}, i) => {
        products[handle] = results[i].products.filter(p => p.tags.includes(tag));
      });
      setTimeout(() => {
        this.setState({
          open: true,
          products
        });
      }, openDelay);
      setTimeout(() => {
        this.setState({visible: true});
      }, openDelay + 100);
    });
  }

  handleClose = e => {
    e && e.preventDefault();
    this.setState({visible: false});
    setTimeout(() => {
      this.setState({open: false});
    }, 500);
  };

  getVariants(product) {
    if (!product) return;
    const filter = this.props.variantFilter;
    return product.variants.filter(v => Object.keys(filter).every(key => v[key] === filter[key]));
  }

  selectCollection(handle) {
    this.setState({
      selectedCollection: handle,
      selectedProductIndex: null,
      selectedVariantId: null
    });
  }

  selectProduct(i) {
    this.setState({
      selectedProductIndex: i,
      selectedVariantId: null
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    frontApi
      .post('/cart/add.js', {
        quantity: 1,
        id: this.state.selectedVariantId,
        properties: {gift: true}
      })
      .then(() => {
        this.handleClose();
      });
  };

  componentDidMount() {
    this.fetchResources();
  }

  render(
    {header, collections, buttonText, variantName, buttonClass},
    {open, visible, products, selectedCollection, selectedProductIndex, selectedVariantId}
  ) {
    if (!open) return null;
    const productItems = products[selectedCollection];
    const selectedProduct = productItems[selectedProductIndex];
    const variants = this.getVariants(selectedProduct);
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
            <div className={cn.collectionSelector}>
              {collections.map(c => (
                <div
                  onClick={() => this.selectCollection(c.handle)}
                  className={cx(cn.collectionItem, {
                    [cn.collectionItem__active]: c.handle === selectedCollection
                  })}
                  key={c.handle}>
                  {c.title}
                </div>
              ))}
            </div>
            <div className={cn.productSelector}>
              {productItems.map((p, i) => (
                <div
                  onClick={() => this.selectProduct(i)}
                  className={cx(cn.productItem, {
                    [cn.productItem__active]: i === selectedProductIndex
                  })}
                  key={p.handle}>
                  <div className={cn.productImage}>
                    <img src={resizeImage(p.images[0].src)} alt={p.title} />
                    <img src={resizeImage(p.images[1].src)} alt={p.title} />
                  </div>
                  <div className={cn.productTitle}>{p.title}</div>
                </div>
              ))}
            </div>
            {variants &&
              variants.length > 0 && (
                <div className={cn.variantSelector}>
                  {variantName}:
                  {variants.map(v => (
                    <div
                      onClick={() => this.setState({selectedVariantId: v.id})}
                      className={cx(cn.variantItem, {
                        [cn.variantItem__active]: v.id === selectedVariantId
                      })}
                      key={v.id}>
                      {v.option1}
                    </div>
                  ))}
                </div>
              )}
            <div className={cn.modalFooter}>
              <button
                onClick={this.handleSubmit}
                className={cx(cn.button, buttonClass)}
                disabled={!selectedVariantId}>
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GiftPopup;
