local QBCore = exports['qb-core']:GetCoreObject()
local Cache = { products = {}, categories = {}, businesses = {}, announcements = {} }

-- =====================================================================
-- CARGA INICIAL DE DATOS
-- =====================================================================
local function RefreshAll()
    MySQL.Async.fetchAll('SELECT * FROM store_products', {}, function(r) if r then Cache.products = r end end)
    MySQL.Async.fetchAll('SELECT * FROM store_categories', {}, function(r) if r then Cache.categories = r end end)
    MySQL.Async.fetchAll('SELECT * FROM store_businesses', {}, function(r) if r then Cache.businesses = r end end)
    MySQL.Async.fetchAll('SELECT * FROM store_announcements ORDER BY date DESC LIMIT 20', {}, function(r) if r then Cache.announcements = r end end)
end

AddEventHandler('onResourceStart', function(res)
    if GetCurrentResourceName() ~= res then return end
    Wait(500) -- Wait just a bit for oxmysql to be ready
    RefreshAll()
    print("[qb-store] ✅ Resource loaded and data cached.")
end)

-- =====================================================================
-- HELPERS
-- =====================================================================
local function IsAdmin(src)
    return QBCore.Functions.HasPermission(src, 'admin') or QBCore.Functions.HasPermission(src, 'god')
end

local function GetCoins(Player)
    return Player.PlayerData.metadata['rpcoins'] or 0
end

local function GetPurchaseHistory(citizenId)
    return MySQL.Sync.fetchAll('SELECT * FROM store_purchases WHERE citizen_id = ? ORDER BY date DESC LIMIT 20', { citizenId })
end

-- =====================================================================
-- CALLBACKS
-- =====================================================================

-- Main callback: send everything the NUI needs
QBCore.Functions.CreateCallback('qb-store:server:GetAllData', function(src, cb)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then cb(nil); return end

    local citizenId = Player.PlayerData.citizenid
    local purchases = GetPurchaseHistory(citizenId)

    -- Recent purchases for the ticker (all players, last 10)
    local recentPurchases = MySQL.Sync.fetchAll('SELECT username, product_name, date FROM store_purchases ORDER BY date DESC LIMIT 10', {})

    cb({
        products      = Cache.products,
        categories    = Cache.categories,
        businesses    = Cache.businesses,
        announcements = Cache.announcements,
        coins         = GetCoins(Player),
        isAdmin       = IsAdmin(src),
        profile = {
            username  = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname,
            citizenId = citizenId,
        },
        myPurchases    = purchases,
        recentPurchases = recentPurchases,
    })
end)

