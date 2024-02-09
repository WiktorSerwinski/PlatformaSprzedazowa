using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Orders
{
    public class Order
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        [Required]
        public OrderAddress Address { get; set; }

        public List <OrderedItem> OrderedItems {get; set;}

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public long Subtotal { get; set;}

        public long DeliveryFee { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Przyjęte;


        public long GetTotalFee()
        {
            return Subtotal+DeliveryFee;
        }


    }
}