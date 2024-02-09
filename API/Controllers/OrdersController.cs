using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.Orders;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {

        private readonly StoreContext _storeContext;
        public OrdersController(StoreContext storeContext)
        {
            _storeContext = storeContext;

        }

        [HttpGet]

        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _storeContext.Orders
                .MapToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _storeContext.Orders
                .MapToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(OrderCreateDto orderDto)
        {
            var basket = await _storeContext.Baskets
                .GetBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();
            if (basket == null) return BadRequest(new ProblemDetails { Title = "Basket not found." });

            var items = new List<OrderedItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _storeContext.Products.FindAsync(item.ProductId);
                var orderedProduct = new OrderedProduct
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderedItem = new OrderedItem
                {
                    OrderedProduct = orderedProduct,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderedItem);

                productItem.QuantityInStock -= item.Quantity;

            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);

            var delivery = subtotal > 100000 ? 0 : 10000;


            var order = new Order
            {
                OrderedItems = items,
                BuyerId = User.Identity.Name,
                Address = orderDto.OrderAddress,
                Subtotal = subtotal,
                DeliveryFee = delivery
            };

            _storeContext.Orders.Add(order);
            _storeContext.Baskets.Remove(basket);
            var user = await _storeContext.Users
                .Include(a => a.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            if (orderDto.SaveAddres)
            {

                var address = new AddressUser
                {
                    Name = orderDto.OrderAddress.Name,
                    LastName = orderDto.OrderAddress.LastName,
                    Adress = orderDto.OrderAddress.Adress,
                    City = orderDto.OrderAddress.City,
                    ZipCode = orderDto.OrderAddress.ZipCode
                };
                user.Address = address;
                _storeContext.Update(user);
            }
            var totalAmmount = subtotal + delivery;
            if (user.AccountStatus >= totalAmmount)
            {
                user.AccountStatus -= totalAmmount;
                _storeContext.Update(user);
                var result = await _storeContext.SaveChangesAsync() > 0;
                if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }


            return BadRequest("Creating order failed!");






        }


        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id)
        {
            var order = await _storeContext.Orders
                .FirstOrDefaultAsync(x => x.Id == id);

            if (order == null)
            {
                return NotFound(new ProblemDetails { Title = "Order not found." });
            }

          
            order.Status = OrderStatus.Wysłane;

            _storeContext.Orders.Update(order);
            await _storeContext.SaveChangesAsync();

            return Ok();
        }


    
    
    }

}