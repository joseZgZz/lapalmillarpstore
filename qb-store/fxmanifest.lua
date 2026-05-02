fx_version 'cerulean'
game 'gta5'

author 'Antigravity'
description 'Store script for FiveM QBCore, synced with web'
version '1.0.0'

ui_page 'html/index.html'

dependencies {
    'qb-core',
    'oxmysql'
}

files {
    'html/index.html',
    'html/dist/**/*'
}

shared_scripts {
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

lua54 'yes'
