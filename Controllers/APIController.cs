using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class APIController : Controller
    {
        // this controller depends on the NorthwindRepository
        private INorthwindRepository repository;
        public APIController(INorthwindRepository repo) => repository = repo;

        [HttpGet, Route("api/product")]
        // returns all products
        public IEnumerable<Product> Get() => repository.Products.OrderBy(p => p.ProductName);

        [HttpGet, Route("api/product/{id}")]
        // returns specific product
        public Product Get(int id) => repository.Products.FirstOrDefault(p => p.ProductId == id);

        [HttpGet, Route("api/product/discontinued/{discontinued}")]
        // returns all products where discontinued = true/false
        public IEnumerable<Product> GetDiscontinued(bool discontinued) => repository.Products.Where(p => p.Discontinued == discontinued).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product")]
        // returns all products in a specific category
        public IEnumerable<Product> GetByCategory(int CategoryId) => repository.Products.Where(p => p.CategoryId == CategoryId).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product/discontinued/{discontinued}")]
        // returns all products in a specific category where discontinued = true/false
        public IEnumerable<Product> GetByCategoryDiscontinued(int CategoryId, bool discontinued) => repository.Products.Where(p => p.CategoryId == CategoryId && p.Discontinued == discontinued).OrderBy(p => p.ProductName);
        [HttpPost, Route("api/addtocart")]
        // adds a row to the cartitem table
        public CartItem Post([FromBody] CartItemJSON cartItem) => repository.AddToCart(cartItem);

        [HttpGet, Route("api/order")]
        public IEnumerable<Order> GetOrders()
        {
            return repository.Orders.Include("Employee").Include("Customer").OrderBy(o=>o.RequiredDate);
        }
        [HttpGet, Route("api/order/filter/{filter1}/{filter2}/{filter3}/{filter4}")]
        public IEnumerable<Order> GetShipped(string filter1,string filter2,string filter3,string filter4)
        {
            IEnumerable<Order> final=GetOrders();
            if (filter1== "1")
            {
                final = GetOrders().Where(o => o.ShippedDate != null);
            }
            if (filter2=="1")
            {
                final = (final.Count()<GetOrders().Count()?final.Union(GetOrders().Where(o => o.RequiredDate <= DateTime.Now&&o.ShippedDate==null)): GetOrders().Where(o => o.RequiredDate <= DateTime.Now && o.ShippedDate == null));
            }
            if (filter3 == "1")
            {
                final = (final.Count() < GetOrders().Count() ? final.Union(GetOrders().Where(o => o.RequiredDate.Subtract(DateTime.Now).TotalDays < 7&& o.RequiredDate.Subtract(DateTime.Now).TotalDays > 0 && o.ShippedDate==null)) : GetOrders().Where(o => o.RequiredDate.Subtract(DateTime.Now).TotalDays < 7 && o.RequiredDate.Subtract(DateTime.Now).TotalDays > 0 && o.ShippedDate == null));
            }
            if (filter4 == "1")
            {
                final = (final.Count() < GetOrders().Count() ? final.Union(GetOrders().Where(o => o.RequiredDate.Subtract(DateTime.Now).TotalDays > 7)) : GetOrders().Where(o => o.RequiredDate.Subtract(DateTime.Now).TotalDays > 7));
            }
            return final;
        }
        [HttpGet,Route("api/order/filter/{filter1}/{filter2}/{filter3}/{filter4}/afterdate/{Year}/{Month}/{Day}")]
        public IEnumerable<Order> GetOrdersAfterDate(string filter1, string filter2, string filter3, string filter4, int year,int month,int day)
        {
            DateTime myDate = new DateTime(year, month, day);
            return GetShipped(filter1,filter2,filter3,filter4).Where(o => o.OrderDate >= myDate);
        }
    }
}