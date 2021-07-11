exports['vanilla-resource util addBlockSymbols() Should add correctly 1'] = `
CATEGORY block
+ SYMBOL minecraft:stone {block} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Stone","contributor":"default_library/block"}
+ ------------
+ SYMBOL minecraft:grass_block {block} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Grass_Block","contributor":"default_library/block"}
+ + members:
+ + + SYMBOL minecraft:grass_block.snowy {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"https://minecraft.fandom.com/wiki/Grass_Block#Block_states","contributor":"default_library/block"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:grass_block","snowy","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:grass_block.snowy.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"https://minecraft.fandom.com/wiki/Grass_Block#Block_states","contributor":"default_library/block"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:grass_block.snowy.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"https://minecraft.fandom.com/wiki/Grass_Block#Block_states","contributor":"default_library/block"}
`

exports['vanilla-resource util addRegistriesSymbols() Should add correctly 1'] = `
CATEGORY attribute
+ SYMBOL minecraft:generic.max_health {attribute} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Attribute#Attributes","contributor":"default_library/attribute"}
------------
CATEGORY activity
+ SYMBOL minecraft:core {activity} [Public]
+ + declaration:
+ + + {"uri":"spyglassmc://vanilla-resource/registries.json","contributor":"default_library/activity"}
+ ------------
+ SYMBOL minecraft:idle {activity} [Public]
+ + declaration:
+ + + {"uri":"spyglassmc://vanilla-resource/registries.json","contributor":"default_library/activity"}
+ ------------
+ SYMBOL minecraft:work {activity} [Public]
+ + declaration:
+ + + {"uri":"spyglassmc://vanilla-resource/registries.json","contributor":"default_library/activity"}
------------
CATEGORY block_entity_type
+ SYMBOL minecraft:furnace {block_entity_type} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Furnace#Block_data","contributor":"default_library/block_entity_type"}
------------
CATEGORY custom_stat
+ SYMBOL minecraft:leave_game {custom_stat} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Statistics#List_of_custom_statistic_names","contributor":"default_library/custom_stat"}
------------
CATEGORY enchantment
+ SYMBOL minecraft:protection {enchantment} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Protection","contributor":"default_library/enchantment"}
------------
CATEGORY entity_type
+ SYMBOL minecraft:area_effect_cloud {entity_type} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Area_Effect_Cloud","contributor":"default_library/entity_type"}
------------
CATEGORY fluid
+ SYMBOL minecraft:empty {fluid} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Air","contributor":"default_library/fluid"}
+ ------------
+ SYMBOL minecraft:lava {fluid} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Lava","contributor":"default_library/fluid"}
------------
CATEGORY item
+ SYMBOL minecraft:air {item} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Air","contributor":"default_library/item"}
------------
CATEGORY recipe_serializer
+ SYMBOL minecraft:crafting_shaped {recipe_serializer} [Public]
+ + declaration:
+ + + {"uri":"https://minecraft.fandom.com/wiki/Recipe#crafting_shaped","contributor":"default_library/recipe_serializer"}
------------
CATEGORY sound_event
+ SYMBOL minecraft:ambient.cave {sound_event} [Public]
+ + declaration:
+ + + {"uri":"https://misode.github.io/sounds/?sound=ambient.cave","contributor":"default_library/sound_event"}
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/blocks.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/blocks/data.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/blocks/blocks.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/blocks/simplified/data.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/blocks/simplified/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/commands.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/commands/commands.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getLatestReleases() Should return correctly 1'] = [
  {
    "major": "1.15",
    "latest": "1.15.2"
  },
  {
    "major": "1.16",
    "latest": "1.16.5"
  },
  {
    "major": "1.17",
    "latest": "1.17"
  }
]

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/registries.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/registries/data.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/registries/registries.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/registries/data.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/registries/data.min.json
`

exports['vanilla-resource util transformBlocks() Should transform correctly 1'] = {
  "minecraft:stone": {
    "properties": {},
    "default": {}
  },
  "minecraft:grass_block": {
    "properties": {
      "snowy": [
        "false",
        "true"
      ]
    },
    "default": {
      "snowy": "false"
    }
  }
}

exports['vanilla-resource util transformRegistries() Should transform correctly 1'] = {
  "minecraft:item": [
    "minecraft:stone",
    "minecraft:grass_block"
  ],
  "minecraft:particle": [
    "minecraft:cloud",
    "minecraft:dust",
    "minecraft:item"
  ]
}