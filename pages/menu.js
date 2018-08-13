import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import securePage from '../hocs/page';
import api from '../api';
import { addToCart } from '../actions/cart';
import { formatDateString, getDateSumDays } from '../utils/formatDate';

import Layout from '../components/common/Layout';
import MenuCalendar from '../components/menu/MenuCalendar';
import MenuItem from '../components/menu/MenuItem';
import MenuIMobileItem from '../components/menu/MenuIMobileItem';
import Cart from '../components/general/Cart';

class Menu extends React.Component {
  static async getInitialProps({ query }) { 
    const dishes = await api.dish.getAll();
    return {
      dishes,
      id: 2,
    };
  }

  state = {
    deliveryDate: '',
    isLater: false,
    dateString: '',
  }

  componentDidMount() {
    const currentTime = formatDateString(new Date(Date.now()), 'HH:mm');

    console.log("CurrentTime--->", currentTime);
    if(currentTime > "11:00") {
      let newDate = getDateSumDays(new Date(Date.now()), 'YYYY/MM/DD', 1);
      let date = moment(new Date(newDate), "MM-DD-YYYY", "es").locale("mx");
      if(date.day() === 6) {
        newDate = getDateSumDays(new Date(Date.now()), 'YYYY/MM/DD', 3);
      } else if(date.day() === 0) {
        newDate = getDateSumDays(new Date(Date.now()), 'YYYY/MM/DD', 2);
      }

      let dateS = moment(new Date(newDate), "MM-DD-YYYY", "es").locale("mx");
      const weekDayName = dateS.format('dddd');
      const weekDayNumber = dateS.format('DD');
      this.setState({ deliveryDate: newDate, dateString: `${weekDayName} ${weekDayNumber}` });
      // if(currentTime < "14:00") {
      //   this.setState({ isLater: true });
      // }
    } else {
      const newDate = formatDateString(new Date(Date.now()), 'YYYY/MM/DD');
      // const weekDayName = newDate.format('ddd');
      // const weekDayNumber = newDate.format('DD');

      this.setState({ deliveryDate: newDate, isLater: false });
    }
  }

  changeDay = (deliveryDate) => {
    const newDate =  formatDateString(deliveryDate, 'YYYY/MM/DD');
    this.setState({ deliveryDate: newDate });

  }

  addCart = (dish, quantity) => {
    const { deliveryDate } = this.state;
    this.props.addToCart(dish, quantity, deliveryDate);
  }

  render() {
    const dishes = this.props.dishes;
    let total = 0;
    let subtotal = 0;
    let discount = 0;
    this.props.cart.data.map((item, i) => {
      subtotal = subtotal + item.total;
    });

    if (this.props.user.bussinesId) {
      discount = subtotal * 0.20;
    }

    total = subtotal - discount;

    console.log("Info de usuario--->", this.props.user);
    return (
      <Layout {...this.props}>
        <div>
          <div className="alertMenu">
            { !this.state.isLater ?
              <p>Ordena tus platillos para el <strong className="uppercase">{this.state.dateString}</strong> o planifica tu semana.</p> :
              // <p>Los pedidos para entregar hoy se cierran a las 11:00am, ordena tus platillos para el <strong className="uppercase">{this.state.dateString}</strong> o programa para otro día.</p> :
              <p><strong>¡Todavía estas a tiempo!</strong> Los pedidos para entregar hoy cierran a las 11:00am</p>
            }
          </div>
          { this.state.deliveryDate && <MenuCalendar changeDay={this.changeDay} deliveryDate={this.state.deliveryDate} /> }
          <div className="fluid-container">
            <div className="menu">
              <div className="row">
                { dishes.map((item) => {
                  return (
                    <MenuItem {...item} addCart={this.addCart} deliveryDate={this.state.deliveryDate} key={item.id} />
                  )
                }) }
              </div>
              { total > 0 &&
                <div className="btnContainerMobile">
                  <div className="line-item">
                    <dt className="lbl-subtotal">Subtotal</dt><dd className="lbl-subtotal">${subtotal}</dd>
                  </div>
                  { this.props.user.bussinesId && 
                    <div className="line-item">
                      <dt className="lbl-subtotal">Descuento</dt><dd className="lbl-subtotal">${discount}</dd>
                    </div>
                  }
                  <a id="btnMobileMenuCart" href="/checkout" className="btn btn-primary btn-large btn-block">VER CARRITO ${total}</a>
                </div>
              }
            </div>
            <Cart user={this.props.user} />
          </div>
        </div>

        <style jsx>{`
          .menu {
            margin: 20px 0px;
            width: calc(100% - 300px) !important;
          }

          .fluid-container {
            padding-left: 1.8rem;
            padding-right: 1.8rem;
          }

          .btnContainerMobile {
            display: none;
            background: #FFF;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #DDD;
          }

          .alertMenu {
            font-size: 15px;
            font-weight: 400;
            color: #FFFFFF;
            background: #3BCF75;
            padding: 16px;
            text-align: left;
          }

          .alertMenu > p {
            width: 100%;
            margin: 0px;
            padding: 0px;
          }

          .uppercase {
            text-transform: uppercase;
          }

          @media (max-width: 600px) {
            .menu {
              margin: 20px 0px;
              width: 100% !important;
            }

            .btnContainerMobile {
              position: sticky;
              bottom: 0;
              z-index: 100;
              display: block;
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

          }

        `}</style>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

export default securePage(connect(mapStateToProps, { addToCart })(Menu));