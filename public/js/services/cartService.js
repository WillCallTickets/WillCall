
angular.module('MyApp')
  .service('CartService', ['$http', '$q', '$stateParams', 'ContextService',
    'Show', 'ShowDate', 'ShowTicket', 'Product', 'ProductSku', 'moment',
    function($http, $q, $stateParams,
             ContextService,
             Show, ShowDate, ShowTicket, Product, ProductSku,
             moment){
    
    // TODO assign ttl for items - merch can live a long time - but not tickets
    
      var _self = this;
      
    
      var cartItem = function(kind, qty, item, description){
        this.idx = kind + '_' + item.id;// essentially a unique id
        this.kind = kind;
        this.qty = qty;
        this.description = description;
        this.item = item;
        //its either productsku or show
        this.itemPrice = item.price;
        this.lineItemTotal = function(){
          return this.qty * this.itemPrice;
        }
        this.mainDesc = (this.description.length) ? this.description[0] : '';
        this.secondaryDesc = (this.description.length > 1) ? this.description.slice(1) : [];
      }
    
      this.getCartTotal = function(){
        return this.cartBasket.reduce(function(prev, cur){
          return prev += cur.lineItemTotal();
        },0);
      };
    
      // move to cart controller/service
      this.addShowTicketToCart = function(item){
        var description = [];
        description.push(item._parentShowDate._parentShow.name);
        description.push(item._parentShowDate._parentShow.venue);
        description.push(moment(item._parentShowDate.dateofshow)
          .format('ddd YYYY/MM/DD hh:mm'));
      
        if(item.name && item.name.trim().length > 0){
          description.push(item.name);
        }
        description.push(item.ages);
      
        var cItem = new cartItem('ticket', 1, angular.copy(item), description);
        this.addItemToCart(cItem);
      };
    
      this.addProductToCart = function(item){
        var description = [];
        description.push(item._parentProduct.name);
        if(item.name && item.name.trim().length > 0){
          description.push(item.name);
        }
        var cItem = new cartItem('product', 1, angular.copy(item), description);
        this.addItemToCart(cItem);
      };
      
      this.addItemToCart = function(cartItem){
        //determine quantity
        var existing = this.cartBasket.filter(function(itm){
          return cartItem.kind === itm.kind && cartItem.item.id === itm.item.id;
        });
        // only allow one of each item type - up to max per order
        if(!existing.length){
          this.cartBasket.push(cartItem);
        }
        this.saveCartBasket();
      };
    
      this.updateQuantity = function(changeItem){
        var newQty = changeItem.qty;
        if(newQty === 0){
          //remove from array
          this.cartBasket = this.cartBasket.filter(function(e){
            return e.idx !== changeItem.idx;
          })
        }
        this.saveCartBasket();
      };
  
      this.saveCartBasket = function(){
        localStorage.setItem('wctCart', JSON.stringify(this.cartBasket));
      };
      this.clearCart = function(){
        this.cartBasket = [];
        this.saveCartBasket();
      };
  
  
      // TODO generate a more robust/unique id
      this.genId = function(){
        return moment.utc().valueOf();
      }
      
      this.initBasket = function(){
        var cart = localStorage.getItem('wctCart');
        if(cart){
          var crt = JSON.parse(cart).map(e => new cartItem(e.kind,e.qty,e.item,e.description));
          return crt;
        } else {
          return [];
        }
      }
      
      this.initCartId = function(){
        var cartId = localStorage.getItem('wctCartId');
        if(cartId){
          return JSON.parse(cartId);
        } else {
          cartId = this.genId();
          localStorage.setItem('wctCartId', JSON.stringify(cartId));
        }
      }
      
      this.cartId = this.initCartId();
      this.cartBasket = this.initBasket();
  
      this.saveCartToDb = function(){
        // console.log('SERVICE SAVING CART')
        // call api to save cart to db
        return $http.post('/api/store/cartrecord', {
          cart: JSON.stringify({idx: this.cartId, items: this.cartBasket})
        })
      }
    
    }]);
    
    
