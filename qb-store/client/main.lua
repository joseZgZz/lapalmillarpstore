local QBCore = exports['qb-core']:GetCoreObject()
local isOpen = false

-- =====================================================================
-- CORE: Abrir / Cerrar
-- =====================================================================
local function OpenStore()
    if isOpen then return end
    QBCore.Functions.TriggerCallback('qb-store:server:GetAllData', function(data)
        if not data then return end
        SetNuiFocus(true, true)
        SendNUIMessage({ action = 'OPEN', data = data })
        isOpen = true
    end)
end

local function CloseStore()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'CLOSE' })
    isOpen = false
end

-- =====================================================================
-- COMANDOS
-- =====================================================================
RegisterCommand('store', function() OpenStore() end, false)

-- =====================================================================
-- NUI CALLBACKS
-- =====================================================================
RegisterNUICallback('close', function(_, cb) CloseStore(); cb('ok') end)

RegisterNUICallback('buyProduct', function(data, cb)
    TriggerServerEvent('qb-store:server:BuyProduct', data.productId)
    cb('ok')
end)

RegisterNUICallback('manageCoins', function(data, cb)
    TriggerServerEvent('qb-store:server:ManageCoins', data.targetId, data.amount, data.action)
    cb('ok')
end)

RegisterNUICallback('toggleBusiness', function(data, cb)
    TriggerServerEvent('qb-store:server:ToggleBusiness', data.bizId)
    cb('ok')
end)

RegisterNUICallback('createProduct', function(data, cb)
    TriggerServerEvent('qb-store:server:CreateProduct', data)
    cb('ok')
end)

RegisterNUICallback('deleteProduct', function(data, cb)
    TriggerServerEvent('qb-store:server:DeleteProduct', data.productId)
    cb('ok')
end)

RegisterNUICallback('createAnnouncement', function(data, cb)
    TriggerServerEvent('qb-store:server:CreateAnnouncement', data)
    cb('ok')
end)

RegisterNUICallback('deleteAnnouncement', function(data, cb)
    TriggerServerEvent('qb-store:server:DeleteAnnouncement', data.annId)
    cb('ok')
end)

RegisterNUICallback('createCategory', function(data, cb)
    TriggerServerEvent('qb-store:server:CreateCategory', data)
    cb('ok')
end)

RegisterNUICallback('deleteCategory', function(data, cb)
    TriggerServerEvent('qb-store:server:DeleteCategory', data.catId)
    cb('ok')
end)

-- =====================================================================
-- EVENTOS DEL SERVIDOR → CLIENTE
-- =====================================================================
RegisterNetEvent('qb-store:client:Notify', function(msg, type)
    QBCore.Functions.Notify(msg, type)
    if isOpen then
        SendNUIMessage({ action = 'NOTIFY', message = msg, ntype = type })
    end
end)

RegisterNetEvent('qb-store:client:UpdateCoins', function(newCoins)
    if isOpen then
        SendNUIMessage({ action = 'UPDATE_COINS', coins = newCoins })
    end
end)
