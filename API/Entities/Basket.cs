using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items {get; set;} = new();
         public void AddItem(Product product, int quantity)
        {
            if(Items.All(item=>item.ProductId!=product.Id))
            {
                Items.Add(new BasketItem{Product=product,Quantity=quantity});
            }
            var existingItem = Items.FirstOrDefault(item=>item.ProductId==product.Id);
            if(existingItem!=null)existingItem.Quantity+=quantity;
        }


        public void RemoveItem(Product product, int quantity)
        {
            if(Items.All(item=>item.ProductId!=product.Id))
            {
                return;
            }
            var item = Items.FirstOrDefault(item=>item.ProductId==product.Id);
            if(item!=null)
            {
                if(item.Quantity-quantity>0)
                    item.Quantity-=quantity;
                else
                {
                    item.Quantity=0;
                    Items.Remove(item);
                }                   
            }
            return;
        }

        

    }
}