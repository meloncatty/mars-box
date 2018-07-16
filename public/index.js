const itemList = document.querySelector('ul')

function appInit() {
  getItems()
}

function getItems() {
  const url = 'http://localhost:3000/api/v1/essentials'
  try {
    fetch(url)
      .then(res => res.json())
      .then(items => {
        items.forEach(item => {
          let li = document.createElement('li')
          itemList.append(item.item, li)
        })
      })
  } catch(error) {
    console.log(error)
  }
}

appInit()
