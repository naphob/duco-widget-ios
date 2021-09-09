// DUCO Widget for iOS © MIT licensed
// Version 1.1
// Naphob (naphob@gmail.com)

const ducoUser = "YOUR USERNAME" //input your duino coin username here
const colors = {
  gradientBackground: {
    primary: {
      start : "ff4112",
      end: "ffb412"
    },
    medium: {
      start : "4A00E0",
      end: "8E2DE2"
    },
    premium: {
      start : "232526",
      end: "414345"
    }
  },  
  text: {
    primary: "ffffff"
  } 
}
const gradientStart = new Point(0.75, 1)
const gradientEnd = new Point(0.05, 0)

const api = await userData()
const widget = await createWidget(api)

if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  //widget.presentMedium()
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  let appIcon = await loadAppIcon()
  const title = "Duino Coin"
  let widget = new ListWidget()
  // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = await setBackgroundColor(api.balance)
  gradient.startPoint = gradientStart
  gradient.endPoint = gradientEnd
  widget.backgroundGradient = gradient
  // Show title
  let titleStack = widget.addStack()
  let titleElement = titleStack.addText(title)
  titleElement.textColor = new Color(colors.text.primary)
  titleElement.textOpacity = 0.8
  titleElement.font = Font.mediumSystemFont(14)
  widget.addSpacer(8)
  // Show DUCO balance
  let userStack = widget.addStack()
  userStack.centerAlignContent()
  let nameElement = userStack.addText(api.username + "'s balance")
  nameElement.textColor = new Color(colors.text.primary)
  nameElement.font = Font.systemFont(18)
  // Show veriftied badge
  if (api.verified === "yes") {
    userStack.addSpacer(5)
    let tmpSF = SFSymbol.named('checkmark.circle.fill')
    let wImg = userStack.addImage(tmpSF.image)
    wImg.tintColor = new Color(colors.text.primary)
    wImg.imageSize = new Size(14, 14)
  }
  widget.addSpacer(2)
  let balanceElement = widget.addText(api.balance.toFixed(2).toString() + " ᕲ")
  balanceElement.textColor =  new Color(colors.text.primary)
  balanceElement.font = Font.boldSystemFont(22)
  widget.addSpacer(1)
  let profitElement = widget.addText("≈ $" + api.balanceInUSD.toFixed(2).toString())
  profitElement.textColor =  new Color(colors.text.primary)
  profitElement.textOpacity = 0.6
  profitElement.font = Font.systemFont(14)
  widget.addSpacer(2)
  // Show miners
  let bottomStack = widget.addStack()
  let minerElement = bottomStack.addText("Miners: " + api.miner)
  minerElement.textColor =  new Color(colors.text.primary)
  minerElement.textOpacity = 0.8
  minerElement.font = Font.systemFont(16)
  minerElement.leftAlignText()
  // Show DUCO icon
  bottomStack.addSpacer(null)
  let appIconElement = bottomStack.addImage(appIcon)
  appIconElement.imageSize = new Size(25, 25)
  appIconElement.rightAlignImage() 

  return widget
}

async function userData() {
  let docs = await loadDocs()
  let username = docs["result"]["balance"]["username"]
  let balance = docs["result"]["balance"]["balance"]
  let miner = docs["result"]["miners"].length
  let verified = docs["result"]["balance"]["verified"]
  let prices = await loadPrice() 
  let price = prices["Duco price"]
  let result = {
    username: username,
    balance: balance,
    miner: miner,
    verified: verified,
    balanceInUSD: balance * price
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

async function setBackgroundColor(balance) {
  if (balance <= 1000) {
    let backgroundGradient = [new Color(colors.gradientBackground.primary.start),
    new Color(colors.gradientBackground.primary.end)]
    return backgroundGradient
  } else if (balance > 1000 && balance <= 10000) {
    let backgroundGradient = [new Color(colors.gradientBackground.medium.start),
    new Color(colors.gradientBackground.medium.end)]
    return backgroundGradient
  } else {
    let backgroundGradient = [new Color(colors.gradientBackground.premium.start),
    new Color(colors.gradientBackground.premium.end)]
    return backgroundGradient
  } 
}


