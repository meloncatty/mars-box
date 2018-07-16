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
          let checkbox = document.createElement('input')
          checkbox.type = "checkbox"
          itemList.append(item.item, li)
          const grabListItems = document.querySelectorAll('li')
          grabListItems.forEach(item => item.append(checkbox))
          if (item.is_packed) {
            checkbox.classList = 'packed'
            checkbox.checked = true
          }
        })
      })
  } catch(error) {
    console.log(error)
  }
}

appInit()
