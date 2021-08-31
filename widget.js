let ducoUser = "YOUR USERNAME" //input your duino coin user here
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
  titleElement.textOpacity = 0.8
  titleElement.font = Font.mediumSystemFont(14)
  widget.addSpacer(8)
  // Show DUCO balance
  let nameElement = widget.addText(api.username + "'s balance")
  nameElement.textColor = Color.white()
  nameElement.font = Font.systemFont(18)
  widget.addSpacer(2)
  let balanceElement = widget.addText(api.balance.toFixed(2).toString() + " ᕲ")
  //balanceElement.minimumScaleFactor = 0.5
  balanceElement.textColor = Color.white()
  balanceElement.font = Font.boldSystemFont(24)
  widget.addSpacer(1)
  let profitElement = widget.addText("≈ $" + api.profit.toFixed(2).toString())
  profitElement.textColor = Color.white()
  profitElement.textOpacity = 0.6
  profitElement.font = Font.systemFont(13)
  widget.addSpacer(2)
  // Show miners
  let minerElement = widget.addText("Miners: " + api.miner)
  minerElement.textColor = Color.white()
  minerElement.textOpacity = 0.8
  minerElement.font = Font.systemFont(16)
  //widget.addSpacer(1)
  // Show DUCO icon
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
  let prices = await loadPrice() 
  let pricing = prices["Duco price"]
  let result = {
    username: username,
    balance: balance,
    miner: miner,
    profit: balance * pricing
  }
  return result
}

async function loadDocs() {
  let url = "https://server.duinocoin.com/users/" + ducoUser
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadPrice() {
  let url = "https://server.duinocoin.com/api.json"
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadAppIcon() {
  let url = "https://github.com/revoxhere/duino-coin/raw/master/Resources/duco.png"
  let req = new Request(url)
  return req.loadImage()
}


