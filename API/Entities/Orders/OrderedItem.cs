using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Orders
{
    public class OrderedItem
    {
        public int Id { get; set; }

        public OrderedProduct OrderedProduct { get; set;}

        public long Price {get; set;}

        public int Quantity { get; set; }
    }
}