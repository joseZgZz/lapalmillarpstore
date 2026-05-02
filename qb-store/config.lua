Config = {}

Config.ApiUrl = "http://localhost:5000/api" -- Adjust to your backend URL
Config.Currency = "cash" -- 'cash', 'bank', 'crypto'

-- Manual products if API is not used
Config.Products = {
    { id = "1", name = "Basic VIP", price = 1000, item = "vip_basic", image = "https://via.placeholder.com/150" },
    { id = "2", name = "Premium VIP", price = 5000, item = "vip_premium", image = "https://via.placeholder.com/150" },
}
