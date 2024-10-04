import React from 'react';
import './productModal.css'; // Styles for the modal

const ProductModal = ({ product, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="cormorant-garamond-semibold">{product.name}</h3>
        <div className="modal-images">
          {product.product_images.map((image, index) => (
            <img key={index} src={image} alt={`${product.name} - ${index + 1}`} />
          ))}
        </div>
        <button className="close-modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductModal;
