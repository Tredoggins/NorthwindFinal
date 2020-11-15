﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class OrderAPIController : Controller
    {
        private INorthwindRepository repository;
        public OrderAPIController(INorthwindRepository repo) => repository = repo;

        [HttpGet, Route("api/order")]
        public IEnumerable<Order> Get() => repository.Orders.OrderBy(o => o.RequiredDate);
    }
}