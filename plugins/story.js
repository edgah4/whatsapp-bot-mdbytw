const { story, bot, generateList } = require('../lib/')

bot(
  {
    pattern: 'story ?(.*)',
    fromMe: true,
    desc: 'Download Instagram stories',
    type: 'download',
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match) return await message.send('_Example : story username_')
    const result = await story(match)
    if (!result.length)
      return await message.send('*Not found*', {
        quoted: message.quoted,
      })
    if (result.length > 1) {
      return await message.send(
        generateList(
          result.map((url, index) => ({
            id: `upload ${url}`,
            text: `${index + 1}/${result.length}`,
          })),
          `*Total ${result.length} stories*\n`,
          message.jid,
          message.participant
        )
      )
      // const msg = genListMessage(
      // 	result.map((url, index) => ({
      // 		id: `upload ${url}`,
      // 		text: `${index + 1}/${result.length}`,
      // 	})),
      // 	`Total ${result.length} stories`,
      // 	'Download'
      // )
      // return await message.send(msg, { quoted: message.data }, 'list')
    }
    for (const url of result) {
      await message.sendFromUrl(url)
    }
  }
)
