import cn from './GiftPopup.css';
import {Component} from 'preact';
import {fetchJSON, resizeImage} from '../utils';
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
      collections.forEach(({handle}, i) => {
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

  componentDidMount() {
    this.fetchResources();
  }

  render(
    {header, collections},
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
                  {selectedProduct.options[0].name}:
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
            <div className={cn.modalFooter}>Footer</div>
          </div>
        </div>
      </div>
    );
  }
}

export default GiftPopup;
