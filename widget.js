let ducoUser = "YOUR USERNAME"
let api = await userData()
let widget = await createWidget(api)

if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  let appIcon = await loadAppIcon()
  let title = "Duino Coin"
  let widget = new ListWidget()
    // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("ff4112"),
    new Color("ffb412")
  ]
  gradient.startPoint = new Point(0.75, 1)
  gradient.endPoint = new Point(0.05, 0)
  widget.backgroundGradient = gradient
  // Show app icon and title
  let titleStack = widget.addStack()
  let titleElement = titleStack.addText(title)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(13)
  widget.addSpacer(12)
  // Show API
  let nameElement = widget.addText(api.username + "'s balance")
  nameElement.textColor = Color.white()
  nameElement.font = Font.systemFont(18)
  widget.addSpacer(2)
  let descriptionElement = widget.addText(api.balance.toFixed(2).toString()+" ᕲ")
  descriptionElement.minimumScaleFactor = 0.5
  descriptionElement.textColor = Color.white()
  descriptionElement.font = Font.boldSystemFont(24)
   let minerElement = widget.addText("Miners: " + api.miner)
  minerElement.textColor = Color.white()
  minerElement.textOpacity = 0.7
  minerElement.font = Font.systemFont(16)
  widget.addSpacer(2)

  let appIconElement = widget.addImage(appIcon)
  appIconElement.imageSize = new Size(25, 25)
  appIconElement.cornerRadius = 4
  appIconElement.rightAlignImage()
 
  return widget
}

async function userData() {
  let docs = await loadDocs()
  let username = docs["result"]["balance"]["username"]
  let balance = docs["result"]["balance"]["balance"]
  let miner = docs["result"]["miners"].length
  return {
    username: username,
    balance: balance,
    miner: miner
  }
}

async function loadDocs() {
  let url = "https://server.duinocoin.com/users/"+ducoUser
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadAppIcon() {
  let url = "https://github.com/revoxhere/duino-coin/raw/master/Resources/duco.png"
  let req = new Request(url)
  return req.loadImage()
}
