const isEmoji = str =>
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(
    str,
  )

export const isCorrectName = name => !isEmoji(name) && name.length > 3