-- =====================================================================
-- COMPRA DE PRODUCTO (usa monedas internas rpcoins)
-- =====================================================================
RegisterServerEvent('qb-store:server:BuyProduct', function(productId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local product = nil
    for _, p in ipairs(Cache.products) do
        if tonumber(p.id) == tonumber(productId) then product = p; break end
    end

    if not product then
        TriggerClientEvent('qb-store:client:Notify', src, "Producto no encontrado.", "error"); return
    end

    local coins = GetCoins(Player)
    if coins < product.price then
        TriggerClientEvent('qb-store:client:Notify', src, "No tienes suficientes monedas CC.", "error"); return
    end

    -- Descuento de monedas
    Player.Functions.SetMetaData('rpcoins', coins - product.price)

    -- Dar ítem QBCore
    if product.item and product.item ~= 'none' and product.item ~= '' then
        Player.Functions.AddItem(product.item, 1)
        TriggerClientEvent('inventory:client:ItemBox', src, QBCore.Shared.Items[product.item], 'add')
    end

    -- Guardar historial
    local citizenId = Player.PlayerData.citizenid
    local username  = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
    MySQL.Async.execute(
        'INSERT INTO store_purchases (citizen_id, username, product_id, product_name, price) VALUES (?,?,?,?,?)',
        { citizenId, username, product.id, product.name, product.price }
    )

    TriggerClientEvent('qb-store:client:Notify', src, "Compraste " .. product.name .. " por " .. product.price .. " CC", "success")
    
    -- Enviar datos actualizados a la NUI
    TriggerClientEvent('qb-store:client:UpdateCoins', src, coins - product.price)
end)

-- =====================================================================
-- ADMIN: DAR / QUITAR MONEDAS
-- =====================================================================
RegisterServerEvent('qb-store:server:ManageCoins', function(targetServerId, amount, action)
    local src = source
    if not IsAdmin(src) then return end

    local Target = QBCore.Functions.GetPlayer(tonumber(targetServerId))
    if not Target then
        TriggerClientEvent('qb-store:client:Notify', src, "Jugador no encontrado (ID: " .. targetServerId .. ")", "error"); return
    end

    local currentCoins = GetCoins(Target)
    local newCoins = action == 'add' and (currentCoins + tonumber(amount)) or math.max(0, currentCoins - tonumber(amount))
    Target.Functions.SetMetaData('rpcoins', newCoins)

    local msg = action == 'add' and ("✅ Dadas " .. amount .. " CC a " .. Target.PlayerData.charinfo.firstname) or ("➖ Quitadas " .. amount .. " CC a " .. Target.PlayerData.charinfo.firstname)
    TriggerClientEvent('qb-store:client:Notify', src, msg, "success")
    TriggerClientEvent('qb-store:client:Notify', Target.PlayerData.source, (action == 'add' and "Recibiste " or "Se te quitaron ") .. amount .. " monedas CC.", action == 'add' and "success" or "error")
end)

-- =====================================================================
-- ADMIN: TOGGLE NEGOCIO
-- =====================================================================
RegisterServerEvent('qb-store:server:ToggleBusiness', function(bizId)
    local src = source
    if not IsAdmin(src) then return end
    for i, b in ipairs(Cache.businesses) do
        if b.id == tonumber(bizId) then
            local newStatus = b.status == 1 and 0 or 1
            MySQL.Async.execute('UPDATE store_businesses SET status=? WHERE id=?', { newStatus, bizId }, function()
                Cache.businesses[i].status = newStatus
            end)
            break
        end
    end
end)

-- =====================================================================
-- ADMIN: CREAR PRODUCTO
-- =====================================================================
RegisterServerEvent('qb-store:server:CreateProduct', function(data)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute(
        'INSERT INTO store_products (name, description, price, item, image, category) VALUES (?,?,?,?,?,?)',
        { data.name, data.description, data.price, data.item, data.image, data.category },
        function() RefreshAll() end
    )
    TriggerClientEvent('qb-store:client:Notify', src, "Producto creado: " .. data.name, "success")
end)

-- =====================================================================
-- ADMIN: ELIMINAR PRODUCTO
-- =====================================================================
RegisterServerEvent('qb-store:server:DeleteProduct', function(productId)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute('DELETE FROM store_products WHERE id=?', { productId }, function()
        RefreshAll()
    end)
    TriggerClientEvent('qb-store:client:Notify', src, "Producto eliminado.", "success")
end)

-- =====================================================================
-- ADMIN: CREAR ANUNCIO
-- =====================================================================
RegisterServerEvent('qb-store:server:CreateAnnouncement', function(data)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute(
        'INSERT INTO store_announcements (title, content, category) VALUES (?,?,?)',
        { data.title, data.content, data.category },
        function() RefreshAll() end
    )
    TriggerClientEvent('qb-store:client:Notify', src, "Anuncio publicado.", "success")
end)

-- =====================================================================
-- ADMIN: ELIMINAR ANUNCIO
-- =====================================================================
RegisterServerEvent('qb-store:server:DeleteAnnouncement', function(annId)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute('DELETE FROM store_announcements WHERE id=?', { annId }, function()
        RefreshAll()
    end)
end)

-- =====================================================================
-- ADMIN: CREAR CATEGORÍA
-- =====================================================================
RegisterServerEvent('qb-store:server:CreateCategory', function(data)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute(
        'INSERT INTO store_categories (name, icon) VALUES (?,?)',
        { data.name, data.icon },
        function() RefreshAll() end
    )
end)

-- =====================================================================
-- ADMIN: ELIMINAR CATEGORÍA
-- =====================================================================
RegisterServerEvent('qb-store:server:DeleteCategory', function(catId)
    local src = source
    if not IsAdmin(src) then return end
    MySQL.Async.execute('DELETE FROM store_categories WHERE id=?', { catId }, function()
        RefreshAll()
    end)
end)
