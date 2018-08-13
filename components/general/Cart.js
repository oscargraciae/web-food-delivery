// import librairs
import React from 'react';
import { connect } from 'react-redux';

// import local libraries
import { moneyThousand } from '../../utils/formatNumber';
import { clearCart } from '../../actions/cart';

// import components
import ButtonBlock from './ButtonBlock';
import CartItem from './CartItem';

function Cart(props) {
  let total = 0;
  let subtotal = 0;
  let discount = 0;
  props.cart.data.map((item, i) => {
    subtotal = subtotal + item.total;
  });

  if (props.user.bussinesId) {
    discount = subtotal * 0.20;
  }
  
  total = subtotal - discount;

  return (
    <div className="sidecart">
      <div className="sidecart-header">
        <div className="sidecart-heading">Tu orden</div>
      </div>
      { props.user.bussinesId &&
        <div className="sidecart-message">
          <span className="message-text">Por formar parte de {props.user.bussine.name} tienes el <strong>20%</strong> de descuento en todos tus pedidos</span>
          {/* <span className="message-text">20% de descuento en todas tus ordenes</span> */}
        </div>
      }
      <div className="sidecart-body">
        <div className="items-group">
          <ul className="items">
            { props.cart.data.map((item, i) => {
              return (
                <CartItem key={i} {...item} />
              )
            }) }
          </ul>
          { props.cart.data.length > 0 && 
            <a href="#" className="lbl-danger" onClick={() => props.clearCart()}>Limpiar carrito</a>
          }

          { props.cart.data.length === 0 && 
            <div className="empty-cart">
              <p><span>Tu canasta está vacía</span></p>
              <p>Te invitamos a agregar platillos a tu canasta.</p>
            </div> 
          }
        </div>
      </div>
      { props.cart.data.length > 0 &&
        <div className="sidecart-footer">
          <dl className="estimated-total">
            <div className="line-item">
              <dt className="lbl-subtotal">Subtotal</dt><dd className="lbl-subtotal">${moneyThousand(subtotal)}</dd>
            </div>
            <div className="line-item">
              <dt className="lbl-subtotal">Gastos de envío</dt><dd className="lbl-subtotal">GRATIS</dd>
            </div>
            { props.user.bussinesId &&
              <div className="line-item">
                <dt className="lbl-subtotal">Descuento</dt><dd className="lbl-subtotal">-${moneyThousand(discount)}</dd>
              </div>
            }
            <div className="line-item">
              <dt className="lbl-total">Total</dt><dd className="lbl-total">${moneyThousand(total)}</dd>
            </div>
          </dl>
          <a id="btnWebMenuCart" href="/checkout" className="btn btn-primary btn-large btn-block">Comprar</a>
        </div>
      }
      <style jsx>{`
        .menu {
          margin: 20px 0px;
          width: calc(100% - 260px) !important;
        }

        .col-fixed {
          position: sticky !important;
          right: 0;
          top: 80px;
          padding-top: 20px;
      }

        .fluid-container {
          padding-left: 1.8rem;
          padding-right: 1.8rem;
        }

        .sidecart {
          box-sizing: border-box;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-flex: 0;
          -webkit-flex: 0 1 auto;
          -ms-flex: 0 1 auto;
          flex: 0 1 auto;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
          position: fixed;
          width: 300px;
          height: 95%;
          top: 52px;
          right: 0px;
          background: white;
          z-index: 21;
          border-left: 1px solid #e8ebe9;
        }

        .sidecart-header {
          box-sizing: border-box;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-flex: 0;
          -webkit-flex: 0 1 auto;
          -ms-flex: 0 1 auto;
          flex: 0 1 auto;
          border-bottom: 1px solid #e8ebe9;
          margin: 17px 22px 0;
          padding-bottom: 22px;
          padding-top: 3px;
        }

        .sidecart-heading {
          font-weight: bold;
          font-size: 18px;
        }

        .sidecart-body {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 22px;
        }
        
        .sidecart-footer {
          padding: 22px;
          border-top: 1px solid #e8ebe9;
          background: white;
        }

        .estimated-total {
          font-family: "BentonSans", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-style: normal;
          letter-spacing: 0.5px;
          font-size: 14px;
          font-weight: normal;
          line-height: 1;
          letter-spacing: 1px;
          color: #42413E;
          margin-bottom: 50px;
        }

        .line-item {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: row;
          -ms-flex-direction: row;
          flex-direction: row;
          -ms-justify-content: space-between;
          -ms-flex-pack: justify;
          -ms-flex-line-pack: center;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          margin-bottom: 12px;

          font-size: 16px;
        }

        .lbl-total {
          font-size: 14px;
        }

        .lbl-subtotal {
          font-size: 12px;
          font-weight: 300;
        }

        .items {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .empty-cart {
          text-align: center;
          padding: 20px 10px;
          font-size: 14px;
        }

        .empty-cart span {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 20px;
        }

        .sidecart-message {
          text-align: center;
          background-color: #fec825;
          /* padding: 15px 22px; */
          padding: 15px 10px;
        }

        .message-text {
          font-family: "BentonSans", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-style: normal;
          letter-spacing: 0.5px;
          font-size: 14px;
          font-weight: normal;
          color: #42413E;          
        }

        @media (max-width: 600px) {
          .sidecart {
            display: none;
          }
        }

      `}</style>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

export default connect(mapStateToProps, { clearCart })(Cart);